import * as XLSX from 'xlsx';
import { AssessmentItem, QuestionData } from '../types';

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
        body { font-family: 'Times New Roman', serif; margin: 25px; line-height: 1.3; }
        h2 { text-align: center; text-transform: uppercase; margin-bottom: 4px; font-size: 15pt; }
        p.subtitle { text-align: center; margin-top: 0; font-size: 10pt; color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #0f172a; color: #ffffff; border: 1px solid #0f172a; padding: 8px; font-size: 10pt; text-align: center; }
        .disclaimer { margin-top: 25px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #64748b; font-size: 9.5pt; font-style: italic; }
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

/**
 * EXPORT FULL QUESTION MANUSCRIPT TO WORD (.DOC)
 * Includes formatted headers, stimuli, tables, statements, answer keys, and solutions
 */
export function exportManuscriptToWord(
  questions: QuestionData[],
  options: {
    includeAnswers?: boolean;
    includeBlueprintInfo?: boolean;
    schoolName?: string;
    academicYear?: string;
  } = {}
) {
  const {
    includeAnswers = true,
    includeBlueprintInfo = true,
    schoolName = 'SMP/MTs NEGERI & SWASTA',
    academicYear = '2026/2027'
  } = options;

  const filename = includeAnswers 
    ? `Naskah_Soal_Lengkap_TKA_Matematika_SMP_2027_(Dengan_Kunci).doc`
    : `Naskah_Soal_Siswa_TKA_Matematika_SMP_2027.doc`;

  // Render question items
  const questionsHtml = questions.map((q, idx) => {
    const qNum = idx + 1;

    let optionsHtml = '';
    if (q.bentuk_soal === 'PG' && q.options) {
      optionsHtml = `
        <table style="width: 100%; border: none; margin-top: 8px; margin-left: 15px;">
          ${q.options.map(opt => `
            <tr>
              <td style="width: 25px; vertical-align: top; font-weight: bold; border: none; font-size: 11pt;">${opt.label}.</td>
              <td style="vertical-align: top; border: none; font-size: 11pt; padding-bottom: 4px;">
                ${opt.text}
                ${includeAnswers && opt.isCorrect ? '<span style="color: #15803d; font-weight: bold; margin-left: 8px;">[KUNCI JAWABAN BENAR]</span>' : ''}
              </td>
            </tr>
          `).join('')}
        </table>
      `;
    } else if (q.bentuk_soal === 'PG Kompleks/MCMA' && q.complex_statements) {
      optionsHtml = `
        <div style="margin-top: 8px; margin-left: 15px; font-size: 11pt;">
          <p style="margin-bottom: 6px; font-style: italic; color: #475569;">Pilihlah setiap pernyataan yang bernilai BENAR (jawaban benar lebih dari satu):</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            ${q.complex_statements.map((s, sIdx) => `
              <tr style="border-bottom: 1px solid #cbd5e1;">
                <td style="width: 30px; padding: 6px; vertical-align: top; border: 1px solid #cbd5e1; text-align: center;">
                  ${includeAnswers ? (s.isCorrect ? '<strong>[v]</strong>' : '[  ]') : '[  ]'}
                </td>
                <td style="padding: 6px; vertical-align: top; border: 1px solid #cbd5e1; font-size: 10.5pt;">
                  <strong>Pernyataan ${sIdx + 1}:</strong> ${s.statement}
                  ${includeAnswers ? `<br><small style="color: #0369a1;"><em>Alasan: ${s.reason || (s.isCorrect ? 'Pernyataan Benar' : 'Pernyataan Salah')}</em></small>` : ''}
                </td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    } else if (q.bentuk_soal === 'PG Kategori' && q.category_statements) {
      optionsHtml = `
        <div style="margin-top: 8px; margin-left: 15px; font-size: 11pt;">
          <p style="margin-bottom: 6px; font-style: italic; color: #475569;">Tentukan kategori BENAR atau SALAH untuk setiap pernyataan berikut:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="border: 1px solid #475569; padding: 6px; text-align: left; font-size: 10pt;">Pernyataan</th>
                <th style="border: 1px solid #475569; padding: 6px; width: 100px; text-align: center; font-size: 10pt;">Kategori Siswa</th>
                ${includeAnswers ? '<th style="border: 1px solid #475569; padding: 6px; width: 100px; text-align: center; font-size: 10pt; color: #15803d;">Kunci</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${q.category_statements.map((cat, cIdx) => `
                <tr>
                  <td style="border: 1px solid #cbd5e1; padding: 6px; font-size: 10.5pt;">${cat.statement}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-size: 10pt; color: #94a3b8;">[ Benar / Salah ]</td>
                  ${includeAnswers ? `<td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: ${cat.category === 'BENAR' ? '#15803d' : '#b91c1c'}; font-size: 10pt;">${cat.category}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 25px; page-break-inside: avoid;">
        <!-- Header Info Butir -->
        <table style="width: 100%; border: none; margin-bottom: 6px; font-size: 9.5pt; color: #475569;">
          <tr>
            <td style="border: none; text-align: left;">
              <strong>NO. ${qNum}</strong> &nbsp;|&nbsp; 
              Bentuk: <strong>${q.bentuk_soal}</strong> &nbsp;|&nbsp; 
              Level: <strong>${q.level_kognitif}</strong> &nbsp;|&nbsp; 
              Materi: ${q.elemen} (${q.subelemen})
            </td>
            <td style="border: none; text-align: right; color: #64748b;">
              Konteks: ${q.konteks} &nbsp;·&nbsp; Stimulus: ${q.stimulus_type}
            </td>
          </tr>
        </table>

        <!-- Kotak Stimulus -->
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #3b82f6; padding: 10px 14px; margin-bottom: 10px; font-size: 11pt; line-height: 1.45;">
          <div style="font-weight: bold; color: #1e3a8a; margin-bottom: 5px; font-size: 10pt; text-transform: uppercase;">
            Stimulus ${q.stimulus_type} (${q.konteks}):
          </div>
          <div>${q.stimulus_text.replace(/\n/g, '<br>')}</div>
          ${q.stimulus_data ? `
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 8px 12px; margin-top: 8px; font-family: 'Courier New', monospace; font-size: 9.5pt; white-space: pre-wrap;">
              ${q.stimulus_data}
            </div>
          ` : ''}
        </div>

        <!-- Pertanyaan -->
        <div style="font-size: 11pt; font-weight: bold; margin-bottom: 8px; margin-left: 5px; color: #0f172a;">
          ${q.pertanyaan}
        </div>

        <!-- Opsi / Pernyataan -->
        ${optionsHtml}

        <!-- Pembahasan Jika Mode Guru -->
        ${includeAnswers ? `
          <div style="margin-top: 12px; padding: 8px 12px; background-color: #f0fdf4; border: 1px solid #bbf7d0; font-size: 10pt; color: #14532d; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 3px;">Kunci Jawaban: ${q.kunci}</div>
            <div><strong>Langkah Pembahasan:</strong><br>${q.pembahasan.replace(/\n/g, '<br>')}</div>
            <div style="margin-top: 4px; font-size: 9pt; color: #166534;"><strong>Aspek Numerasi:</strong> ${q.aspek_numerasi}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Table summary of answer keys at end of doc if includeAnswers
  let answerKeyTableHtml = '';
  if (includeAnswers) {
    answerKeyTableHtml = `
      <div style="page-break-before: always; margin-top: 30px;">
        <h3 style="text-align: center; text-transform: uppercase; font-size: 14pt; border-bottom: 2px solid #0f172a; padding-bottom: 6px;">
          REKAPITULASI KUNCI JAWABAN NASKAH TKA MATEMATIKA SMP 2027
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #0f172a; color: white;">
              <th style="border: 1px solid #0f172a; padding: 6px; width: 35px; text-align: center;">No</th>
              <th style="border: 1px solid #0f172a; padding: 6px; width: 110px; text-align: center;">Bentuk Soal</th>
              <th style="border: 1px solid #0f172a; padding: 6px; width: 140px; text-align: left;">Elemen / Materi</th>
              <th style="border: 1px solid #0f172a; padding: 6px; width: 100px; text-align: center;">Level Kognitif</th>
              <th style="border: 1px solid #0f172a; padding: 6px; text-align: left;">Kunci Jawaban</th>
            </tr>
          </thead>
          <tbody>
            ${questions.map((q, i) => `
              <tr style="${i % 2 === 1 ? 'background-color: #f8fafc;' : ''}">
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-size: 9.5pt;">${q.bentuk_soal}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-size: 9.5pt;">${q.elemen}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-size: 9.5pt;">${q.level_kognitif}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold; color: #15803d; font-size: 10pt;">${q.kunci}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  const fullWordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Naskah Soal TKA Matematika SMP 2027</title>
      <style>
        @page {
          size: A4;
          margin: 2cm 2cm 2cm 2cm;
          mso-header-margin: 1cm;
          mso-footer-margin: 1cm;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.35;
          color: #0f172a;
        }
        .header-kop {
          text-align: center;
          border-bottom: 3px double #0f172a;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .header-kop h2 {
          margin: 0;
          font-size: 13pt;
          letter-spacing: 0.5px;
        }
        .header-kop h1 {
          margin: 4px 0;
          font-size: 15pt;
          font-weight: bold;
        }
        .header-kop p {
          margin: 0;
          font-size: 9.5pt;
          color: #334155;
        }
        .table-meta {
          width: 100%;
          border: 1px solid #475569;
          margin-bottom: 15px;
          border-collapse: collapse;
        }
        .table-meta td {
          border: 1px solid #cbd5e1;
          padding: 5px 8px;
          font-size: 10pt;
        }
        .petunjuk {
          background-color: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          margin-bottom: 20px;
          font-size: 9.5pt;
        }
        .disclaimer {
          margin-top: 30px;
          padding: 10px;
          background-color: #f8fafc;
          border-left: 4px solid #64748b;
          font-size: 9pt;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <!-- KOP RESMI NASKAH ASESMEN -->
      <div class="header-kop">
        <h2>DINAS PENDIDIKAN DAN KEBUDAYAAN · MGMP MATEMATIKA</h2>
        <h1>NASKAH SOAL ASESMEN TKA MATEMATIKA SMP/MTs</h1>
        <p>Prediksi Berbasis Analisis Dokumen Acuan TKA & Kerangka Asesmen Fase D · Tahun 2027</p>
      </div>

      <!-- TABEL IDENTITAS UJIAN -->
      <table class="table-meta">
        <tr>
          <td style="width: 20%; font-weight: bold;">Mata Pelajaran</td>
          <td style="width: 35%;">: Matematika</td>
          <td style="width: 18%; font-weight: bold;">Tahun Target</td>
          <td style="width: 27%;">: 2027</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Jenjang / Fase</td>
          <td>: SMP/MTs · Fase D</td>
          <td style="font-weight: bold;">Alokasi Waktu</td>
          <td>: 120 Menit</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Bentuk Instrumen</td>
          <td>: PG, PG Kompleks, PG Kategori</td>
          <td style="font-weight: bold;">Jumlah Soal</td>
          <td>: ${questions.length} Butir Soal</td>
        </tr>
      </table>

      <!-- PETUNJUK UMUM -->
      <div class="petunjuk">
        <strong>PETUNJUK UMUM:</strong>
        <ol style="margin-top: 4px; margin-bottom: 0; padding-left: 20px;">
          <li>Periksa dan bacalah setiap stimulus narasi, tabel, grafik, atau diagram dengan cermat sebelum menjawab.</li>
          <li>Untuk soal <strong>Pilihan Ganda (PG)</strong>, pilihlah tepat 1 (satu) pilihan jawaban yang paling benar (A, B, C, atau D).</li>
          <li>Untuk soal <strong>Pilihan Ganda Kompleks (MCMA)</strong>, berikan tanda centang pada satu atau lebih pernyataan yang bernilai BENAR.</li>
          <li>Untuk soal <strong>Pilihan Ganda Kategori</strong>, tentukan klasifikasi BENAR atau SALAH pada tabel yang tersedia.</li>
          <li>Dilarang menggunakan kalkulator atau alat bantu hitung elektronik selama pengerjaan.</li>
        </ol>
      </div>

      <!-- DAFTAR BUTIR SOAL -->
      <div style="margin-top: 20px;">
        ${questionsHtml}
      </div>

      <!-- LAMPIRAN KUNCI JAWABAN (JIKA AKTIF) -->
      ${answerKeyTableHtml}

      <!-- CATATAN / DISCLAIMER MANDAT -->
      <div class="disclaimer">
        <strong>Catatan / Disclaimer:</strong><br>
        Hasil yang dihasilkan aplikasi ini merupakan analisis dan prediksi berbasis dokumen referensi yang diunggah pengguna. 
        Hasil bukan merupakan kisi-kisi resmi TKA 2027 dan tidak menjamin materi atau indikator tertentu akan muncul dalam pelaksanaan TKA.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([fullWordHtml], { type: 'application/msword;charset=utf-8' });
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

export function copyManuscriptTextToClipboard(questions: QuestionData[], includeAnswers = true): Promise<boolean> {
  let text = `=======================================================\n`;
  text += `NASKAH SOAL PREDIKSI TKA MATEMATIKA SMP 2027 (FASE D)\n`;
  text += `Total Soal: ${questions.length} Butir\n`;
  text += `=======================================================\n\n`;

  questions.forEach((q, idx) => {
    text += `SOAL NO. ${idx + 1} [${q.bentuk_soal} | Level: ${q.level_kognitif} | ${q.elemen} - ${q.subelemen}]\n`;
    text += `Indikator: ${q.indikator}\n`;
    text += `STIMULUS (${q.stimulus_type} - Konteks: ${q.konteks}):\n${q.stimulus_text}\n`;
    if (q.stimulus_data) {
      text += `Data: ${q.stimulus_data}\n`;
    }
    text += `PERTANYAAN: ${q.pertanyaan}\n`;

    if (q.bentuk_soal === 'PG' && q.options) {
      text += `PILIHAN JAWABAN:\n`;
      q.options.forEach(opt => {
        text += `  ${opt.label}. ${opt.text}\n`;
      });
    } else if (q.bentuk_soal === 'PG Kompleks/MCMA' && q.complex_statements) {
      text += `PERNYATAAN (MCMA):\n`;
      q.complex_statements.forEach((s, sIdx) => {
        text += `  [ ] ${sIdx + 1}. ${s.statement}\n`;
      });
    } else if (q.bentuk_soal === 'PG Kategori' && q.category_statements) {
      text += `PERNYATAAN KATEGORI (Benar / Salah):\n`;
      q.category_statements.forEach((c, cIdx) => {
        text += `  ${cIdx + 1}. ${c.statement} -> [ Benar / Salah ]\n`;
      });
    }

    if (includeAnswers) {
      text += `KUNCI JAWABAN: ${q.kunci}\n`;
      text += `PEMBAHASAN: ${q.pembahasan}\n`;
      text += `ASPEK NUMERASI: ${q.aspek_numerasi}\n`;
    }

    text += `-------------------------------------------------------\n\n`;
  });

  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

/**
 * Export single or multiple stimulus variations directly to Word / Docs (.doc)
 */
export function exportStimulusToWord(stimulus: {
  judul: string;
  narasi: string;
  dataVisual?: string;
  analisisFungsi?: string;
  relevansiNumerasi?: string;
  wordCount?: number;
  konteks?: string;
  elemen?: string;
}, filename = 'Stimulus_Teks_Matematika_SMP_FaseD.doc') {
  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${stimulus.judul}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; margin: 2.5cm; color: #0f172a; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 15px; }
        .meta-badge { background-color: #f1f5f9; padding: 4px 8px; border: 1px solid #cbd5e1; font-size: 9.5pt; display: inline-block; margin-bottom: 10px; }
        .stimulus-box { background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 15px 0; font-size: 11pt; }
        .data-box { background-color: #f1f5f9; border: 1px solid #e2e8f0; padding: 8px 12px; margin-top: 10px; font-family: 'Courier New', monospace; font-size: 9.5pt; white-space: pre-wrap; }
        .section-title { font-weight: bold; margin-top: 14px; font-size: 10.5pt; color: #1e3a8a; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="margin: 0; font-size: 13pt;">BANK STIMULUS MATEMATIKA KONTEKSTUAL SMP FASE D</h2>
        <p style="margin: 2px 0; font-size: 9.5pt; color: #475569;">Kementerian Pendidikan Dasar dan Menengah · Standar Asesmen Fase D</p>
      </div>

      <div class="meta-badge">
        <strong>Konteks:</strong> ${stimulus.konteks || 'Kontekstual'} &nbsp;|&nbsp; 
        <strong>Elemen:</strong> ${stimulus.elemen || 'Matematika'} &nbsp;|&nbsp; 
        <strong>Panjang Narasi:</strong> ${stimulus.wordCount || stimulus.narasi.split(/\s+/).filter(Boolean).length} Kata (Standar ~100 Kata)
      </div>

      <h3 style="font-size: 12pt; margin-top: 10px; color: #0f172a;">${stimulus.judul}</h3>

      <div class="stimulus-box">
        <div style="font-weight: bold; font-size: 10pt; color: #312e81; margin-bottom: 6px; text-transform: uppercase;">
          Teks Narasi Stimulus (~100 Kata):
        </div>
        <p style="margin: 0; text-align: justify;">${stimulus.narasi}</p>

        ${stimulus.dataVisual ? `
          <div class="data-box">
            <strong>DATA PENDUKUNG / REPRESENTASI TABEL:</strong><br>
            ${stimulus.dataVisual}
          </div>
        ` : ''}
      </div>

      ${stimulus.analisisFungsi ? `
        <div class="section-title">Fungsi Matematis Stimulus:</div>
        <p style="margin-top: 2px; font-size: 10pt;">${stimulus.analisisFungsi}</p>
      ` : ''}

      ${stimulus.relevansiNumerasi ? `
        <div class="section-title">Relevansi Literasi Numerasi:</div>
        <p style="margin-top: 2px; font-size: 10pt;">${stimulus.relevansiNumerasi}</p>
      ` : ''}
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
