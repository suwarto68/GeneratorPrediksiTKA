import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  RotateCw, 
  HelpCircle, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { AssessmentItem, QuestionData, QuestionForm, CognitiveLevel, ElementType } from '../types';
import { INITIAL_QUESTIONS_SAMPLE } from '../data/baseline2026Data';

interface QuestionGeneratorViewProps {
  blueprintItems: AssessmentItem[];
  preselectedItem?: AssessmentItem | null;
  onValidateQuestion: (question: QuestionData) => void;
}

export const QuestionGeneratorView: React.FC<QuestionGeneratorViewProps> = ({
  blueprintItems,
  preselectedItem,
  onValidateQuestion
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    preselectedItem?.id || blueprintItems[0]?.id || 'TKA-BIL-01'
  );
  
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(
    INITIAL_QUESTIONS_SAMPLE[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Active item
  const activeItem = blueprintItems.find(i => i.id === selectedItemId) || blueprintItems[0];

  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    setShowAnswer(false);

    // Check if we have pre-built authentic sample for this or generate structured item
    const existing = INITIAL_QUESTIONS_SAMPLE.find(q => q.item_id === activeItem?.id);
    if (existing) {
      setTimeout(() => {
        setCurrentQuestion(existing);
        setIsLoading(false);
      }, 400);
      return;
    }

    // Dynamic generation matching the indicator
    setTimeout(() => {
      const isComplex = activeItem?.bentuk_soal === 'PG Kompleks/MCMA';
      const isCategory = activeItem?.bentuk_soal === 'PG Kategori';

      let newQ: QuestionData;

      if (isCategory) {
        newQ = {
          id: `Q-GEN-${Date.now()}`,
          item_id: activeItem?.id,
          elemen: activeItem?.elemen || 'Aljabar',
          subelemen: activeItem?.subelemen || 'Materi Pokok',
          indikator: activeItem?.indikator_prediktif || 'Indikator pembelajaran',
          level_kognitif: activeItem?.level_kognitif || 'Menalar',
          bentuk_soal: 'PG Kategori',
          konteks: activeItem?.konteks || 'Ekonomi',
          stimulus_type: activeItem?.stimulus || 'Grafik',
          stimulus_text: `Data pemantauan berkala pada konteks ${activeItem?.konteks} disajikan melalui instrumen pemantauan terpadu. Berdasarkan hasil pengukuran indikator matematis terkait ${activeItem?.subelemen}, diperoleh beberapa parameter nilai terukur yang saling terkait.`,
          pertanyaan: `Tentukan kategori "BENAR" atau "SALAH" untuk setiap pernyataan berikut berdasarkan informasi stimulus yang disajikan!`,
          category_statements: [
            { statement: 'Pernyataan 1: Nilai laju perubahan pada periode pengamatan pertama bernilai konstan dan bernilai positif.', category: 'BENAR' },
            { statement: 'Pernyataan 2: Kapasitas akumulasi keseluruhan melebihi batas toleransi yang ditetapkan.', category: 'SALAH' },
            { statement: 'Pernyataan 3: Rasio perbandingan antara variabel utama dan variabel pendukung adalah 3 : 2.', category: 'BENAR' }
          ],
          kunci: '1. Benar, 2. Salah, 3. Benar',
          pembahasan: `Langkah analisis matematis:\n1. Menguji pernyataan 1 berdasarkan data tertera -> Nilai laju = delta Y / delta X = konstan. (BENAR)\n2. Menguji pernyataan 2 -> Total akumulasi = 45 unit, batas toleransi = 50 unit (tidak melebihi). (SALAH)\n3. Menguji rasio perbandingan -> 18 : 12 disederhanakan menjadi 3 : 2. (BENAR)`,
          aspek_numerasi: `Evaluasi kebenaran klaim kuantitatif berbasis data stimulus.`
        };
      } else if (isComplex) {
        newQ = {
          id: `Q-GEN-${Date.now()}`,
          item_id: activeItem?.id,
          elemen: activeItem?.elemen || 'Bilangan',
          subelemen: activeItem?.subelemen || 'Aritmetika Sosial',
          indikator: activeItem?.indikator_prediktif || 'Indikator numerasi',
          level_kognitif: activeItem?.level_kognitif || 'Menalar',
          bentuk_soal: 'PG Kompleks/MCMA',
          konteks: activeItem?.konteks || 'UMKM',
          stimulus_type: activeItem?.stimulus || 'Infografis',
          stimulus_text: `Sebuah koperasi sekolah dan unit usaha siswa mengelola pengadaan seragam dan perlengkapan edukasi dengan skema promo pemesanan kolektif. Terdapat dua paket penawaran potongan harga untuk pemesanan rombongan kelas.`,
          pertanyaan: `Pilihlah pernyataan-pernyataan di bawah ini yang bernilai BENAR! (Jawaban benar lebih dari satu)`,
          complex_statements: [
            { statement: 'Pemesanan paket pertama memberikan penghematan nominal sebesar Rp120.000,00 per regu.', isCorrect: true },
            { statement: 'Persentase potongan efektif pada paket kedua setara dengan diskon langsung 25%.', isCorrect: false },
            { statement: 'Jika membeli untuk 4 regu, paket pertama lebih hemat dibandingkan paket kedua.', isCorrect: true }
          ],
          kunci: 'Pernyataan 1 dan Pernyataan 3',
          pembahasan: `Perhitungan:\n- Penghematan Paket 1: Rp600.000 x 20% = Rp120.000 (BENAR)\n- Penghematan Paket 2: Diskon 15% + 5% setara dengan 1 - (0.85 x 0.95) = 19.25%, bukan 25% (SALAH)\n- Perbandingan 4 regu: Total biaya Paket 1 Rp1.920.000 vs Paket 2 Rp1.938.000. Paket 1 lebih hemat Rp18.000 (BENAR)`,
          aspek_numerasi: `Penalaran komparatif diskon bertingkat dan perhitungan efisiensi anggaran.`
        };
      } else {
        newQ = {
          id: `Q-GEN-${Date.now()}`,
          item_id: activeItem?.id,
          elemen: activeItem?.elemen || 'Aljabar',
          subelemen: activeItem?.subelemen || 'PLSV/SPLDV',
          indikator: activeItem?.indikator_prediktif || 'Indikator operasional',
          level_kognitif: activeItem?.level_kognitif || 'Mengaplikasikan',
          bentuk_soal: 'PG',
          konteks: activeItem?.konteks || 'Sekolah',
          stimulus_type: activeItem?.stimulus || 'Tabel',
          stimulus_text: `Dalam rangka program penghijauan di lingkungan ${activeItem?.konteks}, panitia merencanakan alokasi bibit pohon dan sarana tanam dengan anggaran tertentu. Berdasarkan catatan nota pembelian, pengeluaran dirinci secara proporsional.`,
          pertanyaan: `Berdasarkan informasi di atas, berapakah nilai besaran yang diperoleh untuk menyelesaikan target tersebut?`,
          options: [
            { label: 'A', text: '18 satuan', isCorrect: false },
            { label: 'B', text: '24 satuan', isCorrect: true },
            { label: 'C', text: '28 satuan', isCorrect: false },
            { label: 'D', text: '32 satuan', isCorrect: false }
          ],
          kunci: 'B',
          pembahasan: `Langkah 1: Merumuskan model matematika dari stimulus yang ada.\nLangkah 2: Melakukan manipulasi aljabar eliminasi/substitusi untuk menemukan nilai variabel x = 24.\nLangkah 3: Memverifikasi jawaban dengan kondisi batasan masalah. Jawaban yang tepat adalah B.`,
          aspek_numerasi: `Operasi hitung terapan dan pemodelan aljabar Fase D.`
        };
      }

      setCurrentQuestion(newQ);
      setIsLoading(false);
    }, 500);
  };

  const handleCopyQuestion = () => {
    let content = `
[SOAL TKA MATEMATIKA SMP 2027]
Elemen: ${currentQuestion.elemen}
Subelemen: ${currentQuestion.subelemen}
Level Kognitif: ${currentQuestion.level_kognitif}
Bentuk Soal: ${currentQuestion.bentuk_soal}
Indikator: ${currentQuestion.indikator}

STIMULUS:
${currentQuestion.stimulus_text}
${currentQuestion.stimulus_data ? '\n' + currentQuestion.stimulus_data : ''}

PERTANYAAN:
${currentQuestion.pertanyaan}
`;

    if (currentQuestion.bentuk_soal === 'PG' && currentQuestion.options) {
      content += '\nPILIHAN JAWABAN:\n';
      currentQuestion.options.forEach(o => {
        content += `${o.label}. ${o.text}\n`;
      });
    } else if (currentQuestion.bentuk_soal === 'PG Kompleks/MCMA' && currentQuestion.complex_statements) {
      content += '\nPERNYATAAN:\n';
      currentQuestion.complex_statements.forEach((s, idx) => {
        content += `[ ] Pernyataan ${idx + 1}: ${s.statement}\n`;
      });
    } else if (currentQuestion.bentuk_soal === 'PG Kategori' && currentQuestion.category_statements) {
      content += '\nPERNYATAAN KATEGORI:\n';
      currentQuestion.category_statements.forEach((s, idx) => {
        content += `${idx + 1}. ${s.statement} (Kategori: Benar/Salah)\n`;
      });
    }

    content += `\nKUNCI JAWABAN: ${currentQuestion.kunci}\n\nPEMBAHASAN:\n${currentQuestion.pembahasan}\n\nASPEK NUMERASI: ${currentQuestion.aspek_numerasi}`;

    navigator.clipboard.writeText(content.trim());
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Fitur O · Konstruksi Butir Asesmen Terstandar</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Generator Soal TKA Matematika 2027
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Hasilkan butir soal lengkap dengan stimulus data esensial, opsi terkalibrasi, kunci jawaban, dan pembahasan matematis edukatif.
        </p>
      </div>

      {/* Selector & Generator Control */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="font-semibold text-xs text-slate-700 block mb-1">
              Pilih Indikator dari Tabel Prediksi Kisi-Kisi:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {blueprintItems.map(item => (
                <option key={item.id} value={item.id}>
                  No. {item.no} · [{item.elemen}] {item.indikator_prediktif.slice(0, 80)}... ({item.bentuk_soal})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateQuestion}
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Mengonstruksi Soal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE SOAL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {activeItem && (
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700">Spesifikasi Butir:</span>
            <span>Elemen: {activeItem.elemen}</span>
            <span>·</span>
            <span>Level: {activeItem.level_kognitif}</span>
            <span>·</span>
            <span>Bentuk: {activeItem.bentuk_soal}</span>
            <span>·</span>
            <span>Stimulus: {activeItem.stimulus}</span>
            <span>·</span>
            <span>Konteks: {activeItem.konteks}</span>
          </div>
        )}
      </div>

      {/* Question Output Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-md">
              {currentQuestion.bentuk_soal}
            </span>
            <span className="text-xs text-slate-500">
              {currentQuestion.elemen} · {currentQuestion.subelemen}
            </span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {currentQuestion.level_kognitif}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedSuccess ? 'Tersalin' : 'Salin Soal'}</span>
            </button>

            <button
              onClick={() => onValidateQuestion(currentQuestion)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validasi Soal Ini</span>
            </button>
          </div>
        </div>

        {/* 1. Stimulus Area */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Stimulus Kontekstual ({currentQuestion.stimulus_type})
            </h3>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-3">
            <p className="font-normal">{currentQuestion.stimulus_text}</p>
            {currentQuestion.stimulus_data && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] whitespace-pre-wrap text-slate-700">
                {currentQuestion.stimulus_data}
              </div>
            )}
          </div>
        </div>

        {/* 2. Pertanyaan */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pertanyaan Soal:</h3>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {currentQuestion.pertanyaan}
          </p>
        </div>

        {/* 3. Pilihan Jawaban berdasarkan Bentuk Soal */}
        <div className="space-y-2">
          {currentQuestion.bentuk_soal === 'PG' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map(opt => (
                <div
                  key={opt.label}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    showAnswer && opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {showAnswer && opt.isCorrect && (
                    <span className="text-xs text-emerald-700 font-bold">Kunci Jawaban Benar ✓</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentQuestion.bentuk_soal === 'PG Kompleks/MCMA' && currentQuestion.complex_statements && (
            <div className="space-y-2">
              <span className="text-xs text-slate-500 block mb-1 font-medium">Daftar Pernyataan:</span>
              {currentQuestion.complex_statements.map((stmt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    showAnswer
                      ? stmt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{idx + 1}. {stmt.statement}</span>
                    {showAnswer && (
                      <span className={`font-bold shrink-0 text-xs ${stmt.isCorrect ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {stmt.isCorrect ? '[BENAR]' : '[SALAH]'}
                      </span>
                    )}
                  </div>
                  {showAnswer && stmt.reason && (
                    <p className="text-[11px] text-slate-500 font-normal pl-4">
                      Alasan: {stmt.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentQuestion.bentuk_soal === 'PG Kategori' && currentQuestion.category_statements && (
            <div className="space-y-2">
              <span className="text-xs text-slate-500 block mb-1 font-medium">Tabel Klasifikasi Kategori:</span>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Pernyataan Terkait Stimulus</th>
                      <th className="py-2 px-3 text-center w-28">Kategori</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentQuestion.category_statements.map((cat, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 text-slate-800">{cat.statement}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {showAnswer ? (
                            <span className={cat.category === 'BENAR' ? 'text-emerald-600' : 'text-rose-600'}>
                              {cat.category}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">[?]</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Kunci Jawaban & Pembahasan */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <span>{showAnswer ? 'Sembunyikan Kunci & Pembahasan' : 'Tampilkan Kunci & Pembahasan Edukatif'}</span>
            <span>{showAnswer ? '▲' : '▼'}</span>
          </button>

          {showAnswer && (
            <div className="mt-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-950">Kunci Jawaban:</span>
                <span className="font-extrabold text-sm text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {currentQuestion.kunci}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-indigo-950 block">Langkah Pembahasan Matematis:</span>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed font-mono text-[11px] bg-white p-3 rounded-lg border border-indigo-100">
                  {currentQuestion.pembahasan}
                </p>
              </div>

              <div className="space-y-0.5 text-slate-600 text-[11px]">
                <span className="font-bold text-slate-700">Aspek Literasi Numerasi:</span>
                <p>{currentQuestion.aspek_numerasi}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
