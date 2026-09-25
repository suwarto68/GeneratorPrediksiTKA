import React, { useState } from 'react';
import { 
  KeyRound, 
  User, 
  School, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Sparkles,
  Database,
  ExternalLink,
  Info
} from 'lucide-react';
import { CBTExamConfig, CBTStudent, ConnectionStatus } from '../types/cbtTypes';
import { KELAS_LIST } from '../services/cbtGoogleSheetsService';

interface CBTStudentLoginProps {
  config: CBTExamConfig;
  students: CBTStudent[];
  connectionStatus: ConnectionStatus;
  onLoginSuccess: (student: CBTStudent) => void;
  onOpenAdmin: () => void;
}

export const CBTStudentLogin: React.FC<CBTStudentLoginProps> = ({
  config,
  students,
  connectionStatus,
  onLoginSuccess,
  onOpenAdmin
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [kelas, setKelas] = useState('9A');
  const [token, setToken] = useState(config.tokenUjian || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanToken = token.trim().toUpperCase();

    // 1. Verify token if enforced
    if (config.wajibToken && config.tokenUjian) {
      if (cleanToken !== config.tokenUjian.toUpperCase()) {
        setErrorMessage('Token ujian tidak valid! Masukkan token rilis yang diberikan oleh pengawas ujian.');
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Find matching student in student list
    const found = students.find(
      s => s.username.toLowerCase() === cleanUser && s.password === cleanPass && s.kelas === kelas
    );

    if (found) {
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(found);
      }, 400);
    } else {
      // Check if username exists but password/class is wrong
      const userExists = students.find(s => s.username.toLowerCase() === cleanUser);
      if (userExists) {
        if (userExists.kelas !== kelas) {
          setErrorMessage(`Akun "${cleanUser}" terdaftar di kelas ${userExists.kelas}, bukan kelas ${kelas}. Silakan pilih kelas yang sesuai.`);
        } else {
          setErrorMessage('Password yang Anda masukkan salah. Hubungi proktor jika lupa password.');
        }
      } else {
        setErrorMessage('Username tidak ditemukan di database peserta. Pastikan Username, Password, dan Kelas sudah benar.');
      }
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoStudent: CBTStudent) => {
    setUsername(demoStudent.username);
    setPassword(demoStudent.password);
    setKelas(demoStudent.kelas);
    setToken(config.tokenUjian || 'ANBK26');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top ANBK Blue Header */}
      <header className="bg-[#0A387E] text-white shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
              <img 
                src="https://i.ibb.co/LX62Y77g/Logo-tut.jpg" 
                alt="Logo Tut Wuri Handayani / Sekolah"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if network blocked
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900 border border-blue-400 text-blue-200 tracking-wider uppercase">
                  SIMULASI RESMI CBT ANBK
                </span>
                <span className="text-xs text-blue-200 hidden sm:inline">Jenjang SMP / MTs · Fase D</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                ASESMEN STANDAR NASIONAL (TKA MATEMATIKA)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database indicator badge */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                connectionStatus.mode === 'online' 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60' 
                  : connectionStatus.mode === 'error'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
              }`}
              title={connectionStatus.message}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                connectionStatus.mode === 'online' ? 'bg-emerald-400' : connectionStatus.mode === 'error' ? 'bg-rose-400' : 'bg-amber-400'
              }`} />
              <span className="hidden md:inline">
                {connectionStatus.mode === 'online' ? 'Database Sheets Terhubung' : 'Penyimpanan Lokal'}
              </span>
            </div>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800/80 hover:bg-blue-700 text-xs font-semibold text-white border border-blue-400/40 transition-colors shadow-xs"
              title="Akses menu guru & proktor untuk melihat data pengguna, hasil ujian, dan kunci pembahasan"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Panel Proktor & Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Card Top Title Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-2 border border-white/20">
              <School className="w-6 h-6 text-amber-300" />
            </div>
            <h2 className="text-lg font-bold">KONFIRMASI DATA PESERTA</h2>
            <p className="text-xs text-blue-100 mt-1">
              Silakan login menggunakan akun yang telah dibagikan oleh proktor ruang ujian
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / NISN Peserta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: 9a01 atau NISN"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Kelas Dropdown Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kelas (Rombongan Belajar)
              </label>
              <div className="relative">
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold text-slate-800"
                >
                  {KELAS_LIST.map((kls) => (
                    <option key={kls} value={kls}>
                      Kelas {kls}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Pilih kelas sesuai dengan data absensi kelas 9
              </span>
            </div>

            {/* Token Ujian Input */}
            {config.wajibToken && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Token Ujian (Rilis Proktor)
                  </label>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Token Aktif: {config.tokenUjian || 'ANBK26'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    placeholder="Masukkan Token 6 Huruf/Angka"
                    maxLength={10}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase tracking-widest font-black text-blue-900"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1976D2] hover:bg-[#1565C0] active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memverifikasi Peserta...
                  </span>
                ) : (
                  <>
                    <span>Masuk Ujian (Mulai Tes)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Pill Helper for Instant Testing */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Uji Coba Cepat (Akun Demo Siap Pakai):</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {students.slice(0, 3).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleQuickFill(st)}
                  className="px-2 py-1.5 text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-blue-700 truncate">{st.nama.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{st.username} · {st.kelas}</div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              Semua akun demo memiliki password: <strong className="text-slate-600 font-mono">123</strong> | Token: <strong className="text-slate-600 font-mono">{config.tokenUjian || 'ANBK26'}</strong>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Info Kemdikdasmen style */}
      <footer className="bg-slate-800 text-slate-300 text-center py-3 px-4 text-xs border-t border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <div>
            © 2026/2027 Pusat Asesmen Pendidikan · Format Standar CBT ANBK - TKA SMP Fase D
          </div>
          <div className="flex items-center gap-3">
            <span>Resolusi Minimum: 1024x768</span>
            <span>·</span>
            <span className="text-amber-400 font-medium">Waktu Tes: {config.waktuMenit} Menit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
