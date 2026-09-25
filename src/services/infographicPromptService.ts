import { AssessmentItem, InfographicPrompt, QuestionData } from '../types';

export function createInfographicPrompt(
  item: AssessmentItem,
  ratio: '16:9' | 'A4' | '1:1' = '16:9'
): InfographicPrompt {
  const judul = `Infografis Stimulus: ${item.subelemen} (${item.konteks})`;
  const tujuanVisual = `Menyajikan data visual esensial terkait ${item.indikator_prediktif} untuk stimulus asesmen numerasi Fase D tanpa membocorkan jawaban perhitungan.`;
  const elemenVisual = item.potensi_visual || `Diagram data kuantitatif, tabel terstruktur, label besaran matematis kontekstual (${item.konteks}).`;
  const data = `Variabel konteks ${item.konteks}, nilai-nilai besaran numerik terukur terkait ${item.subelemen}, legenda satuan baku SI.`;
  const label = `Judul grafik/diagram, sumbu absis & ordinat bertanda jelas, keterangan unit nilai, nomor seri atau kode kasus.`;
  const warna = `Palet edukatif profesional berstandar editorial: Navy (#1E293B), Slate Teal (#0F766E), Aksen Amber hangat (#D97706), latar belakang broken-white bersih (#F8FAFC). Kontras tinggi untuk kenyamanan baca siswa.`;
  const komposisi = `Tata letak modular: Header ringkas di bagian atas, visualisasi data atau diagram inti di area tengah yang dominan, panel legenda parameter di samping atau bawah.`;
  const larangan = [
    'JANGAN memberikan tanda centang atau penyorotan warna pada pilihan jawaban.',
    'JANGAN menampilkan hasil perhitungan akhir atau nilai kesimpulan soal.',
    'JANGAN memberikan petunjuk jawaban (clue/hint).',
    'JANGAN memuat teks bertele-tele atau ilustrasi dekoratif kartun yang mengalihkan perhatian.',
    'JANGAN memotong skala sumbu grafik secara menipu (misleading zero baseline) kecuali diberi tanda zig-zag pemotong yang eksplisit.'
  ];
  const informasiTampak = `Semua angka, notasi matematis, label satuan, dan proporsi geometris harus terlihat tajam, presisi, dan dapat dibaca jelas oleh peserta didik SMP.`;

  const fullPrompt = `[ROLE]
Anda adalah desainer infografis pendidikan SMP spesialis literasi numerasi asesmen standar nasional.

[OBJECTIVE]
Buat infografis untuk stimulus soal TKA Matematika SMP/MTs Fase D.
Target Indikator: ${item.indikator_prediktif}
Level Kognitif: ${item.level_kognitif}
Konteks: ${item.konteks}

[CONTENT]
${data}

[VISUAL]
${elemenVisual}
Gunakan tata letak diagram/tabel/grafik/ilustrasi teknis sesuai kebutuhan stimulus matematika.

[MATHEMATICAL ACCURACY]
Semua angka, simbol aljabar/geometri, satuan, skala grafik, dan label variabel harus 100% presisi matematis dan konsisten.

[QUESTION SAFETY]
- ${larangan.join('\n- ')}

[DESIGN]
${warna}
${komposisi}
Gaya: Clean, modern, educational, professional, bebas elemen AI-slop dekoratif yang tidak fungsional.

[FORMAT]
Rasio aspek: ${ratio}. Resolusi tinggi (300 DPI / 4K UHD), tipografi sans-serif tegas terbaca.`;

  return {
    id: `PROMPT-${item.id}`,
    item_id: item.id,
    judul,
    tujuan_visual: tujuanVisual,
    elemen_visual: elemenVisual,
    data,
    label,
    warna,
    komposisi,
    rasio: ratio,
    larangan,
    informasi_tampak: informasiTampak,
    full_prompt_text: fullPrompt
  };
}

export function generatePortableAIPrompts(item: AssessmentItem, question?: QuestionData): {
  geminiPrompt: string;
  canvaPrompt: string;
  imageGenPrompt: string;
  textGenPrompt: string;
} {
  const geminiPrompt = `Bertindaklah sebagai Tim Ahli Konstruksi Soal TKA Matematika SMP Fase D.
Berdasarkan indikator prediktif berikut:
- Elemen: ${item.elemen}
- Subelemen: ${item.subelemen}
- Indikator: ${item.indikator_prediktif}
- Level Kognitif: ${item.level_kognitif}
- Bentuk Soal: ${item.bentuk_soal}
- Konteks: ${item.konteks}

TUGAS:
Buat 1 butir soal TKA baru beserta stimulus kontekstual yang menyediakan data esensial, kunci jawaban objektif, dan pembahasan terstruktur langkah demi langkah.`;

  const canvaPrompt = `Educational Infographic for Junior High Mathematics:
Title: "${item.subelemen} - ${item.konteks}"
Style: Minimalist, clean educational poster with statistical table, coordinate graph, or geometric layout.
Colors: Navy blue, slate gray, and muted amber.
Format: Presentation (16:9) or A4 Infographic.
Requirement: Include labeled diagrams, data table, and scale bar. Do NOT include quiz answer keys or hints.`;

  const imageGenPrompt = `A clean, professional 2D vector technical educational diagram showing ${item.potensi_visual || item.subelemen}, suitable for a junior high school mathematics national assessment test booklet. White clean background, precise geometric shapes, crisp technical labels, no cartoon characters, zero decorative clutter. Aspect ratio 16:9.`;

  const textGenPrompt = `Buatkan kisi-kisi dan butir soal matematika SMP Fase D dengan indikator: "${item.indikator_prediktif}". Sajikan stimulus narasi berbasis konteks ${item.konteks} dengan 4 opsi pilihan ganda dan pembahasan numerasi lengkap.`;

  return {
    geminiPrompt,
    canvaPrompt,
    imageGenPrompt,
    textGenPrompt
  };
}
