import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle,
  Layers,
  ArrowRight,
  ExternalLink,
  Table,
  BadgeCheck,
  FileCheck,
  Lock,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { AssessmentItem, QuestionData, ElementType, QuestionForm, CognitiveLevel } from '../types';
import { exportManuscriptToWord, copyManuscriptTextToClipboard } from '../services/exportService';

interface ManuscriptViewProps {
  questions: QuestionData[];
  blueprintItems: AssessmentItem[];
  onValidateQuestion: (question: QuestionData) => void;
  onSelectForInfographicPrompt: (item: AssessmentItem) => void;
  isUnlocked?: boolean;
  onUnlockChange?: (unlocked: boolean) => void;
}

export const ManuscriptView: React.FC<ManuscriptViewProps> = ({
  questions,
  blueprintItems,
  onValidateQuestion,
  onSelectForInfographicPrompt,
  isUnlocked: externalUnlocked,
  onUnlockChange,
}) => {
  const [internalUnlocked, setInternalUnlocked] = useState<boolean>(false);
  const isUnlocked = externalUnlocked !== undefined ? externalUnlocked : internalUnlocked;

  const setUnlockedState = (val: boolean) => {
    setInternalUnlocked(val);
    if (onUnlockChange) {
      onUnlockChange(val);
    }
  };

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'teacher' | 'student' | 'key-table'>('teacher');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterElement, setFilterElement] = useState<string>('all');
  const [filterForm, setFilterForm] = useState<string>('all');
  const [filterCognitive, setFilterCognitive] = useState<string>('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = passwordInput.trim();
    if (cleaned.toLowerCase() === 'suwarto') {
      setUnlockedState(true);
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('Password yang dimasukkan salah. Akses dokumen naskah soal & stimulus ditolak.');
    }
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (filterElement !== 'all' && q.elemen !== filterElement) return false;
      if (filterForm !== 'all' && q.bentuk_soal !== filterForm) return false;
      if (filterCognitive !== 'all' && q.level_kognitif !== filterCognitive) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          q.pertanyaan.toLowerCase().includes(query) ||
          q.stimulus_text.toLowerCase().includes(query) ||
          q.subelemen.toLowerCase().includes(query) ||
          q.indikator.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [questions, filterElement, filterForm, filterCognitive, searchQuery]);

  const toggleSolution = (id: string) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    questions.forEach(q => {
      updated[q.id] = expand;
    });
    setExpandedSolutions(updated);
  };

  const handleExportFullWord = () => {
    exportManuscriptToWord(filteredQuestions, {
      includeAnswers: true,
      includeBlueprintInfo: true
    });
  };

  const handleExportStudentWord = () => {
    exportManuscriptToWord(filteredQuestions, {
      includeAnswers: false,
      includeBlueprintInfo: false
    });
  };

  const handleCopyManuscript = async () => {
    const ok = await copyManuscriptTextToClipboard(filteredQuestions, viewMode !== 'student');
    if (ok) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-lg mx-auto my-10">
        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-4 border border-indigo-200 shadow-2xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Dokumen Terproteksi Password</span>
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Naskah Soal &amp; Stimulus (.doc)
          </h2>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            Dokumen naskah soal lengkap, stimulus terpadu, kunci jawaban, dan unduhan berkas Word (.doc) dilindungi password khusus Guru / Penyusun Soal.
          </p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 text-left">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="relative">
              <input
                type="password"
                required
                autoComplete="off"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="Masukkan Password Akses Naskah..."
                className="w-full px-4 py-3 text-center text-sm font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Buka Proteksi Naskah Soal &amp; Stimulus</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Naskah Soal & Stimulus Terpadu</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Naskah Butir Soal TKA Matematika SMP 2027
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dihasilkan otomatis sesuai kisi-kisi prediktif ({questions.length} butir soal lengkap dengan stimulus, opsi terkalibrasi, kunci, dan pembahasan).
            </p>
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setUnlockedState(false);
                setPasswordInput('');
                setPasswordError(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors cursor-pointer"
              title="Kunci kembali menu Naskah Soal & Stimulus dengan password"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Kunci Naskah</span>
            </button>

            <button
              onClick={handleExportFullWord}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors"
              title="Unduh file naskah soal lengkap format Docs / Word (.doc) beserta kunci jawaban & pembahasan"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Naskah Docs (.doc / Word)</span>
            </button>

            <button
              onClick={handleExportStudentWord}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Unduh file lembar soal siswa format Docs / Word (.doc) siap cetak tanpa kunci"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Lembar Siswa Docs (.doc)</span>
            </button>

            <button
              onClick={handleCopyManuscript}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Salin seluruh teks naskah soal ke clipboard"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Naskah Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Naskah</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              title="Cetak langsung ke printer atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher & Filter Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Guru (Kunci & Pembahasan)
            </button>

            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'student'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Soal Siswa
            </button>

            <button
              onClick={() => setViewMode('key-table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'key-table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriks Kunci Singkat
            </button>
          </div>

          {/* Expand/Collapse All Button for Teacher Mode */}
          {viewMode === 'teacher' && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => handleExpandAll(true)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Buka Semua Pembahasan
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => handleExpandAll(false)}
                className="text-slate-500 hover:text-slate-700 font-medium"
              >
                Tutup Semua
              </button>
            </div>
          )}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari teks soal, stimulus, materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={filterElement}
              onChange={(e) => setFilterElement(e.target.value)}
              aria-label="Filter Elemen"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all">Semua Elemen</option>
              <option value="Bilangan">Bilangan</option>
              <option value="Aljabar">Aljabar</option>
              <option value="Geometri dan Pengukuran">Geometri & Pengukuran</option>
              <option value="Data dan Peluang">Data & Peluang</option>
            </select>
          </div>

          <div>
            <select
              value={filterForm}
              onChange={(e) => setFilterForm(e.target.value)}
              aria-label="Filter Bentuk Soal"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all">Semua Bentuk</option>
              <option value="PG">Pilihan Ganda (PG)</option>
              <option value="PG Kompleks/MCMA">PG Kompleks (MCMA)</option>
              <option value="PG Kategori">PG Kategori</option>
            </select>
          </div>

          <div>
            <select
              value={filterCognitive}
              onChange={(e) => setFilterCognitive(e.target.value)}
              aria-label="Filter Level Kognitif"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all">Semua Level</option>
              <option value="Memahami">Memahami (L1)</option>
              <option value="Mengaplikasikan">Mengaplikasikan (L2)</option>
              <option value="Menalar">Menalar (L3/HOTS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1 & 2: FULL QUESTIONS LIST (Teacher or Student view) */}
      {viewMode !== 'key-table' && (
        <div className="space-y-5">
          {/* Header Kop Lembar Ujian Resmi */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 text-center space-y-2 shadow-2xs">
            <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase">
              Kementerian Pendidikan Dasar dan Menengah · MGMP Matematika SMP
            </h2>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              NASKAH ASESMEN PREDIKSI TKA MATEMATIKA SMP/MTs TAHUN 2027
            </h1>
            <p className="text-xs text-slate-600">
              Jenjang: SMP/MTs · Fase D · Alokasi Waktu: 120 Menit · Jumlah Soal: {filteredQuestions.length} Butir
            </p>

            <div className="pt-2 text-left bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="font-bold block mb-1">PETUNJUK UMUM:</span>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-600">
                <li>Bacalah stimulus dan tabel/grafik secara teliti sebelum memilih atau menentukan jawaban.</li>
                <li>Pada soal Pilihan Ganda (PG), pilih 1 jawaban paling tepat (A, B, C, atau D).</li>
                <li>Pada soal Pilihan Ganda Kompleks (MCMA), pilih atau centang pernyataan-pernyataan yang bernilai BENAR.</li>
                <li>Pada soal PG Kategori, tentukan kategori BENAR atau SALAH pada tabel yang disediakan.</li>
              </ol>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
              Tidak ada butir soal yang sesuai dengan filter pencarian saat ini.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const qNum = idx + 1;
              const isSolutionOpen = Boolean(expandedSolutions[q.id]);
              const matchingBlueprint = blueprintItems.find(b => b.id === q.item_id);

              return (
                <div 
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4 transition-all"
                >
                  {/* Question Meta Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        {qNum}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{q.elemen}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs text-slate-600">{q.subelemen}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Indikator: {q.indikator}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        q.level_kognitif === 'Menalar'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : q.level_kognitif === 'Mengaplikasikan'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {q.level_kognitif}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        {q.bentuk_soal}
                      </span>

                      <button
                        onClick={() => onValidateQuestion(q)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors print:hidden"
                        title="Validasi butir soal ini terhadap 14 aspek telaah asesmen"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Validasi</span>
                      </button>

                      {matchingBlueprint && (
                        <button
                          onClick={() => onSelectForInfographicPrompt(matchingBlueprint)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors print:hidden"
                          title="Hasilkan prompt pembuatan infografis untuk stimulus soal ini"
                        >
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>Prompt Visual</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* STIMULUS KOTAK */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                      <span>Stimulus {q.stimulus_type} · Konteks: {q.konteks}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-indigo-600" />
                        <span>{q.stimulus_text.trim().split(/\s+/).filter(Boolean).length} Kata (Standar ~100 Kata)</span>
                      </span>
                    </div>

                    <p className="text-slate-800 leading-relaxed font-normal">
                      {q.stimulus_text}
                    </p>

                    {q.stimulus_data && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-snug">
                        {q.stimulus_data}
                      </div>
                    )}
                  </div>

                  {/* KALIMAT PERTANYAAN */}
                  <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug pl-1">
                    {q.pertanyaan}
                  </div>

                  {/* PILIHAN JAWABAN BERDASARKAN BENTUK SOAL */}
                  <div className="space-y-2 pt-1">
                    {/* PG Tunggal */}
                    {q.bentuk_soal === 'PG' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map(opt => (
                          <div 
                            key={opt.label}
                            className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                              viewMode === 'teacher' && opt.isCorrect
                                ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                                {opt.label}
                              </span>
                              <span>{opt.text}</span>
                            </div>
                            {viewMode === 'teacher' && opt.isCorrect && (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                                Kunci ✓
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PG Kompleks / MCMA */}
                    {q.bentuk_soal === 'PG Kompleks/MCMA' && q.complex_statements && (
                      <div className="space-y-2 text-xs">
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Pernyataan Asesmen (Centang setiap pernyataan yang BENAR):
                        </span>
                        {q.complex_statements.map((stmt, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-3 rounded-lg border space-y-1 ${
                              viewMode === 'teacher' && stmt.isCorrect
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                                  {viewMode === 'teacher' && stmt.isCorrect ? '✓' : ''}
                                </span>
                                <span>Pernyataan {sIdx + 1}: {stmt.statement}</span>
                              </div>
                              {viewMode === 'teacher' && (
                                <span className={`font-bold shrink-0 text-[10px] px-1.5 py-0.5 rounded ${
                                  stmt.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {stmt.isCorrect ? 'BENAR' : 'SALAH'}
                                </span>
                              )}
                            </div>
                            {viewMode === 'teacher' && stmt.reason && (
                              <p className="text-[11px] text-slate-500 font-normal pl-6">
                                Alasan: {stmt.reason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PG Kategori (Tabel Benar/Salah) */}
                    {q.bentuk_soal === 'PG Kategori' && q.category_statements && (
                      <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3 font-semibold">Pernyataan Berdasarkan Stimulus</th>
                              <th className="py-2 px-3 text-center w-28 font-semibold">Kategori</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {q.category_statements.map((cat, cIdx) => (
                              <tr key={cIdx} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-3 text-slate-800">{cat.statement}</td>
                                <td className="py-2.5 px-3 text-center font-bold">
                                  {viewMode === 'teacher' ? (
                                    <span className={cat.category === 'BENAR' ? 'text-emerald-700' : 'text-rose-700'}>
                                      {cat.category}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-normal">[ Benar / Salah ]</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* KUNCI & PEMBAHASAN ACCORDION (Khusus Mode Guru) */}
                  {viewMode === 'teacher' && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => toggleSolution(q.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
                      >
                        {isSolutionOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isSolutionOpen ? 'Tutup Kunci & Pembahasan' : 'Lihat Kunci & Pembahasan Lengkap'}</span>
                      </button>

                      {isSolutionOpen && (
                        <div className="mt-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2.5 text-xs text-emerald-950">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Kunci Jawaban:</span>
                            <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                              {q.kunci}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="font-bold block">Langkah Pembahasan Matematis:</span>
                            <p className="bg-white p-3 rounded-lg border border-emerald-100 font-mono text-[11px] whitespace-pre-line text-slate-800 leading-relaxed">
                              {q.pembahasan}
                            </p>
                          </div>

                          <div className="text-[11px] text-emerald-800">
                            <strong>Kemampuan Numerasi yang Diukur:</strong> {q.aspek_numerasi}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 3: MATRIKS KUNCI JAWABAN SINGKAT */}
      {viewMode === 'key-table' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Matriks Kunci Jawaban Naskah Soal TKA 2027
              </h2>
              <p className="text-xs text-slate-500">
                Rekapitulasi cepat kunci jawaban untuk seluruh {questions.length} butir instrumen.
              </p>
            </div>
            <button
              onClick={handleExportFullWord}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Word</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="py-2.5 px-3 text-center w-12">No</th>
                  <th className="py-2.5 px-3 w-28">Bentuk Soal</th>
                  <th className="py-2.5 px-4 w-40">Elemen / Subelemen</th>
                  <th className="py-2.5 px-3 text-center w-28">Level Kognitif</th>
                  <th className="py-2.5 px-4 min-w-[200px]">Kunci Jawaban Resmi</th>
                  <th className="py-2.5 px-4">Kemampuan Numerasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {questions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{q.bentuk_soal}</td>
                    <td className="py-2.5 px-4 text-slate-900 font-semibold">{q.elemen} <span className="font-normal text-slate-500 text-[11px] block">{q.subelemen}</span></td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`font-semibold ${
                        q.level_kognitif === 'Menalar' ? 'text-purple-700' : q.level_kognitif === 'Mengaplikasikan' ? 'text-emerald-700' : 'text-sky-700'
                      }`}>
                        {q.level_kognitif}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">{q.kunci}</td>
                    <td className="py-2.5 px-4 text-slate-600 text-[11px]">{q.aspek_numerasi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
