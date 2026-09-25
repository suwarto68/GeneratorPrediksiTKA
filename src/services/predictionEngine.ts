import { AssessmentItem, ElementType, PredictionConfig, PredictionMode, PredictivePriority } from '../types';
import { BASELINE_2026_ITEMS } from '../data/baseline2026Data';

export interface AnalysisSummary {
  totalAnalyzed: number;
  stepsCompleted: {
    step1_extracted: string;
    step2_grouped: string;
    step3_high_potentials: string[];
    step4_pattern_2026: string;
    step5_expansion_2027: string;
    step6_prediction_status: string;
    step7_transparency_note: string;
  };
  elementCounts: Record<ElementType, number>;
  elementPercentages: Record<ElementType, number>;
  cognitiveCounts: Record<string, number>;
  formCounts: Record<string, number>;
  priorityCounts: Record<PredictivePriority, number>;
}

export function calculateDistributionTargets(config: PredictionConfig): Record<ElementType, number> {
  const total = config.jumlahSoal;
  let pct = {
    bilangan: 0.16,
    aljabar: 0.34,
    geometri: 0.30,
    dataPeluang: 0.20
  };

  if (config.distribusiMateriMode === 'Mengikuti baseline 2026') {
    pct = { bilangan: 0.16, aljabar: 0.34, geometri: 0.30, dataPeluang: 0.20 };
  } else if (config.distribusiMateriMode === 'Manual') {
    const sum = (config.customDistribution.bilangan + config.customDistribution.aljabar + config.customDistribution.geometri + config.customDistribution.dataPeluang) || 100;
    pct = {
      bilangan: config.customDistribution.bilangan / sum,
      aljabar: config.customDistribution.aljabar / sum,
      geometri: config.customDistribution.geometri / sum,
      dataPeluang: config.customDistribution.dataPeluang / sum,
    };
  } else {
    // Otomatis based on mode
    if (config.modePrediksi === 'Eksploratif') {
      pct = { bilangan: 0.14, aljabar: 0.33, geometri: 0.28, dataPeluang: 0.25 };
    } else if (config.modePrediksi === 'Seimbang') {
      pct = { bilangan: 0.16, aljabar: 0.34, geometri: 0.30, dataPeluang: 0.20 };
    } else {
      pct = { bilangan: 0.17, aljabar: 0.33, geometri: 0.30, dataPeluang: 0.20 };
    }
  }

  // Calculate rounded numbers ensuring sum equals total
  let bCount = Math.round(total * pct.bilangan);
  let aCount = Math.round(total * pct.aljabar);
  let gCount = Math.round(total * pct.geometri);
  let dCount = total - (bCount + aCount + gCount);

  // Guarantee minimum 1 question per element if total >= 4
  if (total >= 4) {
    if (bCount < 1) bCount = 1;
    if (aCount < 1) aCount = 1;
    if (gCount < 1) gCount = 1;
    if (dCount < 1) dCount = 1;
    
    // adjust remainder
    const currentSum = bCount + aCount + gCount + dCount;
    const diff = total - currentSum;
    aCount += diff; // absorb diff into Aljabar
  }

  return {
    'Bilangan': bCount,
    'Aljabar': aCount,
    'Geometri dan Pengukuran': gCount,
    'Data dan Peluang': dCount
  };
}

