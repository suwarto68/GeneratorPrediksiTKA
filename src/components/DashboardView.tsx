import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Sparkles, 
  FileSpreadsheet, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Target,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';
import { AssessmentItem } from '../types';
import { AnalysisSummary } from '../services/predictionEngine';

interface DashboardViewProps {
  items: AssessmentItem[];
  summary: AnalysisSummary;
  onNavigate: (tabId: string) => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  summary,
  onNavigate,
  onExportExcel,
  onPrint
}) => {
  const total = items.length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Mode Status */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Mesin Analisis Asesmen SMP Fase D · Status: Siap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Rancangan Prediktif Kisi-Kisi TKA Matematika SMP 2027
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Prediksi terstruktur berbasis pola dan analisis dokumen acuan (Kisi-kisi TKA 2026, Soal TKA 2026, dan Kerangka Asesmen Fase D). 
            Dirancang untuk membantu guru, sekolah, dan MGMP menyusun instrumen asesmen yang valid, kontekstual, dan berbobot literasi numerasi.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="text-slate-300">Target: SMP/MTs Fase D</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Tahun: 2027</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-medium">Bukan Kisi-Kisi Resmi (Analisis Prediktif)</span>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('kisi-kisi')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Buka Tabel Kisi-Kisi ({total} Soal)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('input-data')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all"
            >
              <Target className="w-4 h-4 text-indigo-300" />
              <span>Konfigurasi Input Data</span>
            </button>
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all"
            >
              <span>Export Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* TOTAL SOAL */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">TOTAL SOAL</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500 font-normal">butir</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Alokasi penuh TKA</span>
        </div>

        {/* TOTAL INDIKATOR */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">TOTAL INDIKATOR</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500 font-normal">indikator</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Operasional Fase D</span>
        </div>

        {/* MATERI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">MATERI</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-indigo-600">4</span>
            <span className="text-xs text-slate-500 font-normal">elemen</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Kurikulum Fase D</span>
        </div>

        {/* LEVEL KOGNITIF */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">LEVEL KOGNITIF</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-600">3</span>
            <span className="text-xs text-slate-500 font-normal">tingkat</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">L1 / L2 / L3 (HOTS)</span>
        </div>

        {/* BENTUK SOAL */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">BENTUK SOAL</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-600">3</span>
            <span className="text-xs text-slate-500 font-normal">format</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">PG, MCMA, Kategori</span>
        </div>

        {/* PRIORITAS TINGGI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">PRIORITAS TINGGI</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-600">{summary.priorityCounts['Prioritas Tinggi'] || 0}</span>
            <span className="text-xs text-slate-500 font-normal">soal</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Skor &ge; 90</span>
        </div>
      </div>

      {/* Main Analytical Visual Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Materi Chart Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Distribusi Materi</h2>
            </div>
            <button 
              onClick={() => onNavigate('distribusi')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Detail →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Bilangan', count: summary.elementCounts['Bilangan'], pct: summary.elementPercentages['Bilangan'], baseline: '16%', color: 'bg-blue-600' },
              { name: 'Aljabar', count: summary.elementCounts['Aljabar'], pct: summary.elementPercentages['Aljabar'], baseline: '34%', color: 'bg-indigo-600' },
              { name: 'Geometri & Pengukuran', count: summary.elementCounts['Geometri dan Pengukuran'], pct: summary.elementPercentages['Geometri dan Pengukuran'], baseline: '30%', color: 'bg-emerald-600' },
              { name: 'Data dan Peluang', count: summary.elementCounts['Data dan Peluang'], pct: summary.elementPercentages['Data dan Peluang'], baseline: '20%', color: 'bg-amber-600' },
            ].map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="text-slate-500">{item.count} Soal ({item.pct}%) · <span className="text-[11px] text-slate-400">Base: {item.baseline}</span></span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
            Baseline acuan 2026: Bilangan 16%, Aljabar 34%, Geometri 30%, Data 20%. Dapat dikustomisasi di menu Input Prediksi.
          </div>
        </div>

        {/* Level Kognitif Chart Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Distribusi Kognitif</h2>
            </div>
            <span className="text-xs text-slate-500">Standar Fase D</span>
          </div>

          <div className="space-y-3">
            {[
              { level: 'Memahami (L1)', count: summary.cognitiveCounts['Memahami'] || 0, color: 'bg-sky-500' },
              { level: 'Mengaplikasikan (L2)', count: summary.cognitiveCounts['Mengaplikasikan'] || 0, color: 'bg-emerald-500' },
              { level: 'Menalar (L3 / HOTS)', count: summary.cognitiveCounts['Menalar'] || 0, color: 'bg-purple-600' },
            ].map(cog => {
              const pct = total ? Math.round((cog.count / total) * 100) : 0;
              return (
                <div key={cog.level} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cog.level}</span>
                    <span className="text-slate-500">{cog.count} Soal ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cog.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg text-xs text-purple-900">
            <span className="font-bold">Fokus HOTS & Penalaran:</span> Proporsi level Menalar dioptimalkan untuk memfasilitasi evaluasi multi-pernyataan dan interpretasi data kritis.
          </div>
        </div>

        {/* Bentuk Soal Chart Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">Distribusi Bentuk Soal</h2>
            </div>
            <span className="text-xs text-slate-500">Multi-Format</span>
          </div>

          <div className="space-y-3">
            {[
              { form: 'Pilihan Ganda (PG)', count: summary.formCounts['PG'] || 0, color: 'bg-slate-700' },
              { form: 'PG Kompleks / MCMA', count: summary.formCounts['PG Kompleks/MCMA'] || 0, color: 'bg-indigo-600' },
              { form: 'PG Kategori (Benar/Salah)', count: summary.formCounts['PG Kategori'] || 0, color: 'bg-amber-600' },
            ].map(f => {
              const pct = total ? Math.round((f.count / total) * 100) : 0;
              return (
                <div key={f.form} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{f.form}</span>
                    <span className="text-slate-500">{f.count} Soal ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${f.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            Kombinasi PG Tunggal, PG Kompleks, dan PG Kategori menekan efek tebakan acak dan mengukur pemahaman konsep secara mendalam.
          </div>
        </div>
      </div>

      {/* 7-Step Prediction Algorithm Engine Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Jalur Eksekusi Mesin Analisis Prediksi (7 Tahap)</h2>
              <p className="text-xs text-slate-500">Algoritma analitik prediktif berbasis pemetaan dokumen referensi TKA Fase D</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Selesai Terkalibrasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>STEP 1: Ekstraksi Materi</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{summary.stepsCompleted.step1_extracted}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>STEP 2: Pengelompokan Elemen</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{summary.stepsCompleted.step2_grouped}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>STEP 3 & 4: Pola Acuan 2026</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{summary.stepsCompleted.step4_pattern_2026}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>STEP 5-7: Prediksi & Transparansi</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{summary.stepsCompleted.step5_expansion_2027}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix for Teachers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('generator-indikator')}
          className="text-left p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs group"
        >
          <Compass className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-slate-900">Generator Indikator</h3>
          <p className="text-xs text-slate-500 mt-1">Hasilkan indikator operasional lengkap 10 aspek kurikulum.</p>
        </button>

        <button
          onClick={() => onNavigate('generator-soal')}
          className="text-left p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs group"
        >
          <Sparkles className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-slate-900">Generator Butir Soal</h3>
          <p className="text-xs text-slate-500 mt-1">Buat stimulus, opsi jawaban, kunci, dan pembahasan runtut.</p>
        </button>

        <button
          onClick={() => onNavigate('validator')}
          className="text-left p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs group"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-slate-900">Validator Asesmen</h3>
          <p className="text-xs text-slate-500 mt-1">Telaah kelayakan 14 aspek standar konstruksi dan bahasa.</p>
        </button>

        <button
          onClick={() => onNavigate('perbandingan')}
          className="text-left p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs group"
        >
          <Clock className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-slate-900">Analisis 2026 → 2027</h3>
          <p className="text-xs text-slate-500 mt-1">Tinjau perbandingan aspek acuan terhadap rancangan prediksi.</p>
        </button>
      </div>
    </div>
  );
};
