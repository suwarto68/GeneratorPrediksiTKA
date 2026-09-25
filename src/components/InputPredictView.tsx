import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  Check, 
  HelpCircle,
  FileCheck2,
  PieChart,
  BrainCircuit,
  Boxes
} from 'lucide-react';
import { PredictionConfig, PredictionMode, DistributionMode, StimulusType } from '../types';

interface InputPredictViewProps {
  config: PredictionConfig;
  onChangeConfig: (newConfig: PredictionConfig) => void;
  onGenerate: () => void;
}

export const InputPredictView: React.FC<InputPredictViewProps> = ({
  config,
  onChangeConfig,
  onGenerate
}) => {
  const [localConfig, setLocalConfig] = useState<PredictionConfig>(config);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdate = <K extends keyof PredictionConfig>(key: K, value: PredictionConfig[K]) => {
    const updated = { ...localConfig, [key]: value };
    setLocalConfig(updated);
    onChangeConfig(updated);
  };

  const handleSourceToggle = (sourceKey: keyof PredictionConfig['sources']) => {
    const updatedSources = {
      ...localConfig.sources,
      [sourceKey]: !localConfig.sources[sourceKey]
    };
    handleUpdate('sources', updatedSources);
  };

  const handleStimulusToggle = (stimulus: StimulusType) => {
    const exists = localConfig.allowedStimuli.includes(stimulus);
    const updated = exists 
      ? localConfig.allowedStimuli.filter(s => s !== stimulus)
      : [...localConfig.allowedStimuli, stimulus];
    handleUpdate('allowedStimuli', updated);
  };

  const handleResetToBaseline = () => {
    const resetConfig: PredictionConfig = {
      ...localConfig,
      jumlahSoal: 30,
      modePrediksi: 'Seimbang',
      distribusiMateriMode: 'Mengikuti baseline 2026',
      customDistribution: {
        bilangan: 16,
        aljabar: 34,
        geometri: 30,
        dataPeluang: 20
      }
    };
    setLocalConfig(resetConfig);
    onChangeConfig(resetConfig);
    setSuccessMsg('Konfigurasi dikembalikan ke baseline acuan TKA 2026.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTriggerGenerate = () => {
    onGenerate();
    setSuccessMsg('Prediksi kisi-kisi 2027 berhasil diperbarui!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const allStimuli: StimulusType[] = [
    'Teks', 'Tabel', 'Grafik', 'Diagram', 'Infografis', 'Peta Sederhana', 'Denah', 'Data Numerik', 'Kombinasi'
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Halaman Input Data Prediksi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Parameter Kalibrasi Kisi-Kisi 2027
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tentukan target asesmen, sumber acuan, mode prediksi analitis, dan alokasi distribusi materi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToBaseline}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Baseline 2026</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Profil Asesmen & Target */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">1. Profil Target Asesmen</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jenjang Pendidikan</label>
              <input
                type="text"
                disabled
                value={localConfig.jenjang}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fase Kurikulum</label>
              <input
                type="text"
                disabled
                value={localConfig.fase}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
              <input
                type="text"
                disabled
                value={localConfig.mataPelajaran}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tahun Target Asesmen</label>
              <input
                type="number"
                value={localConfig.tahunTarget}
                onChange={(e) => handleUpdate('tahunTarget', Number(e.target.value) || 2027)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Jumlah Soal Slider */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Jumlah Soal Keseluruhan</label>
              <span className="font-extrabold text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {localConfig.jumlahSoal} Butir
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={50}
              step={5}
              value={localConfig.jumlahSoal}
              onChange={(e) => handleUpdate('jumlahSoal', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>15 Butir</span>
              <span>Default: 30 Butir</span>
              <span>50 Butir</span>
            </div>
          </div>

          {/* Sumber Acuan Checkboxes */}
          <div className="pt-2 space-y-2">
            <label className="font-semibold text-xs text-slate-700 block">Sumber Dokumen Acuan</label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'kisiKisi2026', label: 'Kisi-kisi Try Out I Soal TKA 2026' },
                { id: 'soalTka2026', label: 'Soal TKA Matematika SMP/MTs Tahun 2026' },
                { id: 'kerangkaAsesmen', label: 'Kerangka Asesmen SMP Fase D' },
                { id: 'dokumenPengguna', label: 'Dokumen Tambahan Hasil Upload Pengguna' }
              ].map(src => (
                <label key={src.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.sources[src.id as keyof PredictionConfig['sources']]}
                    onChange={() => handleSourceToggle(src.id as keyof PredictionConfig['sources'])}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">{src.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Mode Prediksi & Distribusi Materi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">2. Mode Prediksi Analitis</h2>
          </div>

          <div className="space-y-2">
            {[
              {
                mode: 'Konservatif' as PredictionMode,
                badge: 'Pola Stabil 2026',
                desc: 'Mempertahankan 85-90% pola soal 2026, perubahan minimal terfokus pada peremajaan angka dan konteks lokal.'
              },
              {
                mode: 'Seimbang' as PredictionMode,
                badge: 'Rekomendasi Utama',
                desc: 'Mengikuti baseline 2026 dengan rotasi 25% variasi indikator baru, penajaman stimulus data, dan variasi bentuk soal.'
              },
              {
                mode: 'Eksploratif' as PredictionMode,
                badge: 'Progresif HOTS',
                desc: 'Meningkatkan porsi Menalar (+10%), memperbanyak PG Kompleks & Kategori, serta mengadopsi konteks teknologi/sains terbarukan.'
              }
            ].map(item => (
              <div
                key={item.mode}
                onClick={() => handleUpdate('modePrediksi', item.mode)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  localConfig.modePrediksi === item.mode
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="predictionMode"
                      checked={localConfig.modePrediksi === item.mode}
                      onChange={() => handleUpdate('modePrediksi', item.mode)}
                      className="text-indigo-600"
                    />
                    <span className="font-bold text-slate-900">{item.mode}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed pl-5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Opsi Distribusi Materi */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-xs text-slate-700">Alokasi Distribusi Materi</label>
              <span className="text-[11px] text-slate-500">Pilih skema pembagian</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['Mengikuti baseline 2026', 'Otomatis', 'Manual'] as DistributionMode[]).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleUpdate('distribusiMateriMode', mode)}
                  className={`px-2 py-1.5 rounded-lg border text-center font-medium transition-all ${
                    localConfig.distribusiMateriMode === mode
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode === 'Mengikuti baseline 2026' ? 'Baseline 2026' : mode}
                </button>
              ))}
            </div>

            {/* Slider Manual jika mode Manual dipilih */}
            {localConfig.distribusiMateriMode === 'Manual' && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 mt-2 text-xs">
                <span className="font-bold text-slate-800 block">Kustom Persentase Materi:</span>
                {[
                  { key: 'bilangan', label: 'Bilangan', val: localConfig.customDistribution.bilangan },
                  { key: 'aljabar', label: 'Aljabar', val: localConfig.customDistribution.aljabar },
                  { key: 'geometri', label: 'Geometri & Pengukuran', val: localConfig.customDistribution.geometri },
                  { key: 'dataPeluang', label: 'Data dan Peluang', val: localConfig.customDistribution.dataPeluang }
                ].map(el => (
                  <div key={el.key} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">{el.label}</span>
                      <span className="font-bold text-slate-900">{el.val}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={el.val}
                      onChange={(e) => {
                        const updated = {
                          ...localConfig.customDistribution,
                          [el.key]: Number(e.target.value)
                        };
                        handleUpdate('customDistribution', updated);
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Filter Stimulus yang Diizinkan */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Boxes className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">3. Variasi Stimulus yang Diaktifkan</h2>
          <span className="text-xs text-slate-400">· Semua stimulus wajib fungsional matematis</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allStimuli.map(stimulus => {
            const isSelected = localConfig.allowedStimuli.includes(stimulus);
            return (
              <button
                key={stimulus}
                type="button"
                onClick={() => handleStimulusToggle(stimulus)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {stimulus}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Generate Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-base font-bold">Siap Mengalkulasi Prediksi Kisi-Kisi?</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Sistem akan menjalankan 7 langkah analisis dan menghasilkan {localConfig.jumlahSoal} indikator prediktif.
          </p>
        </div>

        <button
          onClick={handleTriggerGenerate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>GENERATE PREDIKSI KISI-KISI 2027</span>
        </button>
      </div>
    </div>
  );
};
