// ─── Types ───────────────────────────────────────────────
export interface ScannedSubject {
  courseNumber: string;
  title: string;
  grade: number;
  units: number;
  termLabel: string;
  yearLevel: string;
  termPeriod: string;
  isExcluded: boolean;
}

export interface ScanResult {
  success: boolean;
  subjects: ScannedSubject[];
  error?: string;
}

// ─── Parsed AI Response Type ─────────────────────────────
interface ParsedSubject {
  courseNumber: string;
  title: string;
  grade?: number | string;
  units?: number | string;
  termLabel?: string;
}

// ─── Excluded Keywords ───────────────────────────────────
const EXCLUDED_KEYWORDS = [
  'NSTP', 'NATIONAL SERVICE TRAINING',
  'CWTS', 'LTS', 'ROTC',
  'PAHF', 'MOVEMENT COMPETENCY',
  'EXERCISE-BASED FITNESS', 'DANCE AND SPORTS',
  'PATHFIT', 'PHYSICAL ACTIVITY', 'PHYSICAL EDUCATION',
  'CAED',
];

const isExcluded = (name: string): boolean => {
  const upper = name.toUpperCase();
  return EXCLUDED_KEYWORDS.some(k => upper.includes(k.toUpperCase()));
};

// ─── Term Parser ─────────────────────────────────────────
// Parses "1ST SEMESTER 2024-25" → { yearLevel, termPeriod }
const parseTerm = (termLabel: string): { yearLevel: string; termPeriod: string } => {
  const label = termLabel.toUpperCase();

  // Parse term period
  let termPeriod = '1st Semester';
  if (label.includes('2ND SEMESTER')) termPeriod = '2nd Semester';
  else if (label.includes('1ST SEMESTER')) termPeriod = '1st Semester';
  else if (label.includes('SUMMER')) termPeriod = 'Summer';

  // Parse year level
  let yearLevel = '1st Year';
  if (label.includes('4TH YEAR')) yearLevel = '4th Year';
  else if (label.includes('3RD YEAR')) yearLevel = '3rd Year';
  else if (label.includes('2ND YEAR')) yearLevel = '2nd Year';
  else if (label.includes('1ST YEAR')) yearLevel = '1st Year';

  return { yearLevel, termPeriod };
};

// ─── Image to Base64 ─────────────────────────────────────
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // strip data:image/...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ─── Main Scanner ────────────────────────────────────────
// ─── Main Scanner ────────────────────────────────────────
export const scanPortalScreenshot = async (
  files: File[]
): Promise<ScanResult> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        subjects: [],
        error: 'Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.',
      };
    }

    const imageParts = await Promise.all(
      files.map(async file => ({
        inlineData: {
          mimeType: file.type,
          data: await fileToBase64(file),
        },
      }))
    );

    const prompt = `
You are an academic data extractor for UMDC (University of Mindanao Digos Campus) student portal screenshots.

Extract ALL subject rows from the provided screenshot(s) of the Student's Permanent Record.

For each subject row, extract:
1. courseNumber — the course code (e.g., "CCE 101/L", "GE 15", "NSTP 1")
2. title — the descriptive title of the course (e.g., "INTRODUCTION TO COMPUTING")
3. grade — the Final Grade as a number (e.g., 3.5, 4.0, 3.0). IMPORTANT: If the grade shows "0.0" or "0", set it to exactly 0. Do NOT change 0 grades to any other value.
4. units — the Unit value as a number (e.g., 3.0, 6.0, 2.0)
5. termLabel — the full term label in red text above the subjects (e.g., "1ST SEMESTER 2024-25 | 1ST YEAR-COLLEGE OF COMPUTING EDUCATION")

Rules:
- Skip rows that are headers or term title rows (the red colored rows)
- Include NSTP, PAHF, PE subjects — include everything, the app will handle exclusions
- If a subject has no grade (blank Final Grade), set grade to 0
- If a subject shows 0.0 as Final Grade, keep it as 0 — do NOT default to any other grade
- Return ONLY valid JSON, no markdown, no explanation, no code blocks
- The JSON must be an array of objects with these exact keys: courseNumber, title, grade, units, termLabel

Example output:
[
  {
    "courseNumber": "CCE 101/L",
    "title": "INTRODUCTION TO COMPUTING",
    "grade": 3.5,
    "units": 3.0,
    "termLabel": "1ST SEMESTER 2024-25 | 1ST YEAR-COLLEGE OF COMPUTING EDUCATION"
  },
  {
    "courseNumber": "GE 11",
    "title": "THE ENTREPRENEURIAL MIND",
    "grade": 0,
    "units": 3.0,
    "termLabel": "SUMMER 2026 | 2ND YEAR-COLLEGE OF COMPUTING EDUCATION"
  }
]
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                ...imageParts,
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return {
        success: false,
        subjects: [],
        error: `Gemini API error: ${err?.error?.message ?? response.statusText}`,
      };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const cleaned = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      return {
        success: false,
        subjects: [],
        error: 'Unexpected response format from AI. Please try again.',
      };
    }

    const subjects: ScannedSubject[] = parsed
      .filter((item: ParsedSubject) => item.courseNumber && item.title)
      .map((item: ParsedSubject) => {
        const { yearLevel, termPeriod } = parseTerm(item.termLabel ?? '');

        // ── Fix: properly parse grade including 0 ──
        const rawGrade = item.grade;
        const parsedGrade = (rawGrade !== undefined && rawGrade !== null && rawGrade !== '')
          ? parseFloat(String(rawGrade))
          : 0;
        const grade = isNaN(parsedGrade) ? 0 : parsedGrade;

        return {
          courseNumber: String(item.courseNumber).trim(),
          title: String(item.title).trim(),
          grade,
          units: (item.units !== undefined && item.units !== null && item.units !== '')
            ? parseFloat(String(item.units)) || 3
            : 3,
          termLabel: String(item.termLabel ?? '').trim(),
          yearLevel,
          termPeriod,
          isExcluded: isExcluded(String(item.courseNumber)) ||
            isExcluded(String(item.title)),
        };
      });

    return { success: true, subjects };

  } catch (err) {
    return {
      success: false,
      subjects: [],
      error: err instanceof Error
        ? err.message
        : 'An unexpected error occurred during scanning.',
    };
  }
};