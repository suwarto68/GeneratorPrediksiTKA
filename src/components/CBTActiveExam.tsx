import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  User, 
  LogOut, 
  Grid, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Send,
  X,
  BookOpen,
  Info,
  Layers,
  FileCheck,
  Image as ImageIcon,
  Sparkles,
  Table as TableIcon
} from 'lucide-react';
import { QuestionData } from '../types';
import { CBTExamConfig, CBTStudent, CBTStudentAnswerItem, CBTExamResult } from '../types/cbtTypes';
import { CBTInfographicGraphic } from './CBTInfographicGraphic';

interface CBTActiveExamProps {
  student: CBTStudent;
  config: CBTExamConfig;
  questions: QuestionData[];
  onFinishExam: (result: CBTExamResult) => void;
  onLogout: () => void;
}

export const CBTActiveExam: React.FC<CBTActiveExamProps> = ({
  student,
  config,
  questions,
  onFinishExam,
  onLogout
}) => {
  // If shuffle questions is enabled, memorize randomized questions for this session
  const [examQuestions] = useState<QuestionData[]>(() => {
    if (config.acakSoal) {
      // Deterministic shuffle with seed or random
      return [...questions].sort(() => Math.random() - 0.5);
    }
    return questions;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CBTStudentAnswerItem>>({});
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stimulusViewMode, setStimulusViewMode] = useState<'both' | 'graphic' | 'text' | 'data'>('both');

  // Timer states (in seconds)
  const initialSeconds = (config.waktuMenit || 80) * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const startTimeRef = useRef(new Date());

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQ = examQuestions[currentIndex] || examQuestions[0];
  const currentAnswer = answers[currentQ?.id] || {
    questionId: currentQ?.id || '',
    questionNo: currentIndex + 1,
    bentukSoal: currentQ?.bentuk_soal || 'PG',
    isDoubt: false,
    isAnswered: false
  };

  // Helper to update current answer
  const updateCurrentAnswer = (patch: Partial<CBTStudentAnswerItem>) => {
    if (!currentQ) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...currentAnswer,
        ...patch,
        questionId: currentQ.id,
        questionNo: currentIndex + 1,
        bentukSoal: currentQ.bentuk_soal
      }
    }));
  };

  // Form handlers
  const handleSelectOptionPG = (label: string) => {
    updateCurrentAnswer({
      selectedOption: label,
      isAnswered: true
    });
  };

  const handleToggleComplexOption = (index: number) => {
    const selected = currentAnswer.selectedComplexOptions || [];
    let updated: number[];
    if (selected.includes(index)) {
      updated = selected.filter(i => i !== index);
    } else {
      updated = [...selected, index];
    }
    updateCurrentAnswer({
      selectedComplexOptions: updated,
      isAnswered: updated.length > 0
    });
  };

  const handleSetCategoryAnswer = (index: number, val: 'BENAR' | 'SALAH') => {
    const currentCats = currentAnswer.categoryAnswers || {};
    const updated = { ...currentCats, [index]: val };
    const totalStatements = currentQ.category_statements?.length || 1;
    const isFullyAnswered = Object.keys(updated).length >= totalStatements;
    updateCurrentAnswer({
      categoryAnswers: updated,
      isAnswered: isFullyAnswered
    });
  };

  const handleToggleDoubt = () => {
    updateCurrentAnswer({
      isDoubt: !currentAnswer.isDoubt
    });
  };

  // Formatting timer
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Calculate statistics
  const totalQuestions = examQuestions.length;
  const answeredCount = Object.values(answers).filter(a => a.isAnswered).length;
  const doubtCount = Object.values(answers).filter(a => a.isDoubt).length;
  const unAnsweredCount = totalQuestions - answeredCount;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Scoring algorithm
  const evaluateResults = (): CBTExamResult => {
    let correctCount = 0;
    const detailList: string[] = [];

    examQuestions.forEach((q, idx) => {
      const ans = answers[q.id];
      const no = idx + 1;
      let isItemCorrect = false;

      if (!ans || !ans.isAnswered) {
        detailList.push(`No.${no}: Kosong (Kunci: ${q.kunci})`);
        return;
      }

      if (q.bentuk_soal === 'PG') {
        const studentChoice = ans.selectedOption;
        const correctChoice = q.options?.find(o => o.isCorrect)?.label || q.kunci;
        if (studentChoice === correctChoice) {
          isItemCorrect = true;
          correctCount++;
        }
        detailList.push(`No.${no} [PG]: Jawab=${studentChoice || '-'}, Kunci=${correctChoice} (${isItemCorrect ? 'BENAR' : 'SALAH'})`);
      } else if (q.bentuk_soal === 'PG Kompleks/MCMA') {
        const correctIndices: number[] = [];
        q.complex_statements?.forEach((st, i) => {
          if (st.isCorrect) correctIndices.push(i);
        });
        const studentIndices = (ans.selectedComplexOptions || []).sort();
        const matches = (
          studentIndices.length === correctIndices.length &&
          studentIndices.every((val, i) => val === correctIndices[i])
        );
        if (matches) {
          isItemCorrect = true;
          correctCount++;
        }
        detailList.push(`No.${no} [PGK]: Jawab=[${studentIndices.map(i => i + 1).join(',')}], Kunci=[${correctIndices.map(i => i + 1).join(',')}] (${matches ? 'BENAR' : 'SALAH'})`);
      } else if (q.bentuk_soal === 'PG Kategori') {
        const cats = q.category_statements || [];
        let allRowCorrect = true;
        cats.forEach((st, i) => {
          const userVal = ans.categoryAnswers?.[i];
          const expected = (st.category || '').toUpperCase().trim();
          if (userVal !== expected) {
            allRowCorrect = false;
          }
        });
        if (allRowCorrect && cats.length > 0) {
          isItemCorrect = true;
          correctCount++;
        }
        detailList.push(`No.${no} [Kategori]: (${allRowCorrect ? 'BENAR' : 'SALAH'})`);
      }
    });

    const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const endTime = new Date();
    const durationSeconds = Math.round((endTime.getTime() - startTimeRef.current.getTime()) / 1000);
    const durationMin = Math.floor(durationSeconds / 60);
    const durationSec = durationSeconds % 60;

    return {
      id: `RES-${Date.now()}-${student.username}`,
      kodePeserta: student.kodePeserta,
      username: student.username,
      nama: student.nama,
      kelas: student.kelas,
      token: student.token || config.tokenUjian || 'ANBK26',
      waktuMulai: startTimeRef.current.toLocaleTimeString('id-ID'),
      waktuSelesai: endTime.toLocaleTimeString('id-ID'),
      durasiPengerjaan: `${durationMin} Menit ${durationSec} Detik`,
      totalSoal: totalQuestions,
      jumlahBenar: correctCount,
      jumlahSalah: totalQuestions - correctCount,
      jumlahKosong: unAnsweredCount,
      jumlahRagu: doubtCount,
      skorAkhir: finalScore,
      detailJawabanText: detailList.join(' | '),
      answersMap: answers,
      statusSync: 'Tersimpan Lokal',
      timestamp: endTime.toISOString()
    };
  };

  const handleTimeExpired = () => {
    const result = evaluateResults();
    alert('Waktu ujian telah habis! Sistem secara otomatis mengumpulkan lembar jawaban Anda.');
    onFinishExam(result);
  };

  const handleFinishConfirm = () => {
    setShowFinishConfirm(false);
    const result = evaluateResults();
    onFinishExam(result);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans">
      {/* 1. ANBK Authentic Blue Top Bar */}
      <header className="bg-[#0A387E] text-white shadow-md border-b-4 border-amber-400 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
              <img 
                src="https://i.ibb.co/LX62Y77g/Logo-tut.jpg" 
                alt="Logo Tut Wuri"
                className="w-full h-full object-contain"
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
                <span>CBT ANBK · {config.mataPelajaran}</span>
              </div>
              <div className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>{student.nama}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900 border border-blue-400 text-blue-200">
                  {student.kelas}
                </span>
              </div>
              <div className="text-[10px] text-blue-200 font-mono hidden sm:block">
                No. Peserta: {student.kodePeserta} · User: {student.username}
              </div>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Timer Box */}
            <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border flex items-center gap-2 shadow-inner ${
              timeLeft < 600 
                ? 'bg-rose-900/90 border-rose-400 text-white animate-pulse' 
                : 'bg-blue-950/80 border-blue-400/60 text-white'
            }`}>
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold text-blue-200 tracking-wider">Sisa Waktu</div>
                <div className="text-sm sm:text-lg font-black font-mono tracking-widest leading-none">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Daftar Soal Button */}
            <button
              onClick={() => setShowQuestionGrid(true)}
              className="px-3 py-2 sm:px-3.5 sm:py-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold rounded-xl border border-blue-400/40 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lihat seluruh nomor soal"
            >
              <Grid className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-blue-950 font-mono">
                {answeredCount}/{totalQuestions}
              </span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-blue-900 hover:bg-blue-800 text-blue-200 hover:text-white rounded-lg border border-blue-700 transition-colors hidden sm:block"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Logout button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 sm:px-2.5 sm:py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg border border-rose-500 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              title="Keluar dari akun ujian"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Ribbon */}
        <div className="w-full bg-blue-950 h-1.5 overflow-hidden">
          <div 
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. Main Exam Body: Two-Panel Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        {/* Info Strip Above Question */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-2.5 sm:p-3 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#0A387E] text-white font-black text-sm tracking-wide">
              SOAL NO. {currentIndex + 1}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentQ?.elemen}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200 hidden sm:inline">
              Konteks: {currentQ?.konteks}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Bentuk Soal:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              currentQ?.bentuk_soal === 'PG' 
                ? 'bg-blue-100 text-blue-800' 
                : currentQ?.bentuk_soal === 'PG Kompleks/MCMA'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {currentQ?.bentuk_soal === 'PG' ? 'Pilihan Ganda' : currentQ?.bentuk_soal === 'PG Kompleks/MCMA' ? 'Pilihan Ganda Kompleks' : 'Betul / Benar - Salah'}
            </span>
            {currentAnswer.isDoubt && (
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-900 font-bold text-[11px] animate-pulse">
                Ragu-ragu
              </span>
            )}
          </div>
        </div>

        {/* 2-Panel Content Card */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden min-h-[520px]">
          {/* LEFT PANEL: Stimulus Teks, Gambar Infografis, Tabel, & Data (col 7) */}
          <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto max-h-[75vh] space-y-4">
            {/* Stimulus Header & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Stimulus Asesmen: {currentQ?.subelemen}</span>
              </div>

              {/* View Mode Toggle Buttons */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setStimulusViewMode('both')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    stimulusViewMode === 'both'
                      ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilkan Infografis Gambar & Teks Bersama"
                >
                  Lengkap
                </button>
                <button
                  type="button"
                  onClick={() => setStimulusViewMode('graphic')}
                  className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    stimulusViewMode === 'graphic'
                      ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Fokus Gambar Infografis"
                >
                  <ImageIcon className="w-3 h-3 text-blue-600" />
                  <span>Gambar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStimulusViewMode('text')}
                  className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    stimulusViewMode === 'text'
                      ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Fokus Narasi Teks Stimulus"
                >
                  <span>Teks</span>
                </button>
                {currentQ?.stimulus_data && (
                  <button
                    type="button"
                    onClick={() => setStimulusViewMode('data')}
                    className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                      stimulusViewMode === 'data'
                        ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Tabel & Data Terukur"
                  >
                    <TableIcon className="w-3 h-3 text-emerald-600" />
                    <span>Data</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. VISUAL INFOGRAPHIC GRAPHIC (Matches 'Menu Prompt Infografis') */}
            {(stimulusViewMode === 'both' || stimulusViewMode === 'graphic') && currentQ && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <CBTInfographicGraphic question={currentQ} aspectRatio="16:9" />
              </div>
            )}

            {/* 2. STIMULUS NARRATION TEXT (~100 Words Standard) */}
            {(stimulusViewMode === 'both' || stimulusViewMode === 'text') && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-slate-800 space-y-3 font-serif animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {currentQ?.stimulus_type}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      Konteks: {currentQ?.konteks}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {currentQ?.stimulus_text.trim().split(/\s+/).filter(Boolean).length} Kata (Standar Asesmen ✓)
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-justify text-slate-800 font-sans">
                  {currentQ?.stimulus_text}
                </p>
              </div>
            )}

            {/* 3. STRUCTURED DATA / VISUAL SUPPORT */}
            {(stimulusViewMode === 'both' || stimulusViewMode === 'data') && currentQ?.stimulus_data && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-700" />
                    <span>Representasi Data Terukur & Parameter Asesmen</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-normal">
                    Lampiran Resmi
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-lg border border-blue-100 shadow-2xs">
                  {currentQ.stimulus_data}
                </div>
              </div>
            )}

            {/* Bottom Metadata Ribbon */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-100">
              <span className="font-medium text-slate-600">
                Indikator Asesmen: <strong className="text-slate-800">{currentQ?.indikator}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  {currentQ?.level_kognitif}
                </span>
                <span className="font-bold text-indigo-700">Fase D · SMP</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Pertanyaan & Opsi Jawaban (col 5) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-50/50 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
            <div className="space-y-4">
              {/* Question Statement Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Pertanyaan:
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {currentQ?.pertanyaan}
                </h3>
              </div>

              {/* RENDER BY QUESTION TYPE */}
              {/* 1. Tipe PILIHAN GANDA (PG) */}
              {currentQ?.bentuk_soal === 'PG' && currentQ.options && (
                <div className="space-y-2.5">
                  <div className="text-xs text-slate-500 font-semibold mb-1">
                    Pilihlah salah satu jawaban yang paling tepat:
                  </div>
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAnswer.selectedOption === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelectOptionPG(opt.label)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-600 shadow-sm text-blue-950' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {opt.label}
                        </span>
                        <div className="flex-1 text-sm font-medium pt-0.5 leading-relaxed">
                          {opt.text}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. Tipe PILIHAN GANDA KOMPLEKS (MCMA) */}
              {currentQ?.bentuk_soal === 'PG Kompleks/MCMA' && currentQ.complex_statements && (
                <div className="space-y-2.5">
                  <div className="text-xs text-purple-700 font-bold bg-purple-50 p-2 rounded-lg border border-purple-200">
                    Petunjuk: Anda dapat memilih lebih dari satu pernyataan yang bernilai BENAR dengan mencentang kotak.
                  </div>
                  {currentQ.complex_statements.map((stmt, idx) => {
                    const isChecked = (currentAnswer.selectedComplexOptions || []).includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleComplexOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                          isChecked 
                            ? 'bg-purple-50 border-purple-600 shadow-sm text-purple-950' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border-2 transition-colors ${
                          isChecked 
                            ? 'bg-purple-600 border-purple-600 text-white' 
                            : 'bg-white border-slate-300'
                        }`}>
                          {isChecked && '✓'}
                        </div>
                        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                          {stmt.statement}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. Tipe BETUL / BENAR - SALAH (PG KATEGORI) */}
              {currentQ?.bentuk_soal === 'PG Kategori' && currentQ.category_statements && (
                <div className="space-y-2.5">
                  <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Petunjuk: Tentukan kategori BENAR atau SALAH untuk setiap baris pernyataan di bawah ini.
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3 text-left">Pernyataan Evaluasi</th>
                          <th className="p-3 text-center w-20">BENAR</th>
                          <th className="p-3 text-center w-20">SALAH</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentQ.category_statements.map((stmt, idx) => {
                          const userChoice = currentAnswer.categoryAnswers?.[idx];
                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-slate-800 font-medium leading-relaxed">
                                {stmt.statement}
                              </td>
                              <td className="p-3 text-center bg-emerald-50/30">
                                <label className="inline-flex items-center justify-center w-full cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`cat-${idx}`}
                                    checked={userChoice === 'BENAR'}
                                    onChange={() => handleSetCategoryAnswer(idx, 'BENAR')}
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                  />
                                </label>
                              </td>
                              <td className="p-3 text-center bg-rose-50/30">
                                <label className="inline-flex items-center justify-center w-full cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`cat-${idx}`}
                                    checked={userChoice === 'SALAH'}
                                    onChange={() => handleSetCategoryAnswer(idx, 'SALAH')}
                                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                  />
                                </label>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Answer Status Feedback */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Status: {currentAnswer.isAnswered ? '✅ Sudah Terjawab' : '⚪ Belum Dijawab'}</span>
              <span>{currentAnswer.isDoubt ? '⚠️ Ditandai Ragu' : ''}</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom ANBK Navigation Bar (Authentic Red, Yellow, Blue Buttons) */}
      <footer className="bg-white border-t-2 border-slate-200 px-4 py-3 shadow-lg sticky bottom-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* TOMBOL MERAH: Soal Sebelumnya */}
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>« Soal Sebelumnya</span>
          </button>

          {/* TOMBOL KUNING: Ragu-Ragu */}
          <button
            type="button"
            onClick={handleToggleDoubt}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all uppercase tracking-wider border cursor-pointer ${
              currentAnswer.isDoubt 
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-300' 
                : 'bg-[#F9A825] hover:bg-[#F57F17] text-slate-900 border-amber-500'
            }`}
          >
            <input 
              type="checkbox" 
              readOnly 
              checked={currentAnswer.isDoubt} 
              className="w-4 h-4 rounded text-slate-900 focus:ring-amber-500 pointer-events-none"
            />
            <span>Ragu-Ragu</span>
          </button>

          {/* TOMBOL BIRU / HIJAU: Soal Berikutnya / Selesai Ujian */}
          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 bg-[#1976D2] hover:bg-[#1565C0] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>Soal Berikutnya »</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowFinishConfirm(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer animate-bounce"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai & Kumpulkan</span>
            </button>
          )}
        </div>
      </footer>

      {/* 4. Modal Daftar Soal (ANBK Grid Drawer) */}
      {showQuestionGrid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#0A387E] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase tracking-wider">NAVIGASI DAFTAR SOAL</h3>
              </div>
              <button
                onClick={() => setShowQuestionGrid(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-emerald-600 border border-emerald-700" />
                  <span className="text-slate-700">Sudah Dijawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-400 border border-amber-600" />
                  <span className="text-slate-700">Ragu-Ragu ({doubtCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-white border border-slate-300" />
                  <span className="text-slate-700">Belum ({unAnsweredCount})</span>
                </div>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-1">
                {examQuestions.map((q, idx) => {
                  const ans = answers[q.id];
                  const isCurrent = idx === currentIndex;
                  const isAns = ans?.isAnswered;
                  const isRagu = ans?.isDoubt;

                  let btnStyle = 'bg-white text-slate-800 border-slate-300 hover:border-blue-500';
                  if (isRagu) {
                    btnStyle = 'bg-amber-400 text-slate-950 border-amber-600 font-black';
                  } else if (isAns) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowQuestionGrid(false);
                      }}
                      className={`h-11 rounded-xl text-xs sm:text-sm border-2 transition-all flex flex-col items-center justify-center relative cursor-pointer ${btnStyle} ${
                        isCurrent ? 'ring-3 ring-blue-500 scale-105' : ''
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {ans?.selectedOption && (
                        <span className="text-[10px] opacity-90 font-mono">[{ans.selectedOption}]</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowQuestionGrid(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionGrid(false);
                    setShowFinishConfirm(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Selesaikan Ujian Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Konfirmasi Selesai Ujian */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-amber-500 text-slate-950 px-5 py-4 flex items-center gap-2.5 font-black">
              <AlertTriangle className="w-5 h-5 text-slate-950" />
              <span>KONFIRMASI PENYELESAIAN UJIAN</span>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-800 leading-relaxed">
                Apakah Anda yakin ingin menyelesaikan ujian ini? Pastikan seluruh butir soal telah dijawab dan diperiksa kembali.
              </p>

              {/* Status Recap */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-600">Total Soal:</span>
                  <span className="font-bold text-slate-900">{totalQuestions} Soal</span>
                </div>
                <div className="flex justify-between font-medium text-emerald-700">
                  <span>Sudah Terjawab:</span>
                  <span className="font-bold">{answeredCount} Soal</span>
                </div>
                {doubtCount > 0 && (
                  <div className="flex justify-between font-medium text-amber-700">
                    <span>Masih Ragu-Ragu:</span>
                    <span className="font-bold">{doubtCount} Soal</span>
                  </div>
                )}
                {unAnsweredCount > 0 && (
                  <div className="flex justify-between font-medium text-rose-700">
                    <span>Belum Dijawab:</span>
                    <span className="font-bold">{unAnsweredCount} Soal</span>
                  </div>
                )}
              </div>

              {unAnsweredCount > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                  Perhatian: Anda masih memiliki {unAnsweredCount} nomor yang belum dijawab. Jawaban kosong bernilai 0.
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFinishConfirm(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Kembali ke Soal
                </button>
                <button
                  type="button"
                  onClick={handleFinishConfirm}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Ya, Kumpulkan Jawaban
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center gap-2 font-bold text-sm">
              <LogOut className="w-4 h-4" />
              <span>KELUAR DARI UJIAN</span>
            </div>
            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p>
                Apakah Anda ingin keluar dari sesi ujian peserta <strong className="text-slate-900">{student.nama}</strong>?
                Jawaban yang telah Anda klik akan tersimpan di sesi browser ini.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
