import React from 'react';
import { 
  CheckCircle, 
  Award, 
  Clock, 
  User, 
  School, 
  Database, 
  FileCheck, 
  RotateCcw, 
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CBTExamConfig, CBTExamResult } from '../types/cbtTypes';

interface CBTStudentResultProps {
  result: CBTExamResult;
  config: CBTExamConfig;
  onReturnToLogin: () => void;
}

export const CBTStudentResult: React.FC<CBTStudentResultProps> = ({
  result,
  config,
  onReturnToLogin
}) => {
  const isPassed = result.skorAkhir >= 75;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="bg-[#0A387E] text-white shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center">
              <img 
                src="https://i.ibb.co/LX62Y77g/Logo-tut.jpg" 
                alt="Logo Tut Wuri"
                className="w-full h-full object-contain"
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                TRY OUT CBT ANBK - TKA SMP
              </div>
              <h1 className="text-base font-black text-white">HASIL & KONFIRMASI PENYELESAIAN UJIAN</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Result Card */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 my-4 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Card Status */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 sm:p-8 text-white text-center">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs mb-3 border border-white/20">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">UJIAN TELAH SELESAI</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-md mx-auto">
              Terima kasih telah menyelesaikan seluruh rangkaian butir soal Try Out Asesmen Standar Nasional
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Student Info Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Peserta</span>
                <span className="font-bold text-slate-800 text-sm">{result.nama}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelas</span>
                <span className="font-bold text-blue-700 text-sm">{result.kelas}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">No. Peserta</span>
                <span className="font-mono text-slate-700 text-xs">{result.kodePeserta}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Durasi Pengerjaan</span>
                <span className="font-bold text-slate-800 text-xs">{result.durasiPengerjaan}</span>
              </div>
            </div>

            {/* Score & Analytics */}
            {config.tampilkanHasilSiswa && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200/80 rounded-2xl p-6 text-center">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                  Skor Perolehan Akhir
                </div>
                <div className="text-5xl font-black text-indigo-700 font-mono tracking-tight my-2">
                  {result.skorAkhir}
                  <span className="text-2xl font-semibold text-indigo-400"> / 100</span>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  {isPassed ? (
                    <span className="text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                      ★ Tuntas Memenuhi Batas Ketercapaian Kompetensi (Fase D)
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                      Perlu Penguatan Literasi Numerasi
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-blue-200/60 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Jawaban Benar</span>
                    <span className="font-black text-emerald-600 text-base">{result.jumlahBenar} Soal</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Jawaban Salah</span>
                    <span className="font-black text-rose-600 text-base">{result.jumlahSalah} Soal</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Total Soal</span>
                    <span className="font-black text-slate-800 text-base">{result.totalSoal} Soal</span>
                  </div>
                </div>
              </div>
            )}

            {/* Google Sheets Sync Indicator Banner */}
            <div className="p-4 rounded-2xl border flex items-start gap-3 bg-emerald-50 border-emerald-200 text-emerald-900 text-xs">
              <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>Penyimpanan Database Terverifikasi</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-800 font-bold">
                    {result.statusSync}
                  </span>
                </div>
                <p className="text-emerald-800 leading-relaxed font-normal">
                  {result.syncMessage || 'Lembar jawaban dan rekaman waktu Anda telah otomatis dikirimkan ke server proktor serta Google Spreadsheet (Sheet: JawabanUjian).'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Bukti Selesai Ujian</span>
              </button>

              <button
                type="button"
                onClick={onReturnToLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A387E] hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Selesai & Keluar ke Halaman Awal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        © 2026/2027 Proktor CBT ANBK - TKA SMP Fase D
      </footer>
    </div>
  );
};
