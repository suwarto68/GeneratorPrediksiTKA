import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  PlusCircle, 
  Check, 
  Copy, 
  FileText,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { 
  AssessmentItem, 
  ElementType, 
  CognitiveLevel, 
  QuestionForm, 
  ContextType, 
  StimulusType 
} from '../types';

interface IndicatorGeneratorViewProps {
  onAddIndicatorToBlueprint: (item: AssessmentItem) => void;
  onNavigateToQuestionGen: (item: AssessmentItem) => void;
}

export const IndicatorGeneratorView: React.FC<IndicatorGeneratorViewProps> = ({
  onAddIndicatorToBlueprint,
  onNavigateToQuestionGen,
}) => {
  const [selectedElement, setSelectedElement] = useState<ElementType>('Aljabar');
  const [selectedSubElement, setSelectedSubElement] = useState('Sistem Persamaan Linear Dua Variabel (SPLDV)');
  const [selectedCognitive, setSelectedCognitive] = useState<CognitiveLevel>('Menalar');
  const [selectedForm, setSelectedForm] = useState<QuestionForm>('PG Kompleks/MCMA');
  const [selectedContext, setSelectedContext] = useState<ContextType>('UMKM');
  const [selectedStimulus, setSelectedStimulus] = useState<StimulusType>('Infografis');
  
  const [generatedItem, setGeneratedItem] = useState<AssessmentItem | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const subelementOptions: Record<ElementType, string[]> = {
    'Bilangan': [
      'Bilangan Bulat dan Pecahan',
      'Bilangan Berpangkat dan Bentuk Akar',
      'Aritmetika Sosial (Diskon, Bunga, Pajak)',
      'Rasio dan Perbandingan Senilai/Berbalik Nilai',
      'Pola dan Barisan Bilangan'
    ],
    'Aljabar': [
      'Bentuk Aljabar dan Faktorisasi',
      'Persamaan Linear Satu Variabel (PLSV)',
      'Pertidaksamaan Linear Satu Variabel (PtLSV)',
      'Sistem Persamaan Linear Dua Variabel (SPLDV)',
      'Fungsi Linier dan Grafik (PGL)',
      'Persamaan Kuadrat Sederhana',
      'Barisan dan Deret Aritmetika'
    ],
    'Geometri dan Pengukuran': [
      'Teorema Pythagoras dan Penerapan',
      'Garis, Sudut dan Kesebangunan',
      'Luas & Keliling Bangun Datar Gabungan',
      'Lingkaran (Busur, Juring, Sudut Pusat)',
      'Luas Permukaan Bangun Ruang Sisi Datar',
      'Volume Bangun Ruang Sisi Lengkung',
      'Transformasi Geometri (Refleksi & Translasi)'
    ],
    'Data dan Peluang': [
      'Penyajian dan Interpretasi Grafik Tren',
      'Ukuran Pemusatan (Mean, Median, Modus Gabungan)',
      'Ukuran Penyebaran (Jangkauan dan Kuartil)',
      'Peluang Teoretik Kejadian Majemuk',
      'Peluang Empirik dan Frekuensi Harapan',
      'Evaluasi Misleading Visual & Bias Data'
    ]
  };

  const handleElementChange = (elem: ElementType) => {
    setSelectedElement(elem);
    setSelectedSubElement(subelementOptions[elem][0] || 'Materi Pokok');
  };

  const handleGenerateIndicator = () => {
    // Generate specialized operational indicator based on selections
    let indicatorText = '';
    let competence = '';
    let numerasi = '';
    let visual = '';
    let reason = '';

    if (selectedElement === 'Aljabar') {
      competence = `Memodelkan dan menganalisis situasi kontekstual terkait ${selectedSubElement} pada domain literasi numerasi SMP Fase D.`;
      if (selectedCognitive === 'Menalar') {
        indicatorText = `Menganalisis sistem optimasi keuntungan usaha berbasis ${selectedSubElement} dalam konteks ${selectedContext} untuk memvalidasi efisiensi biaya produksi.`;
        numerasi = `Mengintegrasikan dua variabel linear dan menguji kebenaran multi-klaim keuntungan marjinal.`;
        visual = `Infografis atau tabel komposisi biaya operasional harian dan target omzet.`;
        reason = `Tuntutan penalaran aljabar tingkat lanjut (L3) yang kontekstual dengan isu ekonomi masyarakat.`;
      } else {
        indicatorText = `Menyelesaikan masalah kontekstual yang melibatkan model ${selectedSubElement} dalam situasi ${selectedContext}.`;
        numerasi = `Merumuskan variabel matematika dan mencari nilai penyelesaian persamaan linear.`;
        visual = `Tabel daftar harga paket atau tarif langganan.`;
        reason = `Aplikasi konsep aljabar standar Fase D dengan variasi stimulus data.`;
      }
    } else if (selectedElement === 'Geometri dan Pengukuran') {
      competence = `Menerapkan konsep geometri dan pengukuran dalam memecahkan masalah kontekstual ${selectedSubElement}.`;
      if (selectedCognitive === 'Menalar') {
        indicatorText = `Mengevaluasi kesesuaian estimasi biaya dan luas bahan kemasan atau denah fasilitas ${selectedContext} yang memanfaatkan prinsip ${selectedSubElement}.`;
        numerasi = `Menghitung luas permukaan netto atau volume gabungan dengan mempertimbangkan batasan material.`;
        visual = `Denah berskala teknis atau diagram 3D potongan struktur objek.`;
        reason = `Kombinasi penalaran spasial geometri dengan literasi finansial.`;
      } else {
        indicatorText = `Menghitung besaran ukuran atau panjang sisi pada konstruksi ${selectedContext} menggunakan ${selectedSubElement}.`;
        numerasi = `Melakukan kalkulasi metrik panjang/luas/volume dengan satuan baku.`;
        visual = `Sketsa gambar teknis dua dimensi dengan label ukuran sudut atau panjang sisi.`;
        reason = `Pengukuran aplikatif berbasis situasi nyata dunia kerja/lingkungan.`;
      }
    } else if (selectedElement === 'Data dan Peluang') {
      competence = `Membaca, menginterpretasi, dan mengevaluasi data kuantitatif serta peluang dalam konteks ${selectedContext}.`;
      indicatorText = `Menganalisis data statistik terkait isu ${selectedContext} menggunakan ${selectedSubElement} untuk memprediksi kecenderungan tren dan membuat keputusan rasional.`;
      numerasi = `Menafsirkan fluktuasi grafik garis atau rasio peluang kejadian majemuk.`;
      visual = `Diagram garis tren ganda atau infografis persentase survei data lingkungan.`;
      reason = `Keterampilan abad-21 dalam membaca data dan menyaring informasi kuantitatif secara kritis.`;
    } else {
      competence = `Memahami dan mengoperasikan konsep bilangan serta proporsi pada ${selectedSubElement}.`;
      indicatorText = `Menyelesaikan masalah kalkulasi proporsional dan estimasi numerik terkait ${selectedSubElement} dalam aktivitas ${selectedContext}.`;
      numerasi = `Melakukan operasi pecahan/persentase bertingkat atau perbandingan berbalik nilai.`;
      visual = `Tabel rincian transaksi belanja atau konfigurasi susunan objek teratur.`;
      reason = `Fondasi aritmetika terapan yang esensial dalam pengambilan keputusan kuantitatif.`;
    }

    const newItem: AssessmentItem = {
      id: `GEN-IND-${Date.now()}`,
      no: 99,
      tahun: 2027,
      jenjang: 'SMP/MTs',
      fase: 'Fase D',
      mata_pelajaran: 'Matematika',
      elemen: selectedElement,
      subelemen: selectedSubElement,
      kompetensi: competence,
      indikator_prediktif: indicatorText,
      level_kognitif: selectedCognitive,
      bentuk_soal: selectedForm,
      stimulus: selectedStimulus,
      konteks: selectedContext,
      prioritas_prediktif: selectedCognitive === 'Menalar' ? 'Prioritas Tinggi' : 'Prioritas Menengah',
      skor_prediksi: selectedCognitive === 'Menalar' ? 94 : 86,
      alasan: reason,
      sumber_acuan: 'Generator Indikator Fase D (Sintesis Prediktif 2027)',
      status_label: 'Prediksi',
      kemampuan_numerasi: numerasi,
      potensi_visual: visual
    };

    setGeneratedItem(newItem);
    setAddedSuccess(false);
  };

  const handleAdd = () => {
    if (!generatedItem) return;
    onAddIndicatorToBlueprint(generatedItem);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleCopyText = () => {
    if (!generatedItem) return;
    const text = `
ELEMEN: ${generatedItem.elemen}
SUBELEMEN: ${generatedItem.subelemen}
KOMPETENSI: ${generatedItem.kompetensi}
INDIKATOR PREDIKTIF: ${generatedItem.indikator_prediktif}
LEVEL KOGNITIF: ${generatedItem.level_kognitif}
BENTUK SOAL: ${generatedItem.bentuk_soal}
KONTEKS: ${generatedItem.konteks}
STIMULUS: ${generatedItem.stimulus}
KEMAMPUAN NUMERASI: ${generatedItem.kemampuan_numerasi}
POTENSI VISUAL: ${generatedItem.potensi_visual}
PRIORITAS: ${generatedItem.prioritas_prediktif} (Skor: ${generatedItem.skor_prediksi})
ALASAN: ${generatedItem.alasan}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Fitur K · Konstruksi Indikator Asesmen</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Generator Indikator Soal TKA 2027
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hasilkan indikator operasional, terukur, non-ambigu, dan terkalibrasi dengan 10 aspek standar asesmen SMP Fase D.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 1 Col: Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Parameter Indikator</h2>
          </div>

          {/* Elemen */}
          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">1. Elemen Materi</label>
            <select
              value={selectedElement}
              onChange={(e) => handleElementChange(e.target.value as ElementType)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="Bilangan">Bilangan</option>
              <option value="Aljabar">Aljabar</option>
              <option value="Geometri dan Pengukuran">Geometri dan Pengukuran</option>
              <option value="Data dan Peluang">Data dan Peluang</option>
            </select>
          </div>

          {/* Subelemen */}
          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">2. Subelemen / Topik</label>
            <select
              value={selectedSubElement}
              onChange={(e) => setSelectedSubElement(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              {subelementOptions[selectedElement]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Level Kognitif */}
          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">3. Level Kognitif</label>
            <select
              value={selectedCognitive}
              onChange={(e) => setSelectedCognitive(e.target.value as CognitiveLevel)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="Memahami">Memahami (L1)</option>
              <option value="Mengaplikasikan">Mengaplikasikan (L2)</option>
              <option value="Menalar">Menalar (L3 / HOTS)</option>
            </select>
          </div>

          {/* Bentuk Soal */}
          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">4. Bentuk Soal</label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value as QuestionForm)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="PG">Pilihan Ganda (PG Tunggal)</option>
              <option value="PG Kompleks/MCMA">PG Kompleks (MCMA)</option>
              <option value="PG Kategori">PG Kategori (Benar/Salah)</option>
            </select>
          </div>

          {/* Konteks */}
          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">5. Konteks Stimulus</label>
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value as ContextType)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              {[
                'Kehidupan sehari-hari', 'Sekolah', 'Lingkungan', 'Teknologi', 'Transportasi',
                'Ekonomi', 'UMKM', 'Pertanian', 'Energi', 'Kesehatan masyarakat',
                'Data lingkungan', 'Infrastruktur', 'Literasi digital', 'Fenomena sosial'
              ].map(ctx => (
                <option key={ctx} value={ctx}>{ctx}</option>
              ))}
            </select>
          </div>

          {/* Stimulus */}
          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">6. Bentuk Stimulus</label>
            <select
              value={selectedStimulus}
              onChange={(e) => setSelectedStimulus(e.target.value as StimulusType)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden"
            >
              {['Teks', 'Tabel', 'Grafik', 'Diagram', 'Infografis', 'Peta Sederhana', 'Denah', 'Data Numerik', 'Kombinasi'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateIndicator}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>GENERATE INDIKATOR</span>
          </button>
        </div>

        {/* Right 2 Cols: Output 10 Properties Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Hasil Konstruksi 10 Aspek Indikator Soal
            </h2>
            {generatedItem && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Terstruktur & Siap Uji
              </span>
            )}
          </div>

          {!generatedItem ? (
            <div className="py-16 text-center space-y-3">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pilih parameter di panel sebelah kiri lalu tekan tombol <strong>"GENERATE INDIKATOR"</strong> untuk memproduksi spesifikasi lengkap 10 aspek indikator TKA.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Core Output Indicator */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                <span className="font-bold text-indigo-900 text-xs block">4. Indikator Prediktif 2027:</span>
                <p className="text-slate-900 font-semibold text-sm leading-relaxed">
                  {generatedItem.indikator_prediktif}
                </p>
              </div>

              {/* 10 Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">1. Elemen:</span>
                  <span className="text-slate-900 font-semibold">{generatedItem.elemen}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">2. Subelemen:</span>
                  <span className="text-slate-900 font-semibold">{generatedItem.subelemen}</span>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">3. Kompetensi yang Diukur:</span>
                  <span className="text-slate-700">{generatedItem.kompetensi}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">5. Level Kognitif:</span>
                  <span className="text-purple-700 font-bold">{generatedItem.level_kognitif}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">6. Bentuk Soal:</span>
                  <span className="text-slate-900 font-semibold">{generatedItem.bentuk_soal}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">7. Konteks Soal:</span>
                  <span className="text-slate-900 font-semibold">{generatedItem.konteks}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">8. Tipe Stimulus:</span>
                  <span className="text-slate-900 font-semibold">{generatedItem.stimulus}</span>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">9. Kemampuan Numerasi:</span>
                  <span className="text-slate-700">{generatedItem.kemampuan_numerasi}</span>
                </div>

                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block">10. Potensi Representasi Visual:</span>
                  <span className="text-slate-700">{generatedItem.potensi_visual}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedSuccess ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>

                  <button
                    onClick={() => onNavigateToQuestionGen(generatedItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lanjut Buat Soal</span>
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={addedSuccess}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Berhasil Ditambahkan!</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Tambahkan ke Tabel Kisi-Kisi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
