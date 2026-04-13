// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string; numpages: number }>;
import { readFile } from 'fs/promises';

export interface PdfParseResult {
  text: string;
  numPages: number;
}

const MAX_TEXT_CHARS = 15_000;

export async function parsePdf(filePath: string): Promise<PdfParseResult> {
  const buffer = await readFile(filePath);
  const data = await pdfParse(buffer);

  const text = data.text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_TEXT_CHARS);

  return {
    text,
    numPages: data.numpages,
  };
}
