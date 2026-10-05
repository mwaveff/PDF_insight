import { InsightSchema, type InsightData } from './types/schema';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://pdf-insight-7num.onrender.com/api/analyze';

export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function validatePdf(file: File): string | null {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Dozwolone są wyłącznie pliki PDF.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'Maksymalny rozmiar pliku wynosi 10 MB.';
  }
  return null;
}

function errorDetail(body: unknown): string | null {
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    return typeof body.detail === 'string' ? body.detail : null;
  }
  return null;
}

export async function analyzePdf(file: File, signal?: AbortSignal): Promise<InsightData> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_URL, { method: 'POST', body: formData, signal });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new Error(errorDetail(body) ?? `Błąd serwera (${response.status})`);
  }

  const parsed = InsightSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Serwer zwrócił dane w nieprawidłowym formacie.');
  }
  return parsed.data;
}
