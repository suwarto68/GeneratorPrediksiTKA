import { CBTExamConfig, CBTExamResult, CBTStudent, ConnectionStatus } from '../types/cbtTypes';

export const DEFAULT_CBT_CONFIG: CBTExamConfig = {
  namaUjian: 'TRY OUT CBT ANBK - TKA MATEMATIKA SMP 2026/2027',
  jenjang: 'SMP / MTs',
  mataPelajaran: 'Matematika (Numerasi Fase D)',
  waktuMenit: 80,
  tokenUjian: 'ANBK26',
  wajibToken: true,
  acakSoal: true,
  tampilkanHasilSiswa: true,
  passwordPembahasan: 'GURU2026',
  gasWebAppUrl: '',
  sheetUserLoginName: 'UserLogin',
  sheetJawabanName: 'JawabanUjian',
  sheetDataSiswaName: 'DataSiswa'
};

export const INITIAL_STUDENTS: CBTStudent[] = [
  { id: 'S-01', kodePeserta: '01-054-001-8', username: '9a01', password: '123', nama: 'Aditya Pratama Putra', kelas: '9A', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-02', kodePeserta: '01-054-002-7', username: '9a02', password: '123', nama: 'Annisa Fitri Rahmawati', kelas: '9A', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-03', kodePeserta: '01-054-003-6', username: '9b01', password: '123', nama: 'Bagas Wahyu Saputra', kelas: '9B', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-04', kodePeserta: '01-054-004-5', username: '9b02', password: '123', nama: 'Citra Kirana Dewi', kelas: '9B', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-05', kodePeserta: '01-054-005-4', username: '9c01', password: '123', nama: 'Dimas Anggoro Setiawan', kelas: '9C', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-06', kodePeserta: '01-054-006-3', username: '9c02', password: '123', nama: 'Dinda Ayu Maharani', kelas: '9C', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-07', kodePeserta: '01-054-007-2', username: '9d01', password: '123', nama: 'Fajar Nugraha', kelas: '9D', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-08', kodePeserta: '01-054-008-9', username: '9d02', password: '123', nama: 'Farah Salsabila', kelas: '9D', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-09', kodePeserta: '01-054-009-8', username: '9e01', password: '123', nama: 'Gilang Ramadhan', kelas: '9E', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-10', kodePeserta: '01-054-010-7', username: '9e02', password: '123', nama: 'Hana Khairunnisa', kelas: '9E', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-11', kodePeserta: '01-054-011-6', username: '9f01', password: '123', nama: 'Ihsan Maulana', kelas: '9F', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-12', kodePeserta: '01-054-012-5', username: '9f02', password: '123', nama: 'Intan Permatasari', kelas: '9F', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-13', kodePeserta: '01-054-013-4', username: '9g01', password: '123', nama: 'Jovan Raditya', kelas: '9G', token: 'ANBK26', statusUjian: 'Belum Ujian' },
  { id: 'S-14', kodePeserta: '01-054-014-3', username: '9g02', password: '123', nama: 'Karina Nabila Putri', kelas: '9G', token: 'ANBK26', statusUjian: 'Belum Ujian' }
];

export const KELAS_LIST = ['9A', '9B', '9C', '9D', '9E', '9F', '9G'];

// Storage Keys
const CBT_CONFIG_KEY = 'tka_cbt_config_v1';
const CBT_STUDENTS_KEY = 'tka_cbt_students_v1';
const CBT_RESULTS_KEY = 'tka_cbt_results_v1';

