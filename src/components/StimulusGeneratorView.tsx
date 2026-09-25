import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  MapPin, 
  Table, 
  BarChart, 
  FileText,
  Compass
} from 'lucide-react';
import { ContextType, StimulusType, ElementType } from '../types';

export const StimulusGeneratorView: React.FC = () => {
  const [selectedContext, setSelectedContext] = useState<ContextType>('UMKM');
  const [selectedStimulusType, setSelectedStimulusType] = useState<StimulusType>('Tabel');
  const [selectedElement, setSelectedElement] = useState<ElementType>('Aljabar');
  const [mathConcept, setMathConcept] = useState('Sistem Persamaan Linear Dua Variabel (SPLDV) / Biaya Produksi');
  
  const [generatedStimulus, setGeneratedStimulus] = useState<{
    judul: string;
    narasi: string;
    dataVisual: string;
    analisisFungsi: string;
    relevansiNumerasi: string;
  } | null>(null);

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const contextCatalog: { id: ContextType; desc: string; icon: string }[] = [
    { id: 'Kehidupan sehari-hari', desc: 'Rencana belanja keluarga, tagihan utilitas rumah, pengelolaan waktu', icon: '🏠' },
    { id: 'Sekolah', desc: 'Renovasi lapangan basket, kas OSIS, data kehadiran dan perpustakaan', icon: '🏫' },
    { id: 'Lingkungan', desc: 'Timbulan sampah organik, konservasi mata air, reboisasi mangrove', icon: '🌱' },
    { id: 'Teknologi', desc: 'Kapasitas baterai gawai, kecepatan transfer data internet, sistem IoT', icon: '💻' },
    { id: 'Transportasi', desc: 'Jadwal moda transportasi umum komuter, konsumsi BBM per kilometer', icon: '🚆' },
    { id: 'Ekonomi', desc: 'Kalkulasi suku bunga tabungan, inflasi sembako, promo kupon diskon', icon: '💰' },
    { id: 'UMKM', desc: 'Katering rumahan, kerajinan tangan, kalkulasi modal & titik impas (BEP)', icon: '🛍️' },
    { id: 'Pertanian', desc: 'Sistem irigasi tetes, takaran pupuk per hektar, hasil panen padi', icon: '🌾' },
    { id: 'Energi', desc: 'Panel surya fotovoltaik, efisiensi turbin angin mikro, konsumsi kWh', icon: '⚡' },
    { id: 'Kesehatan masyarakat', desc: 'Indeks massa tubuh, cakupan vaksinasi, donor darah PMI', icon: '🏥' },
    { id: 'Data lingkungan', desc: 'Indeks standar pencemaran udara (ISPU), curah hujan bulanan', icon: '📊' },
    { id: 'Infrastruktur', desc: 'Kekuatan beban jembatan timbang, ketebalan pengaspalan jalan raya', icon: '🏗️' },
    { id: 'Literasi digital', desc: 'Statistik durasi screen-time, keamanan kata sandi, survei online', icon: '📱' },
    { id: 'Fenomena sosial', desc: 'Penyaluran logistik bencana, demografi usia produktif kelurahan', icon: '🤝' },
  ];

  const handleGenerateStimulus = () => {
    let judul = `Stimulus: Kasus ${selectedContext} Berbasis ${selectedStimulusType}`;
    let narasi = '';
    let dataVisual = '';
    let analisisFungsi = '';
    let relevansiNumerasi = '';

    if (selectedContext === 'UMKM') {
      narasi = `Ibu Aminah mengelola usaha kue tradisional UMKM "Rasa Nusantara". Untuk memenuhi pesanan kotak hantaran pernikahan, ia memproduksi dua jenis paket kue: Paket Melati (berisi lemper dan pastel) dan Paket Mawar (berisi kue lumpur dan risol). Seluruh kebutuhan bahan mentah dihitung secara akurat berdasarkan ketersediaan tepung terigu dan margarin.`;
      dataVisual = `TABEL DATA KEBUTUHAN BAHAN & HARGA JUAL:\n+----------------+--------------------+-------------------+-------------------+\n| Jenis Paket    | Tepung Terigu (gr) | Margarin (gr)     | Harga Jual (Rp)   |\n+----------------+--------------------+-------------------+-------------------+\n| Paket Melati   | 250                | 100               | 45.000            |\n| Paket Mawar    | 150                | 150               | 35.000            |\n+----------------+--------------------+-------------------+-------------------+\nStok tersedia di gudang: 12 kg tepung terigu dan 8 kg margarin.`;
      analisisFungsi = `Data pada tabel menyediakan batasan pertidaksamaan linear dan fungsi objektif penerimaan secara eksplisit, tanpa dekorasi cerita berlebih.`;
      relevansiNumerasi = `Siswa dilatih mengonversi satuan kilogram ke gram, menyusun sistem persamaan/pertidaksamaan linear dua variabel, dan menguji kapasitas produksi optimal.`;
    } else if (selectedContext === 'Energi') {
      narasi = `SMP Negeri 1 memasang sistem pembangkit listrik tenaga surya (PLTS) on-grid di atap laboratorium sains untuk mengurangi ketergantungan pada listrik fosil. Panel surya dipasang dalam susunan bertingkat menghadap utara untuk menangkap radiasi matahari secara optimal sepanjang hari.`;
      dataVisual = `DIAGRAM DATA PRODUKSI ENERGI (kWh):\n- Pukul 08.00 - 10.00 : Rata-rata 4,2 kWh / jam\n- Pukul 10.00 - 14.00 : Rata-rata 8,5 kWh / jam (puncak penyinaran)\n- Pukul 14.00 - 16.00 : Rata-rata 3,8 kWh / jam\nTarif penghematan listrik PLN: Rp1.444,70 per kWh.`;
      analisisFungsi = `Menyajikan parameter laju waktu dan daya secara terstruktur untuk pengujian fungsi linier sepotong (piecewise) atau barisan pola bilangan.`;
      relevansiNumerasi = `Menghitung total energi harian, estimasi efisiensi finansial bulanan, dan penalaran grafik fluktuasi daya.`;
    } else if (selectedContext === 'Data lingkungan') {
      narasi = `Dinas Lingkungan Hidup memantau tren penurunan timbulan sampah plastik di kawasan percontohan setelah penerapan aturan larangan kantong plastik sekali pakai selama enam bulan berturut-turut.`;
      dataVisual = `GRAFIK TREN DATA (Volume Sampah dalam Ton):\n- Bulan 1: 48 ton\n- Bulan 2: 44 ton\n- Bulan 3: 39 ton\n- Bulan 4: 33 ton\n- Bulan 5: 26 ton\n- Bulan 6: 18 ton\nTarget akhir tahun: Kurang dari 10 ton per bulan.`;
      analisisFungsi = `Sumbu data menunjukkan regresi tren penurunan nyata yang dapat dihitung selisih per bulan, rata-rata laju penurunan, dan persentase keberhasilan.`;
      relevansiNumerasi = `Menganalisis kemiringan tren (gradien negatif), interpolasi, dan ekstrapolasi data linier.`;
    } else {
      narasi = `Dalam kegiatan ${selectedContext}, dilakukan pencatatan data terukur yang berkaitan dengan ${mathConcept}. Informasi dikumpulkan melalui instrumen pemantauan terstandar.`;
      dataVisual = `REKAPITULASI DATA KUANTITATIF:\n- Parameter A: Nilai terukur dengan toleransi presisi ±2%\n- Parameter B: Hubungan berbanding lurus terhadap variabel waktu\n- Satuan metrik: Sesuai standar baku nasional (SI).`;
      analisisFungsi = `Menyajikan angka dan variabel fungsional matematis yang mutlak dibutuhkan untuk penyelesaian soal.`;
      relevansiNumerasi = `Menerapkan konsep ${selectedElement} dalam menyelesaikan permasalahan dunia nyata.`;
    }

    setGeneratedStimulus({
      judul,
      narasi,
      dataVisual,
      analisisFungsi,
      relevansiNumerasi
    });
  };

  const handleCopy = () => {
    if (!generatedStimulus) return;
    const text = `
${generatedStimulus.judul}

[NARASI KONTEKS]
${generatedStimulus.narasi}

[DATA STIMULUS (${selectedStimulusType})]
${generatedStimulus.dataVisual}

[FUNGSI MATEMATIS]
${generatedStimulus.analisisFungsi}

[KEMAMPUAN NUMERASI]
${generatedStimulus.relevansiNumerasi}
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
          <BookOpen className="w-4 h-4" />
          <span>Fitur L & M · Konteks & Stimulus Multimodal</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Generator Konteks & Stimulus Soal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Konteks berfungsi sebagai penyedia stimulus matematika esensial, bukan sekadar hiasan cerita.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: 14 Contexts & Stimulus selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">Pilih 14 Ragam Konteks Asesmen</h2>
            <span className="text-[11px] text-slate-400">Relevan dengan dunia peserta didik SMP</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
            {contextCatalog.map(ctx => (
              <div
                key={ctx.id}
                onClick={() => setSelectedContext(ctx.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedContext === ctx.id
                    ? 'border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{ctx.icon}</span>
                  <span>{ctx.id}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 pl-6 font-normal">{ctx.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div>
              <label className="font-semibold text-xs text-slate-700 block mb-1">Tipe Stimulus yang Dibuat</label>
              <select
                value={selectedStimulusType}
                onChange={(e) => setSelectedStimulusType(e.target.value as StimulusType)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
              >
                {['Tabel', 'Grafik', 'Diagram', 'Infografis', 'Peta Sederhana', 'Denah', 'Data Numerik', 'Teks'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-xs text-slate-700 block mb-1">Elemen Terkait</label>
              <select
                value={selectedElement}
                onChange={(e) => setSelectedElement(e.target.value as ElementType)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
              >
                <option value="Aljabar">Aljabar</option>
                <option value="Bilangan">Bilangan</option>
                <option value="Geometri dan Pengukuran">Geometri dan Pengukuran</option>
                <option value="Data dan Peluang">Data dan Peluang</option>
              </select>
            </div>

            <button
              onClick={handleGenerateStimulus}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>GENERATE STIMULUS</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Output preview */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Hasil Rekayasa Stimulus Matematika Kontekstual
            </h2>
            {generatedStimulus && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedSuccess ? 'Tersalin' : 'Salin Stimulus'}</span>
              </button>
            )}
          </div>

          {!generatedStimulus ? (
            <div className="py-20 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pilih konteks dari 14 ragam pilihan di samping dan klik <strong>"GENERATE STIMULUS"</strong> untuk membuat data tabel, narasi, atau grafik yang siap diintegrasikan ke butir soal.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">
                  {generatedStimulus.judul}
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {generatedStimulus.narasi}
                </p>
              </div>

              {/* Data Visual Component */}
              <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                <div className="text-slate-400 font-sans text-xs font-bold mb-2 flex items-center justify-between">
                  <span>REPRESENTASI DATA STIMULUS: [{selectedStimulusType.toUpperCase()}]</span>
                  <span className="text-[10px] text-slate-500 font-normal">Data Esensial Tanpa Bocoran Jawaban</span>
                </div>
                <pre className="whitespace-pre-wrap">{generatedStimulus.dataVisual}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-1">
                  <span className="font-bold text-indigo-900 block">Fungsi Matematis Stimulus:</span>
                  <p className="text-slate-700 leading-relaxed">{generatedStimulus.analisisFungsi}</p>
                </div>

                <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg space-y-1">
                  <span className="font-bold text-purple-900 block">Relevansi Literasi Numerasi:</span>
                  <p className="text-slate-700 leading-relaxed">{generatedStimulus.relevansiNumerasi}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
