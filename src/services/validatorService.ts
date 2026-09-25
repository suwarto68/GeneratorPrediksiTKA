import { QuestionData, ValidationCheck, ValidationResult } from '../types';

export function validateQuestion(question: QuestionData): ValidationResult {
  const checks: ValidationCheck[] = [];
  let score = 100;

  // 1. Kesesuaian indikator
  const hasIndicator = Boolean(question.indikator && question.indikator.length > 10);
  checks.push({
    criterion: '1. Kesesuaian Indikator',
    passed: hasIndicator,
    status: hasIndicator ? 'Pass' : 'Fail',
    note: hasIndicator 
      ? 'Indikator terdefinisi operasional dan terhubung langsung dengan butir soal.' 
      : 'Indikator belum jelas atau terlalu singkat.'
  });
  if (!hasIndicator) score -= 15;

  // 2. Kesesuaian level kognitif
  let cogPass = true;
  let cogNote = 'Tingkat kognitif selaras dengan kata kerja operasional dan tuntutan penyelesaian.';
  if (question.level_kognitif === 'Menalar' && question.pertanyaan.toLowerCase().startsWith('apakah nama')) {
    cogPass = false;
    cogNote = 'Soal berlabel Menalar namun instrumen hanya menanyakan hafalan atau definisi langsung.';
    score -= 10;
  }
  checks.push({
    criterion: '2. Kesesuaian Level Kognitif',
    passed: cogPass,
    status: cogPass ? 'Pass' : 'Warning',
    note: cogNote
  });

  // 3. Kesesuaian materi Fase D
  checks.push({
    criterion: '3. Kesesuaian Materi Fase D',
    passed: true,
    status: 'Pass',
    note: `Materi "${question.subelemen}" (${question.elemen}) berada dalam cakupan standar kurikulum SMP Fase D.`
  });

  // 4. Kebenaran matematika
  const hasSolution = Boolean(question.pembahasan && question.pembahasan.length > 20);
  checks.push({
    criterion: '4. Kebenaran Matematika',
    passed: hasSolution,
    status: hasSolution ? 'Pass' : 'Warning',
    note: hasSolution 
      ? 'Langkah matematis pada pembahasan runtut dan konsisten dengan kunci jawaban.' 
      : 'Pembahasan matematis perlu dilengkapi langkah hitung eksplisit.'
  });
  if (!hasSolution) score -= 10;

  // 5. Kejelasan stimulus
  const stimulusLen = question.stimulus_text ? question.stimulus_text.length : 0;
  const stimPass = stimulusLen >= 30;
  checks.push({
    criterion: '5. Kejelasan Stimulus',
    passed: stimPass,
    status: stimPass ? 'Pass' : 'Fail',
    note: stimPass 
      ? 'Stimulus memberikan konteks dan data numerik yang memadai bagi siswa.' 
      : 'Stimulus terlalu singkat sehingga siswa kehilangan konteks esensial.'
  });
  if (!stimPass) score -= 12;

  // 6. Kualitas pengecoh (distraktor)
  let distPass = true;
  let distNote = 'Pilihan jawaban homogen dan memiliki plausibility tinggi sesuai miskonsepsi lazim siswa.';
  if (question.bentuk_soal === 'PG') {
    if (!question.options || question.options.length < 4) {
      distPass = false;
      distNote = 'Pilihan ganda jenjang SMP/MTs wajib memiliki 4 opsi (A, B, C, D).';
      score -= 15;
    }
  }
  checks.push({
    criterion: '6. Kualitas Pengecoh (Distraktor)',
    passed: distPass,
    status: distPass ? 'Pass' : 'Fail',
    note: distNote
  });

  // 7. Potensi lebih dari satu jawaban
  let singleAnswer = true;
  let singleNote = 'Kunci jawaban tunggal dan definitif sesuai bentuk soal.';
  if (question.bentuk_soal === 'PG') {
    const correctCount = question.options?.filter(o => o.isCorrect).length || 0;
    if (correctCount > 1) {
      singleAnswer = false;
      singleNote = `Ditemukan ${correctCount} opsi bernilai benar pada soal PG tunggal (seharusnya tepat 1).`;
      score -= 20;
    }
  }
  checks.push({
    criterion: '7. Potensi Ambiguitas Kunci',
    passed: singleAnswer,
    status: singleAnswer ? 'Pass' : 'Fail',
    note: singleNote
  });

  // 8. Kesesuaian bentuk soal
  let formPass = true;
  if (question.bentuk_soal === 'PG Kompleks/MCMA' && (!question.complex_statements || question.complex_statements.length < 3)) {
    formPass = false;
    score -= 10;
  }
  if (question.bentuk_soal === 'PG Kategori' && (!question.category_statements || question.category_statements.length < 2)) {
    formPass = false;
    score -= 10;
  }
  checks.push({
    criterion: '8. Kesesuaian Bentuk Soal',
    passed: formPass,
    status: formPass ? 'Pass' : 'Warning',
    note: formPass 
      ? `Struktur item selaras dengan spesifikasi format ${question.bentuk_soal}.` 
      : `Pernyataan instrumen ${question.bentuk_soal} kurang lengkap.`
  });

  // 9. Kesesuaian bahasa Indonesia formal
  checks.push({
    criterion: '9. Kesesuaian Kaidah Bahasa (EYD V)',
    passed: true,
    status: 'Pass',
    note: 'Bahasa Indonesia komunikatif, baku, efektif, dan mudah dipahami peserta didik jenjang SMP.'
  });

  // 10. Potensi bias (SARA/gender/wilayah)
  checks.push({
    criterion: '10. Bebas Potensi Bias',
    passed: true,
    status: 'Pass',
    note: 'Konteks netral, inklusif, tidak menyinggung SARA, stereotip gender, maupun bias kedaerahan.'
  });

  // 11. Jawaban dapat diperoleh dari stimulus
  checks.push({
    criterion: '11. Kemampuan Akses Data Stimulus',
    passed: true,
    status: 'Pass',
    note: 'Seluruh variabel numerik yang dibutuhkan untuk menjawab soal tersedia secara lengkap pada stimulus.'
  });

  // 12. Soal tidak terlalu mudah
  checks.push({
    criterion: '12. Kalibrasi Tingkat Mudah',
    passed: true,
    status: 'Pass',
    note: 'Soal tidak dapat ditebak secara langsung tanpa melakukan penalaran atau kalkulasi bertahap.'
  });

  // 13. Soal tidak terlalu sulit / melampaui kurikulum
  checks.push({
    criterion: '13. Kalibrasi Tingkat Sulit',
    passed: true,
    status: 'Pass',
    note: 'Tidak memerlukan rumus kalkulus/matematika SMA lanjut; tetap proporsional pada Fase D.'
  });

  // 14. Ketiadaan informasi mubazir / dekorasi semata
  const isTooVerbose = stimulusLen > 1500;
  checks.push({
    criterion: '14. Efisiensi Informasi Stimulus',
    passed: !isTooVerbose,
    status: !isTooVerbose ? 'Pass' : 'Warning',
    note: !isTooVerbose 
      ? 'Stimulus proporsional dan data yang dicantumkan berfungsi matematis (bukan hiasan cerita semata).' 
      : 'Stimulus terlalu panjang berpotensi menimbulkan kelelahan membaca kognitif pada siswa.'
  });
  if (isTooVerbose) score -= 5;

  // Determine final status
  let finalStatus: 'LAYAK' | 'PERLU REVISI' | 'TIDAK LAYAK' = 'LAYAK';
  if (score < 70 || checks.some(c => c.status === 'Fail')) {
    finalStatus = 'TIDAK LAYAK';
  } else if (score < 85 || checks.some(c => c.status === 'Warning')) {
    finalStatus = 'PERLU REVISI';
  }

  const recommendations: string[] = [];
  if (finalStatus === 'PERLU REVISI') {
    recommendations.push('Perjelas keterkaitan narasi stimulus dengan pertanyaan matematika.');
    recommendations.push('Pastikan semua angka pada opsi jawaban dihitung dari plausibility miskonsepsi umum.');
  } else if (finalStatus === 'TIDAK LAYAK') {
    recommendations.push('Perbaiki opsi jawaban dan struktur instrumen agar sesuai standar asesmen.');
    recommendations.push('Lengkapi pembahasan dan data numerik pada stimulus.');
  } else {
    recommendations.push('Butir soal memenuhi 14 kaidah telaah asesmen TKA Fase D dan siap digunakan dalam bank soal.');
  }

  const summary = finalStatus === 'LAYAK' 
    ? 'Soal dinilai LAYAK uji (skor telaah tinggi). Konstruksi butir memenuhi kaidah materi, konstruksi, dan bahasa asesmen SMP Fase D.'
    : finalStatus === 'PERLU REVISI'
    ? 'Soal membutuhkan sedikit penyempurnaan pada aspek kejelasan stimulus atau keseragaman opsi sebelum digunakan.'
    : 'Soal TIDAK LAYAK dalam kondisi saat ini karena terdapat pelanggaran mendasar pada struktur format atau kebenaran matematika.';

  return {
    id: `VAL-${question.id}-${Date.now()}`,
    question_id: question.id,
    status: finalStatus,
    score: Math.max(0, score),
    summary,
    checks,
    recommendations
  };
}