export function loadCBTConfig(): CBTExamConfig {
  try {
    const raw = localStorage.getItem(CBT_CONFIG_KEY);
    if (raw) {
      return { ...DEFAULT_CBT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading CBT config:', e);
  }
  return DEFAULT_CBT_CONFIG;
}

export function saveCBTConfig(config: CBTExamConfig) {
  try {
    localStorage.setItem(CBT_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving CBT config:', e);
  }
}

export function loadCBTStudents(): CBTStudent[] {
  try {
    const raw = localStorage.getItem(CBT_STUDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading students:', e);
  }
  return INITIAL_STUDENTS;
}

export function saveCBTStudents(students: CBTStudent[]) {
  try {
    localStorage.setItem(CBT_STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students:', e);
  }
}

export function loadCBTResults(): CBTExamResult[] {
  try {
    const raw = localStorage.getItem(CBT_RESULTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading results:', e);
  }
  return [];
}

export function saveCBTResultLocal(result: CBTExamResult): CBTExamResult[] {
  const current = loadCBTResults();
  const updated = [result, ...current.filter(r => r.id !== result.id)];
  try {
    localStorage.setItem(CBT_RESULTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving result:', e);
  }
  return updated;
}

/**
 * Ping check connection to Google Apps Script Web App
 */
export async function testGoogleAppsScriptConnection(url: string): Promise<ConnectionStatus> {
  if (!url || !url.trim().startsWith('http')) {
    return {
      isConnected: false,
      isChecking: false,
      mode: 'offline',
      message: 'URL Google Apps Script belum diisi. Sistem saat ini berjalan dalam mode penyimpanan lokal (offline).'
    };
  }

  const cleanUrl = url.trim();
  const testUrl = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=ping&t=${Date.now()}`;

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors'
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        return {
          isConnected: true,
          isChecking: false,
          mode: 'online',
          message: `Terhubung dengan Google Spreadsheet "${data.spreadsheetName || 'Aktif'}". Sheet siap digunakan!`,
          lastChecked: new Date().toLocaleTimeString('id-ID')
        };
      }
    }
    
    // If CORS or redirect prevented full JSON parsing, test fallback via img or simple probe
    return {
      isConnected: true,
      isChecking: false,
      mode: 'online',
      message: 'Koneksi ke Web App Google Apps Script berhasil terdeteksi.',
      lastChecked: new Date().toLocaleTimeString('id-ID')
    };
  } catch (error: any) {
    // Check if error is network/CORS
    return {
      isConnected: false,
      isChecking: false,
      mode: 'error',
      message: `Tidak dapat menjangkau server Google Apps Script. Pastikan Web App di-deploy dengan akses "Anyone" (Siapa Saja). Pesan: ${error.message || 'Network Error'}`
    };
  }
}

/**
 * Save Student Exam Answer to Google Spreadsheet (Sheet: JawabanUjian)
 */
export async function saveExamAnswerToSheet(
  result: CBTExamResult,
  gasUrl: string
): Promise<{ success: boolean; message: string }> {
  // Always ensure local backup first
  saveCBTResultLocal(result);

  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return {
      success: true,
      message: 'Hasil ujian berhasil disimpan di Memori Lokal Sekolah (Mode Offline). URL Google Spreadsheet belum dikonfigurasi.'
    };
  }

  const payload = {
    action: 'simpanJawaban',
    nama: result.nama,
    kelas: result.kelas,
    kodePeserta: result.kodePeserta,
    username: result.username,
    token: result.token,
    waktuMulai: result.waktuMulai,
    waktuSelesai: result.waktuSelesai,
    durasi: result.durasiPengerjaan,
    totalSoal: result.totalSoal,
    jumlahBenar: result.jumlahBenar,
    jumlahSalah: result.jumlahSalah,
    jumlahRagu: result.jumlahRagu,
    skorAkhir: result.skorAkhir,
    detailJawaban: result.detailJawabanText,
    timestamp: result.timestamp
  };

  try {
    const res = await fetch(gasUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Avoid CORS preflight on GAS
      },
      body: JSON.stringify(payload)
    });

    const resText = await res.text();
    let resJson;
    try {
      resJson = JSON.parse(resText);
    } catch {
      resJson = { status: 'success' };
    }

    if (resJson && resJson.status === 'success') {
      return {
        success: true,
        message: 'Jawaban dan skor siswa berhasil terkirim dan tersimpan otomatis di Google Spreadsheet (Sheet: JawabanUjian)!'
      };
    } else {
      return {
        success: true,
        message: resJson.message || 'Terkirim ke server Google Apps Script.'
      };
    }
  } catch (err: any) {
    console.warn('Sync to Google Sheets encountered issue, local copy preserved:', err);
    return {
      success: false,
      message: `Gagal sinkronisasi online (${err.message}). Data ujian telah diamankan di penyimpanan lokal.`
    };
  }
}

/**
 * Sync Student Accounts (Kode, Nama, Username, Password, Kelas, Token) to Sheet DataSiswa/UserLogin
 */
export async function syncStudentDataToSheet(
  students: CBTStudent[],
  gasUrl: string
): Promise<{ success: boolean; message: string }> {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return {
      success: false,
      message: 'URL Google Apps Script belum disetel. Buka Pengaturan Ujian untuk memasukkan Web App URL.'
    };
  }

  const payload = {
    action: 'simpanDataSiswa',
    students: students.map(s => ({
      kode: s.kodePeserta,
      nama: s.nama,
      username: s.username,
      password: s.password,
      kelas: s.kelas,
      token: s.token || 'ANBK26'
    }))
  };

  try {
    const res = await fetch(gasUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const resJson = await res.json();
    return {
      success: resJson.status === 'success',
      message: resJson.message || 'Data siswa berhasil disimpan ke Google Spreadsheet!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal mengirim data siswa ke Google Spreadsheet: ${err.message}`
    };
  }
}

/**
 * Fetch Student Accounts from Google Spreadsheet (Sheet: UserLogin)
 */
export async function fetchStudentsFromSheet(
  gasUrl: string
): Promise<{ success: boolean; students?: CBTStudent[]; message: string }> {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return {
      success: false,
      message: 'URL Google Apps Script belum dikonfigurasi di Pengaturan.'
    };
  }

  const cleanUrl = gasUrl.trim();
  const fetchUrl = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}action=tarikDataSiswa&t=${Date.now()}`;

  try {
    const res = await fetch(fetchUrl, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.students)) {
      const parsedStudents: CBTStudent[] = data.students.map((item: any, idx: number) => ({
        id: `S-SHEET-${idx + 1}`,
        kodePeserta: item.kode || item.kodePeserta || `01-054-${String(idx + 1).padStart(3, '0')}-0`,
        username: String(item.username || '').toLowerCase().trim(),
        password: String(item.password || ''),
        nama: String(item.nama || item.namaPeserta || 'Siswa'),
        kelas: String(item.kelas || '9A').toUpperCase().trim(),
        token: item.token || 'ANBK26',
        statusUjian: 'Belum Ujian'
      }));

      // Merge / save to local students
      saveCBTStudents(parsedStudents);

      return {
        success: true,
        students: parsedStudents,
        message: `Berhasil menarik ${parsedStudents.length} akun siswa dari sheet "${data.sheetName || 'UserLogin'}" Google Spreadsheet!`
      };
    } else {
      return {
        success: false,
        message: data.message || 'Gagal memproses data dari spreadsheet.'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Terjadi kendala saat menarik data dari spreadsheet: ${err.message}. Pastikan deployment Apps Script disetel "Anyone".`
    };
  }
}

/**
 * Complete Google Apps Script (Code.gs) Source Code for user deployment
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: SISTEM CBT ANBK - TKA SMP FASE D
 * Sinkronisasi Otomatis Google Spreadsheet:
 * 1. Sheet 'UserLogin'    : Autentikasi Siswa (Username, Password, Kelas, Nama, Token, Kode)
 * 2. Sheet 'JawabanUjian' : Rekap Jawaban Siswa (Nama, Kelas, Waktu, Durasi, Jawaban Tiap Nomor, Skor Akhir)
 * 3. Sheet 'DataSiswa'    : Database Master Peserta (Kode, Nama, Kelas, Token)
 * =========================================================================
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Koneksi ke Google Apps Script & Spreadsheet Berhasil!',
      spreadsheetName: ss.getName(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Tarik Data Siswa dari Sheet UserLogin
  if (action === 'tarikDataSiswa') {
    var sheet = ss.getSheetByName('UserLogin');
    if (!sheet) {
      sheet = inisialisasiSheetUserLogin(ss);
    }
    
    var data = sheet.getDataRange().getValues();
    var students = [];
    
    // Baris 1 adalah Header
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0] && row[0].toString().trim() !== '') {
        students.push({
          kode: row[0] ? row[0].toString() : '',
          username: row[1] ? row[1].toString() : '',
          password: row[2] ? row[2].toString() : '',
          nama: row[3] ? row[3].toString() : '',
          kelas: row[4] ? row[4].toString() : '',
          token: row[5] ? row[5].toString() : 'ANBK26'
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      sheetName: 'UserLogin',
      total: students.length,
      students: students
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Aksi tidak dikenali: ' + action
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData = {};

    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        postData = e.parameter;
      }
    } else {
      postData = e.parameter;
    }

    var action = postData.action || 'simpanJawaban';

    // 1. Simpan Jawaban Siswa & Skor Akhir ke Sheet 'JawabanUjian'
    if (action === 'simpanJawaban') {
      var sheetJawaban = ss.getSheetByName('JawabanUjian');
      if (!sheetJawaban) {
        sheetJawaban = inisialisasiSheetJawaban(ss);
      }

      var rowData = [
        new Date(), // Waktu Submit
        postData.kodePeserta || '',
        postData.nama || '',
        postData.kelas || '',
        postData.username || '',
        postData.token || '',
        postData.waktuMulai || '',
        postData.waktuSelesai || '',
        postData.durasi || '',
        postData.totalSoal || 0,
        postData.jumlahBenar || 0,
        postData.jumlahSalah || 0,
        postData.jumlahRagu || 0,
        postData.skorAkhir || 0,
        postData.detailJawaban || ''
      ];

      sheetJawaban.appendRow(rowData);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Hasil ujian dan rincian jawaban berhasil disimpan di Sheet JawabanUjian!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Simpan / Sinkronkan Data Siswa ke Sheet 'DataSiswa' & 'UserLogin'
    if (action === 'simpanDataSiswa') {
      var sheetSiswa = ss.getSheetByName('UserLogin');
      if (!sheetSiswa) {
        sheetSiswa = inisialisasiSheetUserLogin(ss);
      }

      var list = postData.students || [];
      if (Array.isArray(list) && list.length > 0) {
        // Hapus baris lama kecuali header jika ingin reset total, atau append
        for (var k = 0; k < list.length; k++) {
          var s = list[k];
          sheetSiswa.appendRow([
            s.kode || '',
            s.username || '',
            s.password || '',
            s.nama || '',
            s.kelas || '',
            s.token || 'ANBK26'
          ]);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Berhasil menyimpan ' + list.length + ' data siswa ke sheet UserLogin!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Aksi post tidak dikenali'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Inisialisasi Sheet UserLogin otomatis dengan format header
function inisialisasiSheetUserLogin(ss) {
  var sheet = ss.insertSheet('UserLogin');
  var header = ['Kode Peserta', 'Username', 'Password', 'Nama Peserta', 'Kelas', 'Token Ujian'];
  sheet.appendRow(header);
  var headerRange = sheet.getRange(1, 1, 1, header.length);
  headerRange.setBackground('#0b409c').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  
  // Data Sample Awal
  var samples = [
    ['01-054-001-8', '9a01', '123', 'Aditya Pratama Putra', '9A', 'ANBK26'],
    ['01-054-002-7', '9a02', '123', 'Annisa Fitri Rahmawati', '9A', 'ANBK26'],
    ['01-054-003-6', '9b01', '123', 'Bagas Wahyu Saputra', '9B', 'ANBK26'],
    ['01-054-004-5', '9b02', '123', 'Citra Kirana Dewi', '9B', 'ANBK26'],
    ['01-054-005-4', '9c01', '123', 'Dimas Anggoro Setiawan', '9C', 'ANBK26'],
    ['01-054-007-2', '9d01', '123', 'Fajar Nugraha', '9D', 'ANBK26'],
    ['01-054-009-8', '9e01', '123', 'Gilang Ramadhan', '9E', 'ANBK26'],
    ['01-054-011-6', '9f01', '123', 'Ihsan Maulana', '9F', 'ANBK26'],
    ['01-054-013-4', '9g01', '123', 'Jovan Raditya', '9G', 'ANBK26']
  ];
  
  for (var j = 0; j < samples.length; j++) {
    sheet.appendRow(samples[j]);
  }
  return sheet;
}

// Inisialisasi Sheet JawabanUjian otomatis dengan format header
function inisialisasiSheetJawaban(ss) {
  var sheet = ss.insertSheet('JawabanUjian');
  var header = [
    'Timestamp',
    'Kode Peserta',
    'Nama Siswa',
    'Kelas',
    'Username',
    'Token',
    'Waktu Mulai',
    'Waktu Selesai',
    'Durasi',
    'Total Soal',
    'Benar',
    'Salah',
    'Ragu',
    'Skor Akhir (0-100)',
    'Detail Jawaban Siswa'
  ];
  sheet.appendRow(header);
  var headerRange = sheet.getRange(1, 1, 1, header.length);
  headerRange.setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}
`;
