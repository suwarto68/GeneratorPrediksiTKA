import { QuestionData } from './index';

export type KelasOption = '9A' | '9B' | '9C' | '9D' | '9E' | '9F' | '9G' | string;

export interface CBTStudent {
  id: string;
  kodePeserta: string; // e.g. '01-054-001-8'
  username: string;
  password: string;
  nama: string;
  kelas: KelasOption;
  token?: string;
  statusUjian?: 'Belum Ujian' | 'Sedang Ujian' | 'Selesai';
  nilaiTerakhir?: number;
}

export interface CBTExamConfig {
  namaUjian: string;
  jenjang: string;
  mataPelajaran: string;
  waktuMenit: number; // default 80
  tokenUjian: string; // default 'TKA2026'
  wajibToken: boolean;
  acakSoal: boolean;
  tampilkanHasilSiswa: boolean;
  passwordPembahasan: string; // default 'GURU2026'
  gasWebAppUrl: string; // Google Apps Script URL
  sheetUserLoginName: string; // default 'UserLogin'
  sheetJawabanName: string; // default 'JawabanUjian'
  sheetDataSiswaName: string; // default 'DataSiswa'
}

export interface CBTStudentAnswerItem {
  questionId: string;
  item_id?: string;
  questionNo: number;
  bentukSoal: 'PG' | 'PG Kompleks/MCMA' | 'PG Kategori';
  selectedOption?: string; // e.g. 'A', 'B', 'C', 'D'
  selectedComplexOptions?: number[]; // indices of statements chosen
  categoryAnswers?: Record<number, 'BENAR' | 'SALAH'>;
  isDoubt: boolean; // Ragu-ragu
  isAnswered: boolean;
  isCorrect?: boolean;
}

export interface CBTExamResult {
  id: string;
  kodePeserta: string;
  username: string;
  nama: string;
  kelas: string;
  token: string;
  waktuMulai: string;
  waktuSelesai: string;
  durasiPengerjaan: string;
  totalSoal: number;
  jumlahBenar: number;
  jumlahSalah: number;
  jumlahKosong: number;
  jumlahRagu: number;
  skorAkhir: number; // 0 - 100
  detailJawabanText: string;
  answersMap: Record<string, CBTStudentAnswerItem>;
  statusSync: 'Tersimpan Online' | 'Tersimpan Lokal' | 'Gagal';
  syncMessage?: string;
  timestamp: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isChecking: boolean;
  mode: 'online' | 'offline' | 'error';
  message: string;
  lastChecked?: string;
}
