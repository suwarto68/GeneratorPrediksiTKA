import * as XLSX from 'xlsx';
import { AssessmentItem, ElementType, UploadedDoc } from '../types';

export async function parseUploadedFile(file: File): Promise<{
  doc: UploadedDoc;
  extractedItems: AssessmentItem[];
}> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  let rawText = '';
  const detectedItems: AssessmentItem[] = [];

  if (extension === 'xlsx' || extension === 'xls') {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    rawText = jsonData.map(row => (Array.isArray(row) ? row.join(' | ') : String(row))).join('\n');

    // Attempt structured extraction if rows look like a table
    jsonData.forEach((row, idx) => {
      if (idx === 0) return; // header
      if (!Array.isArray(row) || row.length < 3) return;

      const rowStr = row.join(' ');
      const elem = detectElement(rowStr);
      if (elem) {
        detectedItems.push({
          id: `UPLOAD-XLS-${idx}`,
          no: detectedItems.length + 1,
          tahun: 2027,
          jenjang: 'SMP/MTs',
          fase: 'Fase D',
          mata_pelajaran: 'Matematika',
          elemen: elem,
          subelemen: String(row[1] || 'Materi Pokok'),
          kompetensi: String(row[2] || 'Kompetensi Acuan'),
          indikator_prediktif: String(row[3] || row[2] || 'Indikator pembelajaran'),
          level_kognitif: detectCognitive(rowStr),
          bentuk_soal: detectQuestionForm(rowStr),
          stimulus: 'Tabel',
          konteks: 'Sekolah',
          prioritas_prediktif: 'Prioritas Tinggi',
          skor_prediksi: 88,
          alasan: `Diekstrak langsung dari baris tabel file ${file.name}.`,
          sumber_acuan: `${file.name} (Baris ${idx + 1})`,
          status_label: 'Data Sumber'
        });
      }
    });
  } else {
    // TXT, DOCX, or other text-readable formats
    try {
      rawText = await file.text();
    } catch {
      rawText = `[Konten biner ${file.name} ukuran ${file.size} bytes]`;
    }

    // Parse lines to detect indicators
    const lines = rawText.split('\n');
    let currentElem: ElementType = 'Bilangan';

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 15) return;

      const detected = detectElement(trimmed);
      if (detected) currentElem = detected;

      if (
        trimmed.toLowerCase().includes('indikator') ||
        trimmed.toLowerCase().includes('peserta didik dapat') ||
        trimmed.toLowerCase().includes('menentukan') ||
        trimmed.toLowerCase().includes('menghitung') ||
        trimmed.toLowerCase().includes('menganalisis')
      ) {
        detectedItems.push({
          id: `UPLOAD-TXT-${lineIdx}`,
          no: detectedItems.length + 1,
          tahun: 2027,
          jenjang: 'SMP/MTs',
          fase: 'Fase D',
          mata_pelajaran: 'Matematika',
          elemen: currentElem,
          subelemen: 'Topik Dokumen Sumber',
          kompetensi: 'Kompetensi Capaian Fase D',
          indikator_prediktif: trimmed.replace(/^[\d\.\-\*\s]+/, ''),
          level_kognitif: detectCognitive(trimmed),
          bentuk_soal: detectQuestionForm(trimmed),
          stimulus: 'Teks',
          konteks: 'Kehidupan sehari-hari',
          prioritas_prediktif: 'Prioritas Menengah',
          skor_prediksi: 85,
          alasan: `Diekstrak dari teks acuan ${file.name}.`,
          sumber_acuan: `${file.name} (Baris ${lineIdx + 1})`,
          status_label: 'Data Sumber'
        });
      }
    });
  }

  const doc: UploadedDoc = {
    id: `doc-${Date.now()}`,
    name: file.name,
    size: file.size,
    type: extension.toUpperCase(),
    uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    extractedText: rawText.slice(0, 5000),
    detectedCount: detectedItems.length,
    status: 'Terekstraksi',
    sourceTag: 'Dokumen Tambahan Pengguna'
  };

  return { doc, extractedItems: detectedItems };
}

function detectElement(text: string): ElementType | null {
  const lower = text.toLowerCase();
  if (lower.includes('aljabar') || lower.includes('persamaan') || lower.includes('spldv') || lower.includes('plsv') || lower.includes('gradien')) {
    return 'Aljabar';
  }
  if (lower.includes('geometri') || lower.includes('pythagoras') || lower.includes('sudut') || lower.includes('bangun datar') || lower.includes('prisma') || lower.includes('lingkaran')) {
    return 'Geometri dan Pengukuran';
  }
  if (lower.includes('data') || lower.includes('peluang') || lower.includes('statistika') || lower.includes('diagram') || lower.includes('mean') || lower.includes('median')) {
    return 'Data dan Peluang';
  }
  if (lower.includes('bilangan') || lower.includes('pecahan') || lower.includes('pangkat') || lower.includes('rasio') || lower.includes('akar')) {
    return 'Bilangan';
  }
  return null;
}

function detectCognitive(text: string): 'Memahami' | 'Mengaplikasikan' | 'Menalar' {
  const lower = text.toLowerCase();
  if (lower.includes('nalar') || lower.includes('menalar') || lower.includes('evaluasi') || lower.includes('analisis') || lower.includes('hots')) {
    return 'Menalar';
  }
  if (lower.includes('pahami') || lower.includes('memahami') || lower.includes('sebutkan') || lower.includes('identifikasi')) {
    return 'Memahami';
  }
  return 'Mengaplikasikan';
}

function detectQuestionForm(text: string): 'PG' | 'PG Kompleks/MCMA' | 'PG Kategori' {
  const lower = text.toLowerCase();
  if (lower.includes('kompleks') || lower.includes('mcma') || lower.includes('lebih dari satu')) {
    return 'PG Kompleks/MCMA';
  }
  if (lower.includes('kategori') || lower.includes('benar/salah') || lower.includes('ya/tidak') || lower.includes('sesuai')) {
    return 'PG Kategori';
  }
  return 'PG';
}
