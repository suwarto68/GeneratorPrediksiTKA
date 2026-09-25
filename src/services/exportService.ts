import * as XLSX from 'xlsx';
import { AssessmentItem } from '../types';

export function exportToExcel(items: AssessmentItem[], filename = 'Prediksi_Kisi_Kisi_TKA_Matematika_SMP_2027.xlsx') {
  const data = items.map(item => ({
    'No': item.no,
    'Elemen': item.elemen,
    'Subelemen': item.subelemen,
    'Kompetensi': item.kompetensi,
    'Indikator Prediktif': item.indikator_prediktif,
    'Level Kognitif': item.level_kognitif,
    'Bentuk Soal': item.bentuk_soal,
    'Stimulus': item.stimulus,
    'Konteks': item.konteks,
    'Prioritas Prediktif': item.prioritas_prediktif,
    'Alasan': item.alasan,
    'Sumber Acuan': item.sumber_acuan
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 18 }, // Elemen
    { wch: 22 }, // Subelemen
    { wch: 35 }, // Kompetensi
    { wch: 45 }, // Indikator
    { wch: 16 }, // Level
    { wch: 18 }, // Bentuk Soal
    { wch: 14 }, // Stimulus
    { wch: 18 }, // Konteks
    { wch: 18 }, // Prioritas
    { wch: 35 }, // Alasan
    { wch: 25 }, // Sumber
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Kisi-Kisi TKA 2027');
  XLSX.writeFile(workbook, filename);
}

export function exportToCSV(items: AssessmentItem[], filename = 'Prediksi_Kisi_Kisi_TKA_Matematika_SMP_2027.csv') {
  const headers = [
    'No',
    'Elemen',
    'Subelemen',
    'Kompetensi',
    'Indikator Prediktif',
    'Level Kognitif',
    'Bentuk Soal',
    'Stimulus',
    'Prioritas Prediktif',
    'Alasan'
  ];

  const rows = items.map(i => [
    i.no,
    `"${i.elemen}"`,
    `"${i.subelemen.replace(/"/g, '""')}"`,
    `"${i.kompetensi.replace(/"/g, '""')}"`,
    `"${i.indikator_prediktif.replace(/"/g, '""')}"`,
    `"${i.level_kognitif}"`,
    `"${i.bentuk_soal}"`,
    `"${i.stimulus}"`,
    `"${i.prioritas_prediktif}"`,
    `"${i.alasan.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToWord(items: AssessmentItem[], filename = 'Prediksi_Kisi_Kisi_TKA_Matematika_SMP_2027.doc') {
  const rowsHtml = items.map(item => `
    <tr>
      <td style="border: 1px solid #475569; padding: 6px; text-align: center; font-size: 11px;">${item.no}</td>
      <td style="border: 1px solid #475569; padding: 6px; font-weight: bold; font-size: 11px;">${item.elemen}</td>
      <td style="border: 1px solid #475569; padding: 6px; font-size: 11px;">${item.subelemen}</td>
      <td style="border: 1px solid #475569; padding: 6px; font-size: 11px;">${item.kompetensi}</td>
      <td style="border: 1px solid #475569; padding: 6px; font-size: 11px;">${item.indikator_prediktif}</td>
      <td style="border: 1px solid #475569; padding: 6px; text-align: center; font-size: 11px;">${item.level_kognitif}</td>
      <td style="border: 1px solid #475569; padding: 6px; text-align: center; font-size: 11px;">${item.bentuk_soal}</td>
      <td style="border: 1px solid #475569; padding: 6px; text-align: center; font-size: 11px;">${item.stimulus}</td>
      <td style="border: 1px solid #475569; padding: 6px; text-align: center; font-size: 11px; font-weight: bold;">${item.prioritas_prediktif}</td>
      <td style="border: 1px solid #475569; padding: 6px; font-size: 10px; color: #334155;">${item.alasan}</td>
    </tr>
  `).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Prediksi Kisi-Kisi TKA Matematika SMP 2027</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 20px; }
        h2 { text-align: center; text-transform: uppercase; margin-bottom: 4px; }
        p.subtitle { text-align: center; margin-top: 0; font-size: 13px; color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #0f172a; color: #ffffff; border: 1px solid #0f172a; padding: 8px; font-size: 11px; text-align: center; }
        .disclaimer { margin-top: 25px; padding: 10px; background-color: #f8fafc; border-left: 4px solid #64748b; font-size: 11px; font-style: italic; }
      </style>
    </head>
    <body>
      <h2>RANCANGAN PREDIKSI KISI-KISI TKA MATEMATIKA SMP/MTs 2027</h2>
      <p class="subtitle">Fase D · Berbasis Pola Analisis Dokumen Acuan TKA & Kerangka Asesmen</p>
      
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Elemen</th>
            <th>Subelemen</th>
            <th>Kompetensi</th>
            <th>Indikator Prediktif</th>
            <th>Level Kognitif</th>
            <th>Bentuk Soal</th>
            <th>Stimulus</th>
            <th>Prioritas</th>
            <th>Alasan Prediksi</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="disclaimer">
        <strong>Catatan / Disclaimer:</strong><br>
        Hasil yang dihasilkan aplikasi ini merupakan analisis dan prediksi berbasis dokumen referensi yang diunggah pengguna. Hasil bukan merupakan kisi-kisi resmi TKA 2027 dan tidak menjamin materi atau indikator tertentu akan muncul dalam pelaksanaan TKA.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyTableToClipboard(items: AssessmentItem[]): Promise<boolean> {
  const headers = ['No', 'Elemen', 'Subelemen', 'Kompetensi', 'Indikator Prediktif', 'Level Kognitif', 'Bentuk Soal', 'Stimulus', 'Prioritas Prediktif', 'Alasan'];
  const rows = items.map(i => [
    i.no,
    i.elemen,
    i.subelemen,
    i.kompetensi,
    i.indikator_prediktif,
    i.level_kognitif,
    i.bentuk_soal,
    i.stimulus,
    i.prioritas_prediktif,
    i.alasan
  ].join('\t'));

  const text = [headers.join('\t'), ...rows].join('\n');
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}
