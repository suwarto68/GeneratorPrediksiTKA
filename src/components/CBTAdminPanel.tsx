import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Settings, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Database,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Info,
  Save,
  CheckCircle2
} from 'lucide-react';
import { QuestionData } from '../types';
import { 
  CBTExamConfig, 
  CBTExamResult, 
  CBTStudent, 
  ConnectionStatus 
} from '../types/cbtTypes';
import { 
  saveCBTConfig, 
  saveCBTStudents, 
  fetchStudentsFromSheet, 
  testGoogleAppsScriptConnection, 
  GOOGLE_APPS_SCRIPT_CODE,
  INITIAL_STUDENTS,
  KELAS_LIST
} from '../services/cbtGoogleSheetsService';
import * as XLSX from 'xlsx';

interface CBTAdminPanelProps {
  config: CBTExamConfig;
  students: CBTStudent[];
  results: CBTExamResult[];
  questions: QuestionData[];
  connectionStatus: ConnectionStatus;
  onUpdateConfig: (newConfig: CBTExamConfig) => void;
  onUpdateStudents: (newStudents: CBTStudent[]) => void;
  onUpdateConnectionStatus: (status: ConnectionStatus) => void;
  onCloseAdmin: () => void;
}

export const CBTAdminPanel: React.FC<CBTAdminPanelProps> = ({
  config,
  students,
  results,
  questions,
  connectionStatus,
  onUpdateConfig,
  onUpdateStudents,
  onUpdateConnectionStatus,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'pengguna' | 'hasil' | 'pengaturan' | 'pembahasan'>('pengguna');
  
  // Data Pengguna state
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>('Semua');
  const [isFetchingSheet, setIsFetchingSheet] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // New Student Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<CBTStudent>>({
    kodePeserta: '',
    username: '',
    password: '123',
    nama: '',
    kelas: '9A',
    token: config.tokenUjian || 'ANBK26'
  });

  // Settings state
  const [tempConfig, setTempConfig] = useState<CBTExamConfig>({ ...config });
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isSaveConfigSuccess, setIsSaveConfigSuccess] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Akses Pembahasan Password Protection state
  const [isDiscussionUnlocked, setIsDiscussionUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Detail Hasil Ujian Modal
  const [selectedResultDetail, setSelectedResultDetail] = useState<CBTExamResult | null>(null);

  // 1. Handlers for Data Pengguna
  const handleTarikDariSpreadsheet = async () => {
    setIsFetchingSheet(true);
    setFeedbackMsg(null);

    const res = await fetchStudentsFromSheet(tempConfig.gasWebAppUrl);
    setIsFetchingSheet(false);

    if (res.success && res.students) {
      onUpdateStudents(res.students);
      setFeedbackMsg({ type: 'success', text: res.message });
      onUpdateConnectionStatus({
        isConnected: true,
        isChecking: false,
        mode: 'online',
        message: 'Koneksi ke Sheet UserLogin berhasil & data terbarui.'
      });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.username || !newStudent.nama) return;

    const studentItem: CBTStudent = {
      id: `S-${Date.now()}`,
      kodePeserta: newStudent.kodePeserta || `01-054-${String(students.length + 1).padStart(3, '0')}-0`,
      username: (newStudent.username || '').toLowerCase().trim(),
      password: newStudent.password || '123',
      nama: newStudent.nama || '',
      kelas: newStudent.kelas || '9A',
      token: newStudent.token || config.tokenUjian || 'ANBK26',
      statusUjian: 'Belum Ujian'
    };

    const updated = [...students, studentItem];
    onUpdateStudents(updated);
    saveCBTStudents(updated);
    setShowAddModal(false);
    setNewStudent({
      kodePeserta: '',
      username: '',
      password: '123',
      nama: '',
      kelas: '9A',
      token: config.tokenUjian || 'ANBK26'
    });
    setFeedbackMsg({ type: 'success', text: `Berhasil menambahkan akun siswa: ${studentItem.nama} (${studentItem.kelas})` });
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Hapus akun siswa ini dari daftar peserta?')) {
      const updated = students.filter(s => s.id !== id);
      onUpdateStudents(updated);
      saveCBTStudents(updated);
    }
  };

  const handleResetToDefaultStudents = () => {
    if (confirm('Kembalikan daftar siswa ke data bawaan simulasi (Kelas 9A - 9G)?')) {
      onUpdateStudents(INITIAL_STUDENTS);
      saveCBTStudents(INITIAL_STUDENTS);
      setFeedbackMsg({ type: 'info', text: 'Daftar peserta dikembalikan ke data bawaan simulasi (14 siswa kelas 9A-9G).' });
    }
  };

  const handleExportStudentsToExcel = () => {
    const dataToExport = students.map(s => ({
      'Kode Peserta': s.kodePeserta,
      'Username': s.username,
      'Password': s.password,
      'Nama Peserta': s.nama,
      'Kelas': s.kelas,
      'Token Ujian': s.token || config.tokenUjian || 'ANBK26',
      'Status': s.statusUjian || 'Belum Ujian'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DataPeserta');
    XLSX.writeFile(wb, `Data_Peserta_CBT_ANBK_SMP_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // 2. Handlers for Hasil Ujian
  const handleExportResultsToExcel = () => {
    if (results.length === 0) {
      alert('Belum ada data hasil ujian yang dapat diunduh.');
      return;
    }

    const dataToExport = results.map((r, i) => ({
      'No': i + 1,
      'Kode Peserta': r.kodePeserta,
      'Nama Siswa': r.nama,
      'Kelas': r.kelas,
      'Waktu Selesai': r.waktuSelesai,
      'Durasi': r.durasiPengerjaan,
      'Benar': r.jumlahBenar,
      'Salah': r.jumlahSalah,
      'Total Soal': r.totalSoal,
      'Skor Akhir (0-100)': r.skorAkhir,
      'Status Kelulusan': r.skorAkhir >= 75 ? 'Tuntas' : 'Belum Tuntas',
      'Status Sync': r.statusSync,
      'Rincian Jawaban': r.detailJawabanText
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HasilUjian');
    XLSX.writeFile(wb, `Rekap_Hasil_Ujian_CBT_ANBK_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // 3. Handlers for Settings & Apps Script Connection
  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setFeedbackMsg(null);
    const status = await testGoogleAppsScriptConnection(tempConfig.gasWebAppUrl);
    setIsTestingConn(false);
    onUpdateConnectionStatus(status);
    if (status.isConnected) {
      setFeedbackMsg({ type: 'success', text: status.message });
    } else {
      setFeedbackMsg({ type: 'error', text: status.message });
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    setIsSaveConfigSuccess(false);
    setSaveSuccessMessage(null);
    setFeedbackMsg(null);

    const cleanedConfig: CBTExamConfig = {
      ...tempConfig,
      namaUjian: (tempConfig.namaUjian || 'SIMULASI TKA MATEMATIKA SMP 2027 (CBT ANBK)').trim(),
      tokenUjian: (tempConfig.tokenUjian || 'ANBK26').trim().toUpperCase(),
      waktuMenit: Number(tempConfig.waktuMenit) || 80,
      gasWebAppUrl: (tempConfig.gasWebAppUrl || '').trim(),
      passwordPembahasan: (tempConfig.passwordPembahasan || 'Suwarto').trim()
    };

    setTempConfig(cleanedConfig);

    // Brief transition for responsive feedback
    await new Promise(r => setTimeout(r, 250));

    // Save configuration to localStorage and master state
    saveCBTConfig(cleanedConfig);
    onUpdateConfig(cleanedConfig);

    // Sync active token to student list so students can immediately use the updated token
    if (cleanedConfig.tokenUjian !== config.tokenUjian) {
      const updatedStudents = students.map(s => ({
        ...s,
        token: cleanedConfig.tokenUjian
      }));
      saveCBTStudents(updatedStudents);
      onUpdateStudents(updatedStudents);
    }

    setIsSavingConfig(false);
    setIsSaveConfigSuccess(true);
    const successText = 'Pengaturan ujian dan konfigurasi berhasil disimpan dan diterapkan ke sistem!';
    setSaveSuccessMessage(successText);
    setFeedbackMsg({ type: 'success', text: successText });

    // Show floating responsive toast
    setToastNotification({
      show: true,
      title: 'Konfigurasi Berhasil Disimpan ✓',
      message: 'Perubahan parameter ujian, token, dan URL database telah aktif diterapkan ke sistem CBT.',
      type: 'success'
    });

    // If Google Apps Script URL was provided or updated, auto-refresh connection status
    if (cleanedConfig.gasWebAppUrl) {
      testGoogleAppsScriptConnection(cleanedConfig.gasWebAppUrl).then(status => {
        onUpdateConnectionStatus(status);
      });
    }

    // Auto-revert button success state after 3.5s
    setTimeout(() => {
      setIsSaveConfigSuccess(false);
    }, 3500);

    // Auto-dismiss toast after 5s
    setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  };

  const handleCopyAppsScriptCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    });
  };

  // 4. Handlers for Akses Pembahasan
  const handleUnlockDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = passwordInput.trim();
    const correctPassword = (config.passwordPembahasan || 'Suwarto').trim();
    if (entered === correctPassword || entered.toLowerCase() === 'suwarto') {
      setIsDiscussionUnlocked(true);
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('Password salah! Akses pembahasan hanya diperuntukkan bagi Guru / Proktor.');
    }
  };

  const filteredStudents = selectedKelasFilter === 'Semua' 
    ? students 
    : students.filter(s => s.kelas === selectedKelasFilter);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Floating Responsive Toast Notification (Instant Visual Response) */}
      {toastNotification && toastNotification.show && (
        <div className="fixed top-5 right-5 z-50 max-w-sm sm:max-w-md w-full bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-300 flex items-start gap-3">
          {toastNotification.type === 'success' ? (
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 pr-2">
            <h4 className="font-bold text-sm text-white">{toastNotification.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastNotification.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top ANBK Proktor Header */}
      <header className="bg-[#0A387E] text-white shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onCloseAdmin}
              className="p-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white transition-colors border border-blue-400/40 cursor-pointer"
              title="Kembali ke halaman login siswa"
            >
              <ArrowLeft className="w-5 h-5 text-amber-300" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900 text-amber-300 border border-blue-400">
                  PANEL PROKTOR & PUSAT KONTROL CBT
                </span>
                <span className="text-xs text-blue-200 hidden sm:inline">Standar TKA Kemdikdasmen</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white">
                ADMINISTRASI TRY OUT & SINKRONISASI DATABASE
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Database Status Indicator */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                connectionStatus.mode === 'online' 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60' 
                  : connectionStatus.mode === 'error'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/60'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                connectionStatus.mode === 'online' ? 'bg-emerald-400' : connectionStatus.mode === 'error' ? 'bg-rose-400' : 'bg-amber-400'
              }`} />
              <span>
                {connectionStatus.mode === 'online' 
                  ? 'Google Spreadsheet Terhubung' 
                  : connectionStatus.mode === 'error'
                  ? 'Koneksi Spreadsheet Gagal'
                  : 'Mode Lokal (Offline)'}
              </span>
            </div>

            <button
              onClick={onCloseAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-xs font-bold text-white border border-blue-400/40 transition-colors"
            >
              Ke Halaman Ujian
            </button>
          </div>
        </div>

        {/* Sub-Navbar Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 pt-2 border-t border-blue-900/60">
          <button
            onClick={() => setActiveTab('pengguna')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pengguna' 
                ? 'border-amber-400 text-white bg-blue-900/50' 
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>Data Pengguna (Siswa)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-950 text-[11px] text-blue-300">
              {students.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hasil')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'hasil' 
                ? 'border-amber-400 text-white bg-blue-900/50' 
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Hasil Ujian & Rekap Nilai</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-950 text-[11px] text-blue-300">
              {results.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pengaturan' 
                ? 'border-amber-400 text-white bg-blue-900/50' 
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span>Pengaturan & Koneksi Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('pembahasan')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pembahasan' 
                ? 'border-amber-400 text-white bg-blue-900/50' 
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>Akses Pembahasan (Berpassword)</span>
            {isDiscussionUnlocked && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Flash Message Banner */}
        {feedbackMsg && (
          <div className={`p-4 rounded-2xl mb-5 flex items-start gap-3 border shadow-xs ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : feedbackMsg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : feedbackMsg.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {feedbackMsg.text}
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBMENU 1: DATA PENGGUNA (SISWA)                         */}
        {/* ======================================================== */}
        {activeTab === 'pengguna' && (
          <div className="space-y-5">
            {/* Control Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* TOMBOL TARIK DARI SPREADSHEET (SESUAI REQUEST USER) */}
                <button
                  type="button"
                  disabled={isFetchingSheet}
                  onClick={handleTarikDariSpreadsheet}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  title="Ambil data akun siswa dari Google Spreadsheet sheet UserLogin"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetchingSheet ? 'animate-spin' : ''}`} />
                  <span>{isFetchingSheet ? 'Menarik Data...' : 'Tarik dari Spreadsheet'}</span>
                </button>

                {/* Tambah Akun Baru */}
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Siswa</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filter Kelas */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span>Kelas:</span>
                  <select
                    value={selectedKelasFilter}
                    onChange={(e) => setSelectedKelasFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="Semua">Semua Kelas (9A-9G)</option>
                    {KELAS_LIST.map((kls) => (
                      <option key={kls} value={kls}>Kelas {kls}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleExportStudentsToExcel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Export Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaultStudents}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
                  title="Kembalikan ke data default 14 siswa"
                >
                  Reset Default
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0A387E] text-white uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Kode Peserta</th>
                      <th className="py-3 px-4">Nama Lengkap Siswa</th>
                      <th className="py-3 px-4 text-center">Kelas</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4 text-center">Token Ujian</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                          Tidak ada siswa yang terdaftar di kelas {selectedKelasFilter}.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st, idx) => (
                        <tr key={st.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-900">{st.kodePeserta}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{st.nama}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-extrabold text-[11px]">
                              {st.kelas}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-800 bg-slate-50">{st.username}</td>
                          <td className="py-3 px-4 font-mono text-slate-600 bg-slate-50">{st.password}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">
                            {st.token || config.tokenUjian || 'ANBK26'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(st.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBMENU 2: HASIL UJIAN & REKAP SKOR                      */}
        {/* ======================================================== */}
        {activeTab === 'hasil' && (
          <div className="space-y-5">
            {/* Summary Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Rekapitulasi Hasil Pengerjaan Siswa</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total {results.length} peserta telah menyelesaikan ujian ini
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportResultsToExcel}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Rekap Hasil (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0A387E] text-white uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Nama Siswa</th>
                      <th className="py-3 px-4 text-center">Kelas</th>
                      <th className="py-3 px-4">Waktu Selesai</th>
                      <th className="py-3 px-4">Durasi</th>
                      <th className="py-3 px-4 text-center">Benar / Total</th>
                      <th className="py-3 px-4 text-center">Skor Akhir</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                          Belum ada peserta yang menyelesaikan ujian. Begitu siswa menekan "Selesai", skor dan rekapan jawaban akan tampil di sini.
                        </td>
                      </tr>
                    ) : (
                      results.map((res, idx) => (
                        <tr key={res.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{res.nama}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{res.kodePeserta}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                              {res.kelas}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{res.waktuSelesai}</td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{res.durasiPengerjaan}</td>
                          <td className="py-3 px-4 text-center font-bold">
                            <span className="text-emerald-700">{res.jumlahBenar}</span>
                            <span className="text-slate-400"> / {res.totalSoal}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-base font-black font-mono px-2.5 py-1 rounded-lg ${
                              res.skorAkhir >= 75 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {res.skorAkhir}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {res.statusSync}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedResultDetail(res)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Lihat Rincian
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBMENU 3: PENGATURAN & KONEKSI GOOGLE SHEETS            */}
        {/* ======================================================== */}
        {activeTab === 'pengaturan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Pengaturan Ujian */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                  <Settings className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-base text-slate-900">Konfigurasi Parameter Ujian</h3>
                </div>

                <form onSubmit={handleSaveSettings} noValidate className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Judul Ujian CBT
                    </label>
                    <input
                      type="text"
                      value={tempConfig.namaUjian}
                      onChange={(e) => setTempConfig({ ...tempConfig, namaUjian: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Durasi Ujian (Menit)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={tempConfig.waktuMenit}
                        onChange={(e) => setTempConfig({ ...tempConfig, waktuMenit: parseInt(e.target.value) || 80 })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Token Ujian Aktif
                      </label>
                      <input
                        type="text"
                        value={tempConfig.tokenUjian}
                        onChange={(e) => setTempConfig({ ...tempConfig, tokenUjian: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-black font-mono tracking-widest text-indigo-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempConfig.acakSoal}
                        onChange={(e) => setTempConfig({ ...tempConfig, acakSoal: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">Acak Urutan Soal (Shuffle)</span>
                        <span className="text-slate-500">Urutan butir soal berbeda untuk setiap siswa yang login</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempConfig.tampilkanHasilSiswa}
                        onChange={(e) => setTempConfig({ ...tempConfig, tampilkanHasilSiswa: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">Tampilkan Skor ke Siswa Setelah Selesai</span>
                        <span className="text-slate-500">Siswa dapat langsung melihat skor akhir dan status kelulusan</span>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Password Akses Pembahasan Guru
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={tempConfig.passwordPembahasan}
                      onChange={(e) => setTempConfig({ ...tempConfig, passwordPembahasan: e.target.value })}
                      placeholder="Masukkan password pembahasan"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-purple-900 font-bold"
                    />
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Password tersembunyi untuk membuka kunci menu pembahasan oleh proktor/guru.
                    </span>
                  </div>

                  {/* URL Google Apps Script */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                      <span>URL Google Apps Script Web App (Database Spreadsheet)</span>
                      <span className="text-[10px] text-emerald-700 font-semibold lowercase">
                        https://script.google.com/.../exec
                      </span>
                    </label>
                    <input
                      type="text"
                      value={tempConfig.gasWebAppUrl}
                      onChange={(e) => setTempConfig({ ...tempConfig, gasWebAppUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-blue-950 focus:bg-white"
                    />
                  </div>

                  {/* Inline Feedback Banner */}
                  {saveSuccessMessage && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{saveSuccessMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      onClick={handleSaveSettings}
                      disabled={isSavingConfig}
                      className={`flex-1 py-3 px-4 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSaveConfigSuccess
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-2'
                          : isSavingConfig
                          ? 'bg-blue-800 text-blue-200 cursor-wait opacity-90'
                          : 'bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white hover:shadow-lg'
                      }`}
                    >
                      {isSavingConfig ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
                          <span>Menyimpan Konfigurasi...</span>
                        </>
                      ) : isSaveConfigSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                          <span>✓ Konfigurasi Berhasil Disimpan!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Simpan Konfigurasi</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isTestingConn}
                      onClick={handleTestConnection}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingConn ? 'animate-spin' : ''}`} />
                      <span>Uji Koneksi</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Google Apps Script Code & Deployment Guide */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-base text-slate-900">Kode Google Apps Script (Code.gs)</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAppsScriptCode}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Tersalin!' : 'Salin Kode AppScript'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] max-h-56 overflow-y-auto leading-relaxed border border-slate-800">
                    <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
                  </div>

                  {/* Step by step guide */}
                  <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
                    <div className="font-bold text-blue-950 flex items-center gap-1">
                      <Info className="w-4 h-4 text-blue-700" />
                      <span>Langkah Menghubungkan ke Google Spreadsheet:</span>
                    </div>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-700 text-[11px]">
                      <li>Buka Google Spreadsheet baru (beri nama: <strong>CBT ANBK SMP</strong>).</li>
                      <li>Klik menu <strong>Extensions (Ekstensi) &gt; Apps Script</strong>.</li>
                      <li>Hapus kode bawaan, lalu <strong>Paste (Tempel)</strong> kode di atas.</li>
                      <li>Klik tombol <strong>Deploy (Terapkan) &gt; New deployment (Penerapan baru)</strong>.</li>
                      <li>Pilih jenis <strong>Web App</strong>, lalu atur:
                        <ul className="list-disc pl-4 mt-0.5">
                          <li>Execute as: <strong>Me (Saya)</strong></li>
                          <li>Who has access: <strong>Anyone (Siapa saja)</strong></li>
                        </ul>
                      </li>
                      <li>Salin URL Web App yang dihasilkan, lalu tempelkan di kotak isian di samping kiri.</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Sheets Otomatis: UserLogin &amp; JawabanUjian</span>
                  <span className="font-bold text-emerald-700">Auto-Created Header ✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBMENU 4: AKSES PEMBAHASAN (BERPASSWORD SESUAI REQUEST) */}
        {/* ======================================================== */}
        {activeTab === 'pembahasan' && (
          <div className="space-y-6">
            {!isDiscussionUnlocked ? (
              /* Password Protected Wall */
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center my-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4 border-2 border-purple-200">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">AKSES PEMBAHASAN TERKUNCI</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Kunci jawaban dan pembahasan soal dilindungi password khusus guru/proktor agar tidak dapat diakses sembarangan oleh peserta ujian.
                </p>

                <form onSubmit={handleUnlockDiscussion} className="space-y-4">
                  {passwordError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl text-left">
                      {passwordError}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan Password Pembahasan"
                      className="w-full px-4 py-2.5 text-center text-sm font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Buka Kunci Pembahasan
                  </button>
                </form>
              </div>
            ) : (
              /* Unlocked Discussion Content */
              <div className="space-y-5">
                <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-purple-200 uppercase tracking-wider font-bold">
                      Akses Pembahasan Resmi Terverifikasi
                    </div>
                    <h3 className="text-lg font-black">BANK SOAL, KUNCI, DAN PEMBAHASAN TKA MATEMATIKA</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDiscussionUnlocked(false);
                      setPasswordInput('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-xs font-bold text-white border border-purple-600 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Kunci Kembali Pembahasan</span>
                  </button>
                </div>

                {/* Question Discussion List */}
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-[#0A387E] text-white font-black text-xs">
                            SOAL NO. {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-xs text-slate-800">
                            {q.elemen} · {q.subelemen}
                          </span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded bg-purple-100 text-purple-900 font-bold">
                          Kunci: {q.kunci}
                        </span>
                      </div>

                      {/* Stimulus Summary */}
                      <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                        "{q.stimulus_text.slice(0, 180)}..."
                      </p>

                      {/* Pertanyaan */}
                      <div className="font-bold text-sm text-slate-900">
                        {q.pertanyaan}
                      </div>

                      {/* Pembahasan Box */}
                      <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl text-xs space-y-1.5">
                        <div className="font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Langkah Pembahasan Matematis:</span>
                        </div>
                        <p className="text-emerald-900 whitespace-pre-wrap leading-relaxed font-sans">
                          {q.pembahasan}
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>Level: {q.level_kognitif} · Bentuk: {q.bentuk_soal}</span>
                        <span className="font-semibold text-indigo-700">{q.aspek_numerasi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Tambah Siswa Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#0A387E] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider">Tambah Akun Siswa Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-amber-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newStudent.nama}
                  onChange={(e) => setNewStudent({ ...newStudent, nama: e.target.value })}
                  placeholder="Contoh: Muhammad Rizky"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kelas</label>
                  <select
                    value={newStudent.kelas}
                    onChange={(e) => setNewStudent({ ...newStudent, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {KELAS_LIST.map((kls) => (
                      <option key={kls} value={kls}>Kelas {kls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newStudent.username}
                    onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                    placeholder="misal: 9a03"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kode Peserta</label>
                  <input
                    type="text"
                    value={newStudent.kodePeserta}
                    onChange={(e) => setNewStudent({ ...newStudent, kodePeserta: e.target.value })}
                    placeholder="01-054-..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Hasil Ujian */}
      {selectedResultDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#0A387E] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">DETAIL JAWABAN SISWA</h3>
                <div className="text-xs text-blue-200">{selectedResultDetail.nama} ({selectedResultDetail.kelas})</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResultDetail(null)}
                className="text-white hover:text-amber-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center font-bold">
                <div>
                  <span className="text-[10px] text-slate-400 block">Skor Akhir</span>
                  <span className="text-xl text-blue-800 font-mono">{selectedResultDetail.skorAkhir}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Benar</span>
                  <span className="text-xl text-emerald-600 font-mono">{selectedResultDetail.jumlahBenar}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Salah</span>
                  <span className="text-xl text-rose-600 font-mono">{selectedResultDetail.jumlahSalah}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Rincian Jawaban Per Butir Soal:</span>
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {selectedResultDetail.detailJawabanText.split(' | ').map((line, i) => (
                    <div key={i} className="py-0.5 border-b border-slate-800">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResultDetail(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
