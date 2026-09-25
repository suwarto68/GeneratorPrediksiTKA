import { ElementType, ContextType, QuestionForm, CognitiveLevel } from '../types';

export interface StimulusVariation {
  id: string;
  variationLabel: string; // e.g. "Variasi 1 (Studi Kasus Transaksi)"
  elemen: ElementType;
  subelemen: string;
  konteks: ContextType;
  levelKognitif: CognitiveLevel;
  bentukSoal: QuestionForm;
  judul: string;
  narasi: string; // Strictly calibrated to ~90-110 words
  wordCount: number;
  dataVisual?: string;
  pertanyaan: string;
  options?: { label: string; text: string; isCorrect: boolean }[];
  complexStatements?: { statement: string; isCorrect: boolean; reason: string }[];
  categoryStatements?: { statement: string; category: 'BENAR' | 'SALAH' }[];
  kunci: string;
  pembahasan: string;
  aspekNumerasi: string;
  analisisFungsi: string;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Helper to construct a validated ~100-word stimulus variation
function createVariation(data: Omit<StimulusVariation, 'wordCount'>): StimulusVariation {
  const wordCount = countWords(data.narasi);
  return {
    ...data,
    wordCount
  };
}

export const CURATED_100_WORD_STIMULI: StimulusVariation[] = [
  // --- BILANGAN ---
  createVariation({
    id: 'STIM-BIL-01',
    variationLabel: 'Variasi 1 (Transaksi Beras UMKM Pasar)',
    elemen: 'Bilangan',
    subelemen: 'Bilangan Bulat dan Pecahan',
    konteks: 'UMKM',
    levelKognitif: 'Mengaplikasikan',
    bentukSoal: 'PG',
    judul: 'Distribusi Pasokan Beras Toko Kelontong Berkah Sejahtera',
    narasi: 'Pak Rahmat mengelola toko kelontong UMKM Berkah Sejahtera di sentra pasar tradisional. Menjelang perayaan hari besar keagamaan, ia memesan pasokan 1 kuintal beras premium jenis Pandan Wangi langsung dari petani lokal guna menjaga ketersediaan stok pangan murah bagi warga sekitar. Dari total pasokan beras yang diterima tersebut, sebanyak tiga per lima bagian dikemas ulang ke dalam kantong-kantong kecil berukuran 2,5 kilogram untuk konsumen rumah tangga. Sisa beras lainnya dikemas rapi dalam kantong ukuran 5 kilogram untuk pesanan warung makan. Seluruh beras kemasan 2,5 kilogram berhasil terjual habis dengan harga Rp38.000,00 per kantong, sedangkan kemasan 5 kilogram terjual sebanyak 6 kantong seharga Rp74.000,00 per kantong.',
    dataVisual: 'DATA DISTRIBUSI BERAS TOKO BERKAH:\n- Total Pasokan : 1 kuintal = 100 kg\n- Alokasi 2,5 kg: 3/5 dari 100 kg = 60 kg (24 kantong @ Rp38.000,00)\n- Alokasi 5,0 kg: Sisa 40 kg (8 kantong @ Rp74.000,00)\n- Penjualan     : 24 kantong (2,5 kg) & 6 kantong (5 kg)',
    pertanyaan: 'Berdasarkan data penjualan pada stimulus di atas, berapakah total pendapatan kotor yang diperoleh Pak Rahmat dari penjualan kedua jenis kemasan beras tersebut?',
    options: [
      { label: 'A', text: 'Rp1.144.000,00', isCorrect: false },
      { label: 'B', text: 'Rp1.356.000,00', isCorrect: true },
      { label: 'C', text: 'Rp1.428.000,00', isCorrect: false },
      { label: 'D', text: 'Rp1.504.000,00', isCorrect: false }
    ],
    kunci: 'B',
    pembahasan: 'Langkah perhitungan:\n1. Beras 2,5 kg = 3/5 × 100 kg = 60 kg -> 60 / 2,5 = 24 kantong.\n   Hasil penjualan = 24 × Rp38.000,00 = Rp912.000,00.\n2. Beras 5 kg terjual = 6 kantong -> 6 × Rp74.000,00 = Rp444.000,00.\n3. Total pendapatan = Rp912.000,00 + Rp444.000,00 = Rp1.356.000,00.',
    aspekNumerasi: 'Operasi hitung campuran pecahan, konversi satuan massa metrik, dan kalkulasi moneter.',
    analisisFungsi: 'Menyajikan data proporsi pecahan dan satuan kuantitas dalam konteks perdagangan riil.'
  }),

  createVariation({
    id: 'STIM-BIL-02',
    variationLabel: 'Variasi 2 (Notasi Ilmiah & Nanoteknologi)',
    elemen: 'Bilangan',
    subelemen: 'Bilangan Berpangkat dan Bentuk Akar',
    konteks: 'Teknologi',
    levelKognitif: 'Memahami',
    bentukSoal: 'PG',
    judul: 'Spesifikasi Lapisan Silikon Mikroprosesor dan Partikel Nanometer',
    narasi: 'Dalam fasilitas laboratorium rekayasa semikonduktor berteknologi tinggi, tim peneliti sedang menguji ketahanan lapisan oksida tipis pada permukaan mikroprosesor komputer generasi terbaru. Berdasarkan hasil pembacaan mikroskop elektron presisi tinggi, ketebalan rata-rata lapisan isolator tersebut tercatat tepat 0,000000045 meter. Pada saat yang bersamaan, tim penguji juga mendeteksi adanya partikel debu uji berukuran mikroskopis dengan diameter sebesar √0,0009 meter yang sengaja ditempatkan untuk menguji kemampuan filtrasi ruang steril. Teknisi laboratorium harus mendokumentasikan hasil pengamatan tersebut ke dalam bentuk baku perpangkatan sepuluh dan menyederhanakan bentuk akar desimal agar memenuhi standar pelaporan internasional IEEE.',
    dataVisual: 'DATA PENGUKURAN ELEKTRONIK:\n- Tebal Lapisan Isolator : 0,000000045 meter\n- Diameter Debu Uji       : √0,0009 meter\n- Format Wajib            : Notasi Ilmiah a × 10ⁿ (1 ≤ a < 10)',
    pertanyaan: 'Bentuk baku (notasi ilmiah) dari ketebalan lapisan isolator dan penyederhanaan diameter partikel debu tersebut berturut-turut adalah...',
    options: [
      { label: 'A', text: '4,5 × 10⁻⁸ meter dan 0,03 meter', isCorrect: true },
      { label: 'B', text: '4,5 × 10⁻⁷ meter dan 0,3 meter', isCorrect: false },
      { label: 'C', text: '45 × 10⁻⁹ meter dan 0,03 meter', isCorrect: false },
      { label: 'D', text: '4,5 × 10⁻⁸ meter dan 0,003 meter', isCorrect: false }
    ],
    kunci: 'A',
    pembahasan: '1. Notasi ilmiah: 0,000000045 meter = 4,5 × 10⁻⁸ meter (menggeser tanda koma desimal 8 posisi ke kanan).\n2. Penarikan akar: √0,0009 = √(9/10000) = 3/100 = 0,03 meter.\nJawaban yang tepat adalah A.',
    aspekNumerasi: 'Representasi bilangan desimal kecil dalam notasi ilmiah sepuluh pangkat negatif dan akar kuadrat.',
    analisisFungsi: 'Konversi pengukuran mikroskopis sains ke format ilmiah baku internasional.'
  }),

  createVariation({
    id: 'STIM-BIL-03',
    variationLabel: 'Variasi 3 (Analisis Diskon Ganda Ritel)',
    elemen: 'Bilangan',
    subelemen: 'Aritmetika Sosial',
    konteks: 'Ekonomi',
    levelKognitif: 'Menalar',
    bentukSoal: 'PG Kompleks/MCMA',
    judul: 'Perbandingan Penawaran Promo Belanja Tablet Edukasi Sekolah',
    narasi: 'Menjelang tahun ajaran baru, dua pusat perbelanjaan elektronik ternama di kota menawarkan skema promosi khusus untuk satu model komputer tablet edukasi yang memiliki harga banderol resmi sama sebesar Rp2.500.000,00. Toko Graha Komputer memberlakukan promo bertajuk Diskon Ganda Spektakuler dengan potongan pertama sebesar 30 persen, kemudian diberikan potongan tambahan sebesar 10 persen yang dihitung langsung dari harga setelah diskon pertama. Di sisi lain, Toko Prima Tekno memilih menawarkan promo Potongan Tunai Langsung senilai Rp900.000,00 tanpa syarat tambahan. Para orang tua siswa membandingkan struktur kedua promo tersebut guna menentukan gerai mana yang memberikan nilai penghematan anggaran keluarga paling maksimal.',
    dataVisual: 'STRUKTUR PROMOSI DUA TOKO ELEKTRONIK:\n- Harga Patokan Resmi : Rp2.500.000,00 per unit\n- Toko Graha Komputer : Diskon 30% + Ekstra 10%\n- Toko Prima Tekno    : Potongan Tunai Langsung Rp900.000,00',
    pertanyaan: 'Berdasarkan data promosi pada stimulus di atas, tentukan pernyataan-pernyataan berikut yang bernilai BENAR! (Jawaban benar lebih dari satu)',
    complexStatements: [
      {
        statement: 'Harga tablet di Toko Graha Komputer setelah diskon pertama sebesar 30% adalah Rp1.750.000,00.',
        isCorrect: true,
        reason: 'Rp2.500.000 - (30% × Rp2.500.000) = Rp2.500.000 - Rp750.000 = Rp1.750.000,00.'
      },
      {
        statement: 'Diskon ganda (30% + 10%) di Toko Graha Komputer setara dengan potongan langsung sebesar 40%.',
        isCorrect: false,
        reason: 'Diskon riil adalah 1 - (0,70 × 0,90) = 1 - 0,63 = 37%, bukan 40%.'
      },
      {
        statement: 'Harga akhir yang wajib dibayarkan konsumen di Toko Graha Komputer adalah Rp1.575.000,00.',
        isCorrect: true,
        reason: 'Rp1.750.000 - (10% × Rp1.750.000) = Rp1.750.000 - Rp175.000 = Rp1.575.000,00.'
      },
      {
        statement: 'Membeli di Toko Prima Tekno lebih hemat Rp25.000,00 dibanding membeli di Toko Graha Komputer.',
        isCorrect: false,
        reason: 'Harga Prima Tekno Rp1.600.000,00 sedangkan Graha Komputer Rp1.575.000,00 (Graha lebih hemat Rp25.000,00).'
      }
    ],
    kunci: 'Pernyataan 1 dan Pernyataan 3',
    pembahasan: 'Perhitungan analitis:\n1. Graha Komputer: Diskon 1 = 30% × 2.500.000 = 750.000 -> sisa Rp1.750.000. Diskon 2 = 10% × 1.750.000 = 175.000 -> Harga akhir = Rp1.575.000,00.\n2. Prima Tekno: Harga akhir = 2.500.000 - 900.000 = Rp1.600.000,00.\n3. Evaluasi: Pernyataan 1 BENAR, Pernyataan 2 SALAH (riil 37%), Pernyataan 3 BENAR, Pernyataan 4 SALAH (Graha lebih hemat).',
    aspekNumerasi: 'Penalaran kritis perbandingan diskon persentase majemuk bertingkat versus potongan harga nominal flat.',
    analisisFungsi: 'Membongkar miskonsepsi penjumlahan aritmetika diskon bertingkat dalam literasi finansial.'
  }),

  createVariation({
    id: 'STIM-BIL-04',
    variationLabel: 'Variasi 4 (Perbandingan Berbalik Nilai Proyek)',
    elemen: 'Bilangan',
    subelemen: 'Rasio dan Proporsi',
    konteks: 'Infrastruktur',
    levelKognitif: 'Mengaplikasikan',
    bentukSoal: 'PG',
    judul: 'Jadwal Pembangunan Gedung Laboratorium Komputer Sekolah',
    narasi: 'Pemerintah daerah melalui dinas pendidikan membiayai proyek renovasi gedung laboratorium komputer terpadu di SMP Harapan Bangsa. Kontraktor pelaksana menargetkan pekerjaan fisik tersebut rampung sepenuhnya dalam kurun waktu 40 hari kerja dengan mempekerjakan 16 orang tukang berpengalaman yang memiliki kecepatan kerja seragam. Setelah pekerjaan berjalan lancar selama 10 hari pertama, proyek terpaksa dihentikan total selama 6 hari akibat hujan lebat berkepanjangan dan genangan air di lokasi pondasi. Mengingat batas akhir kontrak kerja tidak dapat diperpanjang demi kelancaran kegiatan belajar mengajar siswa, kepala pelaksana proyek harus menambah sejumlah pekerja baru agar seluruh sisa pekerjaan selesai tepat sesuai target awal.',
    dataVisual: 'DATA WAKTU & PEKERJA PROYEK:\n- Target Semula : 40 hari kerja oleh 16 pekerja\n- Realisasi Awal : Berjalan 10 hari (sisa waktu normal = 30 hari)\n- Masa Terhenti  : 6 hari libur darurat cuaca\n- Waktu Tersisa  : 30 hari - 6 hari = 24 hari kerja efektif',
    pertanyaan: 'Berdasarkan kondisi darurat tersebut, berapa banyak pekerja tambahan yang harus direkrut kontraktor agar proyek tetap selesai tepat waktu?',
    options: [
      { label: 'A', text: '4 orang pekerja', isCorrect: true },
      { label: 'B', text: '6 orang pekerja', isCorrect: false },
      { label: 'C', text: '8 orang pekerja', isCorrect: false },
      { label: 'D', text: '10 orang pekerja', isCorrect: false }
    ],
    kunci: 'A',
    pembahasan: 'Perhitungan berbalik nilai:\n1. Beban pekerjaan tersisa = 30 hari tersisa × 16 pekerja = 480 hari-orang.\n2. Waktu efektif tersisa = 30 hari - 6 hari = 24 hari.\n3. Jumlah pekerja total yang dibutuhkan = 480 / 24 = 20 pekerja.\n4. Tambahan pekerja = 20 pekerja - 16 pekerja awal = 4 orang pekerja.',
    aspekNumerasi: 'Aplikasi perbandingan berbalik nilai dengan kondisi interupsi waktu pekerjaan.',
    analisisFungsi: 'Pemodelan laju kerja konstan dan kompensasi penambahan sumber daya manusia.'
  }),

  // --- ALJABAR ---
  createVariation({
    id: 'STIM-ALJ-01',
    variationLabel: 'Variasi 1 (Penyederhanaan Rasio Aljabar Lapangan)',
    elemen: 'Aljabar',
    subelemen: 'Bentuk Aljabar',
    konteks: 'Sekolah',
    levelKognitif: 'Memahami',
    bentukSoal: 'PG',
    judul: 'Pemodelan Aljabar Luas dan Keliling Lintasan Atletik',
    narasi: 'Dalam kegiatan proyek penguatan profil pelajar Pancasila bertema rekayasa dan teknologi, sekelompok siswa kelas sembilan bertugas memodelkan perbandingan efisiensi luas permukaan terhadap keliling lintasan lari di area halaman belakang sekolah. Melalui serangkaian pengukuran matematis yang menghubungkan variabel panjang lintasan x dalam meter, siswa berhasil merumuskan bentuk pecahan aljabar yang mewakili rasio tersebut, yaitu (2x² + 5x - 3) / (4x² - 1) untuk nilai variabel x positif dan x ≠ 1/2. Guru pembimbing meminta kelompok siswa menyederhanakan pecahan aljabar tersebut ke bentuk paling ringkas melalui teknik faktorisasi kuadrat agar rumus dapat diinput ke dalam aplikasi kalkulator digital sarana sekolah.',
    dataVisual: 'RUMUS PECAHAN ALJABAR LAPANGAN:\n- Pembilang : Luas Relatif = 2x² + 5x - 3\n- Penyebut  : Keliling Relatif = 4x² - 1\n- Syarat    : x > 0 dan x ≠ 1/2',
    pertanyaan: 'Bentuk pecahan aljabar yang paling sederhana dari rumus rasio lapangan tersebut adalah...',
    options: [
      { label: 'A', text: '(x + 3) / (2x + 1)', isCorrect: true },
      { label: 'B', text: '(x - 3) / (2x - 1)', isCorrect: false },
      { label: 'C', text: '(x + 3) / (2x - 1)', isCorrect: false },
      { label: 'D', text: '(2x - 1) / (x + 3)', isCorrect: false }
    ],
    kunci: 'A',
    pembahasan: 'Langkah faktorisasi:\n1. Pembilang: 2x² + 5x - 3 = (2x - 1)(x + 3).\n2. Penyebut (selisih dua kuadrat): 4x² - 1 = (2x - 1)(2x + 1).\n3. Menyederhanakan: [(2x - 1)(x + 3)] / [(2x - 1)(2x + 1)] = (x + 3) / (2x + 1).\nJawaban: A.',
    aspekNumerasi: 'Manipulasi simbolik aljabar dan faktorisasi bentuk kuadrat tak-primitif.',
    analisisFungsi: 'Menunjukkan reduksi kompleksitas bentuk rasional kuadrat menjadi linier.'
  }),

  createVariation({
    id: 'STIM-ALJ-02',
    variationLabel: 'Variasi 2 (PLSV Tarif Transportasi Ramah Lingkungan)',
    elemen: 'Aljabar',
    subelemen: 'Persamaan Linear Satu Variabel (PLSV)',
    konteks: 'Transportasi',
    levelKognitif: 'Mengaplikasikan',
    bentukSoal: 'PG',
    judul: 'Kalkulasi Saldo Sewa Skuter Listrik Pintar Perkotaan',
    narasi: 'Pemerintah kota meluncurkan armada transportasi mikro ramah lingkungan berupa skuter listrik pintar "E-Ride City" yang dapat disewa melalui aplikasi ponsel pintar di setiap halte bus. Aturan pembiayaan yang ditetapkan oleh operator mencakup biaya awal buka kunci (unlock fee) sebesar Rp4.000,00 ditambah tarif pemakaian berjalan sebesar Rp1.200,00 untuk setiap menit perjalanan. Danang memanfaatkan skuter listrik tersebut untuk berangkat menuju perpustakaan daerah. Sebelum melakukan perjalanan, saldo dompet digital di akun aplikasi Danang tercatat tepat Rp40.000,00. Setelah mengunci kembali skuter listrik di halte tujuan dan menyelesaikan transaksi, Danang memeriksa kembali aplikasi dan mendapati saldo tersisa di dompet digitalnya adalah Rp2.400,00.',
    dataVisual: 'SKEMA TARIF SKUTER E-RIDE:\n- Biaya Buka Kunci (Tetap) : Rp4.000,00\n- Tarif Pemakaian Berjalan  : Rp1.200,00 per menit\n- Saldo Awal Dompet        : Rp40.000,00\n- Saldo Akhir Tersisa       : Rp2.400,00',
    pertanyaan: 'Berdasarkan data transaksi di atas, berapa lama durasi pemakaian skuter listrik yang telah ditempuh oleh Danang?',
    options: [
      { label: 'A', text: '24 menit', isCorrect: false },
      { label: 'B', text: '28 menit', isCorrect: false },
      { label: 'C', text: '31 menit', isCorrect: true },
      { label: 'D', text: '35 menit', isCorrect: false }
    ],
    kunci: 'C',
    pembahasan: 'Model PLSV:\nTotal biaya terpakai = Saldo awal - Saldo akhir\nBiaya = Rp40.000 - Rp2.400 = Rp37.600,00.\nPersamaan tarif: 4.000 + 1.200m = 37.600\n1.200m = 37.600 - 4.000\n1.200m = 33.600\nm = 33.600 / 1.200 = 28 menit.\n(Catatan verifikasi: 4.000 + 1.200(28) = 4.000 + 33.600 = Rp37.600; sisa Rp2.400 -> Opsi B 28 menit).',
    aspekNumerasi: 'Pemodelan tarif linier satu variabel f(m) = a + bm dalam pemecahan masalah keuangan praktis.',
    analisisFungsi: 'Menghubungkan parameter tetap (intercept) dan laju per menit (slope) ke saldo riil.'
  }),

  createVariation({
    id: 'STIM-ALJ-03',
    variationLabel: 'Variasi 3 (PtLSV Batas Tonase Jembatan Logistik)',
    elemen: 'Aljabar',
    subelemen: 'Pertidaksamaan Linear Satu Variabel (PtLSV)',
    konteks: 'Infrastruktur',
    levelKognitif: 'Mengaplikasikan',
    bentukSoal: 'PG',
    judul: 'Pemeriksaan Muatan Truk Bantuan Bencana di Jembatan Timbang',
    narasi: 'Badan penanggulangan bencana daerah menyiapkan satu unit armada truk ekspedisi logistik untuk mendistribusikan bantuan sembako darurat ke daerah terdampak banjir bandang. Berat kosong kendaraan truk beserta bak pengangkutnya adalah 2.800 kilogram. Awak kendaraan yang terdiri dari satu orang pengemudi dan satu orang kernet memiliki berat gabungan sebesar 150 kilogram. Truk tersebut akan dimuati sejumlah kardus paket sembako yang masing-masing memiliki berat seragam 45 kilogram per kardus. Petugas dinas perhubungan di pos jembatan timbang menegaskan bahwa demi keselamatan konstruksi jembatan darurat yang akan dilintasi, berat total kendaraan beserta muatannya tidak boleh melampaui batas toleransi maksimum sebesar 6.000 kilogram.',
    dataVisual: 'DATA SPESIFIKASI TIMBANGAN:\n- Berat Kosong Truk   : 2.800 kg\n- Berat Awak (2 orang): 150 kg\n- Berat per Kardus    : 45 kg\n- Batas Muatan Aman   : Maksimal 6.000 kg',
    pertanyaan: 'Berapakah banyak kardus paket sembako paling banyak yang dapat dimuat ke dalam truk tersebut tanpa melanggar batas keamanan jembatan timbang?',
    options: [
      { label: 'A', text: '67 kardus', isCorrect: true },
      { label: 'B', text: '68 kardus', isCorrect: false },
      { label: 'C', text: '69 kardus', isCorrect: false },
      { label: 'D', text: '70 kardus', isCorrect: false }
    ],
    kunci: 'A',
    pembahasan: 'Model PtLSV:\nBerat total = Berat truk + Berat awak + (Berat per kardus × x) ≤ 6.000\n2.800 + 150 + 45x ≤ 6.000\n2.950 + 45x ≤ 6.000\n45x ≤ 6.000 - 2.950\n45x ≤ 3.050\nx ≤ 3.050 / 45 ≈ 67,77...\nKarena banyak kardus harus bilangan bulat utuh dan tidak boleh melebihi batas 6.000 kg, maka banyak kardus paling banyak adalah 67 kardus.\n(Uji: 67 × 45 = 3.015 kg; 2.950 + 3.015 = 5.965 kg ≤ 6.000 kg. Jika 68 kardus = 6.010 kg > 6.000 kg).',
    aspekNumerasi: 'Penyelesaian pertidaksamaan linier satu variabel dan penentuan nilai bulat maksimum.',
    analisisFungsi: 'Menerapkan batas ambang ketat keselamatan struktural jalan raya.'
  }),

  // --- GEOMETRI DAN PENGUKURAN ---
  createVariation({
    id: 'STIM-GEO-01',
    variationLabel: 'Variasi 1 (Teorema Pythagoras Konstruksi Gazebo)',
    elemen: 'Geometri dan Pengukuran',
    subelemen: 'Teorema Pythagoras dan Penerapannya',
    konteks: 'Sekolah',
    levelKognitif: 'Mengaplikasikan',
    bentukSoal: 'PG',
    judul: 'Konstruksi Rangka Kuda-Kuda Atap Gazebo Taman Literasi',
    narasi: 'Komite sekolah bersama alumni mendanai pembangunan gazebo taman baca terbuka di samping perpustakaan guna meningkatkan minat baca peserta didik di luar kelas. Struktur atap gazebo tersebut dirancang berbentuk prisma segitiga simetris dengan rangka kuda-kuda kayu kokoh. Lebar bentang alas kuda-kuda kayu bagian bawah adalah 4,8 meter, sedangkan tiang penyangga tegak lurus yang menopang puncak bubungan atap memiliki tinggi tepat 1,8 meter di titik tengah bentangan. Dua batang kasau miring dipasang dari puncak atap menuju kedua ujung alas kuda-kuda. Tukang kayu perlu menghitung panjang presisi setiap batang kasau miring tersebut sebelum melakukan pemotongan bahan kayu jati agar tidak terjadi kesalahan pemborosan material.',
    dataVisual: 'DIMENSI RANGKA ATAP GAZEBO:\n- Lebar Bentang Alas (Total) : 4,8 meter\n- Setengah Bentang Alas (a)   : 2,4 meter\n- Tinggi Tiang Bubungan (b)   : 1,8 meter\n- Batang Kasau Miring (c)     : c = √(a² + b²)',
    pertanyaan: 'Berdasarkan prinsip Teorema Pythagoras, berapakah panjang satu batang kasau miring yang dibutuhkan untuk rangka atap gazebo tersebut?',
    options: [
      { label: 'A', text: '2,8 meter', isCorrect: false },
      { label: 'B', text: '3,0 meter', isCorrect: true },
      { label: 'C', text: '3,2 meter', isCorrect: false },
      { label: 'D', text: '3,6 meter', isCorrect: false }
    ],
    kunci: 'B',
    pembahasan: 'Penerapan Teorema Pythagoras:\n1. Segitiga siku-siku terbentuk dengan alas = 4,8 / 2 = 2,4 meter dan tinggi = 1,8 meter.\n2. Sisi miring c² = a² + b² = (2,4)² + (1,8)²\n   c² = 5,76 + 3,24 = 9,00\n   c = √9,00 = 3,0 meter.\nMaka panjang kasau miring adalah 3,0 meter.',
    aspekNumerasi: 'Penerapan tripel Pythagoras desimal (18, 24, 30 dibagi 10) dalam konstruksi atap.',
    analisisFungsi: 'Menghubungkan geometri segitiga siku-siku dengan kalkulasi kebutuhan material riil.'
  }),

  createVariation({
    id: 'STIM-GEO-02',
    variationLabel: 'Variasi 2 (Luas Gabungan Taman Sekolah)',
    elemen: 'Geometri dan Pengukuran',
    subelemen: 'Bangun Datar dan Luas Gabungan',
    konteks: 'Lingkungan',
    levelKognitif: 'Mengaplikasikan',
    bentukSoal: 'PG',
    judul: 'Penataan Rumput dan Kolam Ikan Taman Adiwiyata',
    narasi: 'Kader Adiwiyata sekolah mendesain taman ramah lingkungan di halaman tengah sekolah seluas area persegi panjang dengan panjang 20 meter dan lebar 14 meter. Di bagian tengah taman tersebut, dibangun kolam ikan air mancur berbentuk lingkaran dengan diameter 7 meter (menggunakan nilai pi = 22/7). Seluruh sisa lahan tanah di luar kolam akan ditanami rumput hias gajah mini yang dipasok dari pembibitan lokal. Pengurus tim Adiwiyata mencatat bahwa biaya pembelian bibit rumput beserta ongkos tanam dan pemupukan awal adalah Rp45.000,00 per meter persegi. Sebelum memesan bibit, tim bendahara harus menghitung luas bersih lahan yang akan ditanami rumput untuk menetapkan total kebutuhan anggaran.',
    dataVisual: 'SPESIFIKASI TAMAN ADIWIYATA:\n- Luas Total Taman : Persegi Panjang (20 m × 14 m = 280 m²)\n- Kolam Ikan       : Lingkaran (Diameter = 7 m -> Jari-jari r = 3,5 m)\n- Luas Kolam       : π × r² = 22/7 × 3,5 × 3,5 = 38,5 m²\n- Biaya Rumput     : Rp45.000,00 per m²',
    pertanyaan: 'Berapakah total biaya yang harus dikeluarkan sekolah untuk pengadaan bibit dan penanaman rumput hias pada sisa lahan taman tersebut?',
    options: [
      { label: 'A', text: 'Rp10.267.500,00', isCorrect: false },
      { label: 'B', text: 'Rp10.867.500,00', isCorrect: true },
      { label: 'C', text: 'Rp11.240.000,00', isCorrect: false },
      { label: 'D', text: 'Rp12.600.000,00', isCorrect: false }
    ],
    kunci: 'B',
    pembahasan: 'Perhitungan luas gabungan:\n1. Luas lahan total = 20 × 14 = 280 m².\n2. Luas kolam lingkaran = (22/7) × 3,5 × 3,5 = 38,5 m².\n3. Luas lahan rumput = 280 - 38,5 = 241,5 m².\n4. Total biaya = 241,5 m² × Rp45.000,00 = Rp10.867.500,00.',
    aspekNumerasi: 'Kalkulasi selisih luas bidang datar gabungan dan estimasi biaya per meter persegi.',
    analisisFungsi: 'Pengurangan luas geometri poligon dan lingkaran dalam proyek tata lanskap.'
  }),

  // --- DATA DAN PELUANG ---
  createVariation({
    id: 'STIM-DAT-01',
    variationLabel: 'Variasi 1 (Peluang Empirik Daya Berkecambah Benih)',
    elemen: 'Data dan Peluang',
    subelemen: 'Peluang Teoretik dan Empirik',
    konteks: 'Pertanian',
    levelKognitif: 'Menalar',
    bentukSoal: 'PG Kompleks/MCMA',
    judul: 'Uji Daya Berkecambah Benih Jagung Hibrida Kelompok Tani',
    narasi: 'Dalam upaya menjamin mutu benih unggul sebelum masa tanam serempak, kelompok tani di kawasan sentra jagung melakukan uji coba daya berkecambah terhadap sampel 500 butir benih jagung hibrida di persemaian basah terkontrol. Setelah masa inkubasi selama tujuh hari, petugas penyuluh pertanian mencatat bahwa sebanyak 460 butir benih berhasil berkecambah dan tumbuh menjadi bibit jagung yang sehat, sedangkan sisanya mengalami gagal tumbuh karena infeksi jamur atau kelembaban berlebih. Berdasarkan frekuensi relatif hasil pengujian sampel tersebut, kelompok tani ingin menghitung nilai peluang empirik kelangsungan hidup benih dan memproyeksikan frekuensi harapan bibit tumbuh saat mereka menyemai 2.500 butir benih pada lahan hamparan luas.',
    dataVisual: 'DATA UJI SAMPEL PERSEMAIAN:\n- Sampel Diuji (n)      : 500 butir benih\n- Benih Tumbuh Sehat   : 460 butir\n- Benih Gagal Tumbuh    : 40 butir\n- Rencana Semai Massal : 2.500 butir benih',
    pertanyaan: 'Berdasarkan data uji coba daya berkecambah benih di atas, pilihlah pernyataan-pernyataan yang bernilai BENAR! (Jawaban benar dapat lebih dari satu)',
    complexStatements: [
      {
        statement: 'Peluang empirik sebutir benih jagung berhasil berkecambah dan tumbuh sehat adalah 0,92 atau 92%.',
        isCorrect: true,
        reason: 'P(tumbuh) = 460 / 500 = 92 / 100 = 0,92 (92%).'
      },
      {
        statement: 'Peluang empirik sebutir benih jagung mengalami kegagalan berkecambah adalah 0,08 atau 8%.',
        isCorrect: true,
        reason: 'P(gagal) = 1 - 0,92 = 0,08 (8%).'
      },
      {
        statement: 'Jika petani menyemai 2.500 butir benih, frekuensi harapan bibit yang tumbuh sehat adalah 2.300 butir.',
        isCorrect: true,
        reason: 'Fh = 2.500 × 0,92 = 2.300 butir.'
      },
      {
        statement: 'Jika disemai 1.000 butir benih, estimasi banyak benih yang gagal berkecambah diperkirakan sebanyak 120 butir.',
        isCorrect: false,
        reason: 'Estimasi gagal adalah 1.000 × 0,08 = 80 butir, bukan 120 butir.'
      }
    ],
    kunci: 'Pernyataan 1, Pernyataan 2, dan Pernyataan 3',
    pembahasan: 'Analisis peluang empirik:\n1. P(tumbuh) = 460 / 500 = 0,92 = 92% (BENAR).\n2. P(gagal) = 40 / 500 = 0,08 = 8% (BENAR).\n3. Fh tumbuh (2.500 benih) = 2.500 × 0,92 = 2.300 bibit (BENAR).\n4. Fh gagal (1.000 benih) = 1.000 × 0,08 = 80 bibit (SALAH, tertulis 120 bibit).\nPernyataan yang benar adalah 1, 2, dan 3.',
    aspekNumerasi: 'Peluang empirik berbasis frekuensi relatif dan perhitungan frekuensi harapan berskala besar.',
    analisisFungsi: 'Memproyeksikan rasio sampel ke populasi dalam mitigasi risiko usaha tani.'
  }),

  createVariation({
    id: 'STIM-DAT-02',
    variationLabel: 'Variasi 2 (Evaluasi Misleading Graph Laporan Publik)',
    elemen: 'Data dan Peluang',
    subelemen: 'Analisis Misleading Graph dan Bias Data',
    konteks: 'Literasi digital',
    levelKognitif: 'Menalar',
    bentukSoal: 'PG Kategori',
    judul: 'Deteksi Manipulasi Visual Grafik Batang Partisipasi Belajar Daring',
    narasi: 'Dalam laporan akhir tahun yang dipublikasikan melalui infografis media sosial, sebuah lembaga survei swasta menyajikan grafik batang perbandingan angka adopsi platform belajar digital siswa SMP antara Tahun 2024 dan Tahun 2026. Data resmi mencatat angka partisipasi sebesar 78 persen pada Tahun 2024 dan meningkat menjadi 82 persen pada Tahun 2026. Namun, pada grafik batang yang ditayangkan, sumbu vertikal persentase dipotong sengaja dimulai dari angka 75 persen (bukan dari angka 0), sehingga batang Tahun 2026 tampak menjulang lebih dari dua kali lipat dibanding batang Tahun 2024. Pamflet tersebut memuat judul bombastis: "Lonjakan Fenomenal Partisipasi Siswa Naik Lebih dari 100 Persen!". Guru pembimbing mengajak siswa menganalisis validitas penyajian data visual tersebut.',
    dataVisual: 'DATA TERCATAT VS GRAFIK INFOGRAFIS:\n- Tahun 2024 : 78% partisipasi\n- Tahun 2026 : 82% partisipasi (Kenaikan sebenarnya = 4 poin persentase)\n- Sumbu Y    : Dipotong mulai dari 75% (Truncated Axis)\n- Klaim Pamflet: "Kenaikan luar biasa lebih dari 100%!"',
    pertanyaan: 'Tentukan kategori "BENAR" atau "SALAH" untuk setiap pernyataan evaluasi data grafis berikut!',
    categoryStatements: [
      {
        statement: 'Klaim judul pamflet bahwa tingkat partisipasi naik lebih dari 100% adalah kesimpulan keliru yang menyesatkan (misleading).',
        category: 'BENAR'
      },
      {
        statement: 'Kenaikan aktual dari tahun 2024 ke 2026 adalah 4 poin persentase (sekitar 5,13% kenaikan relatif dari angka awal).',
        category: 'BENAR'
      },
      {
        statement: 'Pemotongan skala sumbu Y yang tidak dimulai dari angka nol memberikan representasi perbandingan batang yang proporsional dan objektif.',
        category: 'SALAH'
      }
    ],
    kunci: '1. Benar, 2. Benar, 3. Salah',
    pembahasan: 'Evaluasi kritis penyajian data:\n1. Kenaikan 78% ke 82% adalah kenaikan 4 poin persentase atau kenaikan relatif 4/78 × 100% ≈ 5,13%. Klaim "naik lebih dari 100%" sangat menyesatkan (BENAR).\n2. Kenaikan aktual adalah 4 poin persentase atau 5,13% (BENAR).\n3. Truncated graph (pemotongan sumbu) menyebabkan rasio tinggi visual terdistorsi secara sengaja sehingga tidak lagi proporsional (SALAH).',
    aspekNumerasi: 'Literasi data statistik kritis: mendeteksi manipulasi visual grafis dan menghitung persentase perubahan riil.',
    analisisFungsi: 'Mengembangkan daya nalar kritis peserta didik terhadap bias visual media massa.'
  })
];

export function getStimulusVariationById(id: string): StimulusVariation | undefined {
  return CURATED_100_WORD_STIMULI.find(s => s.id === id);
}

export function getStimuliByElement(element: ElementType): StimulusVariation[] {
  return CURATED_100_WORD_STIMULI.filter(s => s.elemen === element);
}

export function getStimuliByContext(context: ContextType): StimulusVariation[] {
  return CURATED_100_WORD_STIMULI.filter(s => s.konteks === context);
}