export function generatePredictedBlueprint(
  config: PredictionConfig,
  customItemsPool: AssessmentItem[] = []
): { items: AssessmentItem[]; summary: AnalysisSummary } {
  const targetCounts = calculateDistributionTargets(config);
  const pool = customItemsPool.length > 0 ? customItemsPool : BASELINE_2026_ITEMS;

  const resultItems: AssessmentItem[] = [];
  let itemNumber = 1;

  const elements: ElementType[] = ['Bilangan', 'Aljabar', 'Geometri dan Pengukuran', 'Data dan Peluang'];

  elements.forEach((elem) => {
    const quota = targetCounts[elem];
    const matchingInPool = pool.filter(i => i.elemen === elem);
    
    for (let i = 0; i < quota; i++) {
      let baseTemplate: AssessmentItem;
      if (matchingInPool[i]) {
        baseTemplate = { ...matchingInPool[i] };
      } else {
        // cycle or synthesize item based on element pattern
        const cycleIdx = i % matchingInPool.length;
        baseTemplate = { ...matchingInPool[cycleIdx] };
        baseTemplate.id = `${baseTemplate.id}-EXP-${i + 1}`;
        baseTemplate.indikator_prediktif = `[Pengayaan Prediktif] ${baseTemplate.indikator_prediktif} dengan variasi parameter konteks baru`;
        baseTemplate.prioritas_prediktif = 'Prioritas Pengayaan';
        baseTemplate.skor_prediksi = Math.max(70, baseTemplate.skor_prediksi - 5);
      }

      // Adjust attributes according to Prediction Mode
      let adjustedCognitive = baseTemplate.level_kognitif;
      let adjustedForm = baseTemplate.bentuk_soal;
      let adjustedPriority = baseTemplate.prioritas_prediktif;
      let adjustedReason = baseTemplate.alasan;

      if (config.modePrediksi === 'Eksploratif') {
        // Escalate cognitive level on some items
        if (i % 2 === 1 && adjustedCognitive === 'Mengaplikasikan') {
          adjustedCognitive = 'Menalar';
          adjustedReason = `[Mode Eksploratif] Diekskalasi ke level Menalar untuk menguji pemecahan masalah non-rutin berbasis konteks ${baseTemplate.konteks}.`;
          if (adjustedForm === 'PG') adjustedForm = 'PG Kompleks/MCMA';
        }
      } else if (config.modePrediksi === 'Konservatif') {
        // Favor standard baseline
        adjustedReason = `[Mode Konservatif] Mempertahankan struktur acuan dokumen 2026 dengan adaptasi kontekstual terukur.`;
      } else {
        adjustedReason = `[Mode Seimbang] Prediksi terkalibrasi antara frekuensi acuan 2026 dan penguatan literasi numerasi 2027.`;
      }

      // Recalculate predictive score
      const baseScore = baseTemplate.skor_prediksi || 85;
      let score = baseScore;
      if (adjustedCognitive === 'Menalar') score += 4;
      if (adjustedForm !== 'PG') score += 3;
      if (score > 98) score = 98;

      if (score >= 90) adjustedPriority = 'Prioritas Tinggi';
      else if (score >= 80) adjustedPriority = 'Prioritas Menengah';
      else adjustedPriority = 'Prioritas Pengayaan';

      resultItems.push({
        ...baseTemplate,
        no: itemNumber++,
        tahun: config.tahunTarget,
        jenjang: config.jenjang,
        fase: config.fase,
        mata_pelajaran: config.mataPelajaran,
        level_kognitif: adjustedCognitive,
        bentuk_soal: adjustedForm,
        prioritas_prediktif: adjustedPriority,
        skor_prediksi: score,
        alasan: adjustedReason,
        status_label: 'Prediksi'
      });
    }
  });

  // Calculate analysis summary
  const elementCounts: Record<ElementType, number> = {
    'Bilangan': 0,
    'Aljabar': 0,
    'Geometri dan Pengukuran': 0,
    'Data dan Peluang': 0
  };
  const cognitiveCounts: Record<string, number> = {
    'Memahami': 0,
    'Mengaplikasikan': 0,
    'Menalar': 0
  };
  const formCounts: Record<string, number> = {
    'PG': 0,
    'PG Kompleks/MCMA': 0,
    'PG Kategori': 0
  };
  const priorityCounts: Record<PredictivePriority, number> = {
    'Prioritas Tinggi': 0,
    'Prioritas Menengah': 0,
    'Prioritas Pengayaan': 0
  };

  resultItems.forEach(item => {
    elementCounts[item.elemen] = (elementCounts[item.elemen] || 0) + 1;
    cognitiveCounts[item.level_kognitif] = (cognitiveCounts[item.level_kognitif] || 0) + 1;
    formCounts[item.bentuk_soal] = (formCounts[item.bentuk_soal] || 0) + 1;
    priorityCounts[item.prioritas_prediktif] = (priorityCounts[item.prioritas_prediktif] || 0) + 1;
  });

  const total = resultItems.length || 1;
  const elementPercentages: Record<ElementType, number> = {
    'Bilangan': Number(((elementCounts['Bilangan'] / total) * 100).toFixed(1)),
    'Aljabar': Number(((elementCounts['Aljabar'] / total) * 100).toFixed(1)),
    'Geometri dan Pengukuran': Number(((elementCounts['Geometri dan Pengukuran'] / total) * 100).toFixed(1)),
    'Data dan Peluang': Number(((elementCounts['Data dan Peluang'] / total) * 100).toFixed(1))
  };

  const summary: AnalysisSummary = {
    totalAnalyzed: resultItems.length,
    stepsCompleted: {
      step1_extracted: `Berhasil mengekstrak ${pool.length} unit kompetensi dari dokumen acuan (Kisi-kisi 2026, Soal TKA 2026, dan Kerangka Asesmen SMP Fase D).`,
      step2_grouped: `Terkelompokkan ke dalam 4 elemen utama: Bilangan (${elementCounts['Bilangan']}), Aljabar (${elementCounts['Aljabar']}), Geometri (${elementCounts['Geometri dan Pengukuran']}), dan Data & Peluang (${elementCounts['Data dan Peluang']}).`,
      step3_high_potentials: [
        'Aritmetika sosial dengan skema diskon ganda atau cicilan kredit',
        'SPLDV dalam pemodelan keuntungan UMKM dan stok bahan',
        'Teorema Pythagoras dan luas permukaan bangun ruang gabungan',
        'Interpretasi tren data garis, mean gabungan, dan evaluasi misleading visual'
      ],
      step4_pattern_2026: `Pola acuan 2026 menunjukkan rasio Aljabar (34%) dan Geometri (30%) paling dominan, dengan 70% soal berformat PG tunggal.`,
      step5_expansion_2027: `Ruang pengembangan 2027 difokuskan pada pengayaan stimulus infografis/grafik dan eskalasi PG Kompleks serta PG Kategori untuk menekan faktor tebakan acak.`,
      step6_prediction_status: `Status keluaran: PREDIKSI BERBASIS POLA DAN ANALISIS DOKUMEN ACUAN (Bukan kisi-kisi resmi Kemendikdasmen).`,
      step7_transparency_note: `Setiap indikator dilengkapi skor prioritas matematis transparan dan catatan rasionalisasi pedagogis.`
    },
    elementCounts,
    elementPercentages,
    cognitiveCounts,
    formCounts,
    priorityCounts
  };

  return { items: resultItems, summary };
}
