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
  Download,
  Compass, 
  Sliders, 
  AlignLeft, 
  FileCheck2 
} from 'lucide-react';
import { ContextType, StimulusType, ElementType } from '../types';
import { exportStimulusToWord } from '../services/exportService';
import { CURATED_100_WORD_STIMULI } from '../data/curated100WordStimuli';

export const StimulusGeneratorView: React.FC = () => {
  const [selectedContext, setSelectedContext] = useState<ContextType>('UMKM');
  const [selectedStimulusType, setSelectedStimulusType] = useState<StimulusType>('Teks');
  const [selectedElement, setSelectedElement] = useState<ElementType>('Aljabar');
  const [targetWordCountMode, setTargetWordCountMode] = useState<'standar' | 'ringkas' | 'ekspansif'>('standar'); // standar = ~100 kata
  
  const [generatedStimulus, setGeneratedStimulus] = useState<{
    judul: string;
    narasi: string;
    dataVisual: string;
    analisisFungsi: string;
    relevansiNumerasi: string;
    wordCount: number;
  } | null>(null);

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const contextCatalog: { id: ContextType; desc: string; icon: string }[] = [
    { id: 'UMKM', desc: 'Katering rumahan, pesanan paket kue, kalkulasi modal & titik impas', icon: '🛍️' },
    { id: 'Kehidupan sehari-hari', desc: 'Rencana belanja mingguan, tagihan utilitas rumah, pembagian porsi', icon: '🏠' },
    { id: 'Sekolah', desc: 'Renovasi lapangan olahraga, pengecatan fasilitas, kas OSIS', icon: '🏫' },
    { id: 'Lingkungan', desc: 'Timbulan sampah organik, konservasi mata air, reboisasi mangrove pesisir', icon: '🌱' },
    { id: 'Teknologi', desc: 'Kapasitas baterai IoT, kecepatan transfer data internet, durasi daya simpan', icon: '💻' },
    { id: 'Transportasi', desc: 'Ketepatan waktu bus komuter, konsumsi bahan bakar, selisih jam sibuk', icon: '🚆' },
    { id: 'Ekonomi', desc: 'Pengelolaan anggaran keluarga, alokasi tabungan, realokasi biaya darurat', icon: '💰' },
    { id: 'Pertanian', desc: 'Sistem irigasi tetes, takaran pupuk NPK berimbang, hasil panen jagung', icon: '🌾' },
    { id: 'Energi', desc: 'Instalasi panel surya sekolah, serapan radiasi matahari, penghematan kWh', icon: '⚡' },
    { id: 'Kesehatan masyarakat', desc: 'Skrining indeks massa tubuh (IMT), status gizi siswa, pola hidup sehat', icon: '🏥' },
    { id: 'Data lingkungan', desc: 'Konsentrasi polutan partikulat PM2.5, pemantauan emisi industri', icon: '📊' },
    { id: 'Infrastruktur', desc: 'Uji beban konstruksi jembatan, lendutan gelagar baja, tonase batas aman', icon: '🏗️' },
    { id: 'Literasi digital', desc: 'Survei screen time gawai, keamanan kata sandi, etika komunikasi siber', icon: '📱' },
    { id: 'Fenomena sosial', desc: 'Penyaluran logistik bencana banjir, pengemasan paket sembako adil', icon: '🤝' },
  ];

  // Helper function to count words accurately
  const countWords = (str: string): number => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  // 14 Curated 100-Word Contextual Text Stimuli (~95-105 words)
  const TEXT_STIMULI_100_WORDS: Record<ContextType, { narasi: string; dataVisual: string; analisis: string; numerasi: string }> = {
    'UMKM': {
      narasi: `Ibu Aminah mengelola usaha kue tradisional UMKM "Rasa Nusantara" di sentra kuliner kota. Untuk memenuhi lonjakan pesanan hantaran pesta pernikahan pada akhir pekan, ia memproduksi dua varian paket kue unggulan, yaitu Paket Melati dan Paket Mawar. Setiap paket membutuhkan kombinasi bahan baku tepung beras khusus dan gula aren murni. Pada hari Jumat, ia menggunakan persediaan 14 kg tepung dan 8 kg gula aren untuk menghasilkan 20 Paket Melati dan 15 Paket Mawar tanpa ada sisa bahan. Pada hari Sabtu, dengan pasokan baru sebanyak 22 kg tepung dan 12 kg gula aren, ia berhasil memproduksi 30 Paket Melati dan 25 Paket Mawar secara optimal.`,
      dataVisual: `REKAPITULASI PENGGUNAAN BAHAN BAKU:\n- Jumat : 20 Paket Melati + 15 Paket Mawar = 14 kg tepung & 8 kg gula aren\n- Sabtu : 30 Paket Melati + 25 Paket Mawar = 22 kg tepung & 12 kg gula aren\n- Harga Jual : Paket Melati Rp45.000,00 | Paket Mawar Rp35.000,00`,
      analisis: `Stimulus teks naratif ~100 kata ini memuat sistem persamaan linear dua variabel (SPLDV) yang terintegrasi secara utuh dalam alur cerita bisnis UMKM nyata tanpa kalimat mubazir.`,
      numerasi: `Menyusun dan menyelesaikan SPLDV untuk menentukan takaran tepung per paket kue dan memproyeksikan laba kotor.`
    },
    'Kehidupan sehari-hari': {
      narasi: `Setiap awal pekan, keluarga Ibu Dewi membuat daftar belanja kebutuhan dapur mingguan di pasar tradisional guna mengendalikan pengeluaran belanja rumah tangga secara terencana. Pada kunjungan belanja hari Minggu pertama, Ibu Dewi membeli 4 kilogram telur ayam negeri dan 3 kilogram daging ayam potong segar dengan total pembayaran sebesar Rp154.000,00. Pada pekan berikutnya ketika anggota keluarga bertambah karena ada tamu kerabat berkunjung, ia menambah volume belanja menjadi 5 kilogram telur ayam dan 4 kilogram daging ayam dengan harga per kilogram yang belum mengalami perubahan, sehingga total belanjanya adalah Rp198.000,00. Ibu Dewi ingin mengetahui harga pasti satu kilogram telur dan daging.`,
      dataVisual: `CATATAN BELANJA PASAR TRADISIONAL:\n- Pekan I  : 4 kg telur + 3 kg daging ayam = Rp154.000,00\n- Pekan II : 5 kg telur + 4 kg daging ayam = Rp198.000,00\n- Satuan   : Kilogram (kg) & Rupiah (Rp)`,
      analisis: `Menyajikan permasalahan belanja harian keluarga berukuran tepat 100 kata dengan variabel harga satuan yang harus dicari melalui metode eliminasi matematika.`,
      numerasi: `Menghitung harga satuan per kilogram komoditas pangan pokok melalui pemodelan matematika dua variabel.`
    },
    'Sekolah': {
      narasi: `Dalam rangka revitalisasi fasilitas olahraga dan peningkatan kebugaran peserta didik, pihak SMP Harapan Bangsa merencanakan perbaikan lapangan serbaguna di halaman utama sekolah. Lapangan tersebut memiliki bentuk dasar persegi panjang berukuran panjang 26 meter dan lebar 14 meter. Pihak komite sekolah berencana mengecat ulang seluruh permukaan lapangan dengan cat antiselip khusus berstandar nasional, sekaligus memasang garis pembatas lapangan futsal dan bola voli. Sebelum pekerjaan dimulai, tim teknis sarana prasarana melakukan pengukuran luas bidang yang membutuhkan pelapisan primer ganda serta menghitung keliling lintasan luar guna memperkirakan kebutuhan material cat pelindung secara akurat agar sesuai dengan alokasi anggaran dana BOS.`,
      dataVisual: `SPESIFIKASI TEKNIS LAPANGAN SEKOLAH:\n- Bentuk Dasar : Persegi Panjang (Panjang = 26 m, Lebar = 14 m)\n- Daya Sebar Cat : 1 kaleng (5 kg) menutup area 28 m²\n- Biaya Cat     : Rp185.000,00 per kaleng`,
      analisis: `Teks naratif ~100 kata yang memberikan data dimensi bangun datar geometri serta parameter daya sebar material untuk kalkulasi operasional sarana sekolah.`,
      numerasi: `Menghitung luas dan keliling bidang datar gabungan serta mengestimasi volume kaleng cat yang wajib dibeli.`
    },
    'Lingkungan': {
      narasi: `Komunitas peduli lingkungan di kawasan pesisir menginisiasi program penanaman bibit mangrove untuk mencegah abrasi pantai dan memulihkan ekosistem muara sungai. Pada tahap awal pemulihan, tim relawan memetakan area konservasi seluas 2,4 hektar yang dibagi menjadi beberapa zona tanam berbentuk petak teratur. Setiap petak membutuhkan kerapatan tanam tertentu agar bibit bakau muda dapat saling menopang saat diterjang ombak pasang laut. Berdasarkan catatan inventarisasi lapangan, kelompok relawan berhasil menanam 450 bibit pada hari pertama dengan tingkat kelangsungan hidup 92%. Data perkembangan mingguan dipantau secara berkala untuk mengevaluasi laju pertumbuhan akar dan menghitung kebutuhan sulaman bibit pengganti bagi tanaman yang hanyut.`,
      dataVisual: `DATA KONSERVASI MANGROVE PESISIR:\n- Luas Kawasan : 2,4 Hektar (24.000 m²)\n- Kerapatan     : 1 bibit per 4 m² area tanam\n- Tingkat Hidup : 92% dari 450 bibit hari pertama`,
      analisis: `Menyajikan data konversi satuan luas hektar ke meter persegi dan kalkulasi proporsi persentase survival bibit pohon dalam narasi ~100 kata.`,
      numerasi: `Konversi luas metrik (hektar ke m²), perhitungan persentase kelangsungan hidup, dan estimasi rasio kebutuhan bibit.`
    },
    'Teknologi': {
      narasi: `Sebuah tim riset rekayasa gawai di laboratorium sains terapan sedang menguji efisiensi daya baterai pada purwarupa sensor pintar pemantau kualitas udara berbasis IoT. Perangkat ini dirancang beroperasi tanpa henti menggunakan baterai berdaya simpan 4.800 mAh yang terhubung dengan modul transmisi nirkabel berdaya rendah. Dalam kondisi pemantauan siaga normal, sensor mengonsumsi arus listrik rata-rata sebesar 35 mA setiap jam. Namun, ketika sensor mendeteksi peningkatan konsentrasi polutan dan mengunggah paket data analitik ke server komputasi awan setiap lima belas menit sekali, konsumsi arus listrik meningkat menjadi 75 mA. Tim pengembang perlu memodelkan daya tahan total baterai hingga tetapan ambang batas kritis.`,
      dataVisual: `PROFIL KONSUMSI ARUS SENSOR CERDAS:\n- Kapasitas Baterai : 4.800 mAh\n- Mode Normal (Siaga) : 35 mA per jam\n- Mode Transmisi IoT   : 75 mA per jam\n- Batas Aman Baterai   : 15% kapasitas tersisa`,
      analisis: `Teks stimulus ~100 kata yang menstimulasi siswa membaca laju pengosongan baterai dan merumuskan model fungsi aljabar linier piecewise.`,
      numerasi: `Merumuskan persamaan penurunan kapasitas baterai f(t) = C - it dan menghitung estimasi jam operasional perangkat.`
    },
    'Transportasi': {
      narasi: `Dinas Perhubungan kota madya mengevaluasi ketepatan waktu operasional armada bus rapid transit (BRT) pada koridor utama penghubung kawasan permukiman dan pusat perkantoran terpadu. Berdasarkan data sistem pelacak GPS terintegrasi selama hari kerja, rata-rata kecepatan tempuh bus pada jam sibuk pagi hari adalah 24 km/jam akibat kepadatan arus lalu lintas. Sementara itu, pada jam tidak sibuk di siang hari, kecepatan rata-rata meningkat menjadi 40 km/jam. Jarak rute bolak-balik dari terminal keberangkatan ke pusat kota adalah 18 kilometer. Petugas pemantau lalu lintas menganalisis selisih waktu tempuh perjalanan antara kedua kondisi tersebut guna menentukan interval jadwal keberangkatan armada secara efisien.`,
      dataVisual: `TABEL KECEPATAN & JARAK TEMPUH BRT:\n- Jarak Lintasan : 18 km sekali jalan\n- Jam Sibuk      : v1 = 24 km/jam\n- Jam Lengang    : v2 = 40 km/jam\n- Rumus Dasar    : Waktu t = Jarak s / Kecepatan v`,
      analisis: `Narasi teks ~100 kata yang menghubungkan besaran jarak, kecepatan, dan waktu tempuh transportasi umum dengan konversi menit.`,
      numerasi: `Menghitung selisih waktu tempuh (t1 - t2) dalam satuan menit dan menentukan rasio perbandingan kecepatan.`
    },
    'Ekonomi': {
      narasi: `Keluarga Pak Handoko mengelola perencanaan keuangan bulanan secara disiplin dengan menerapkan metode pembagian pos anggaran proporsional setelah menerima penghasilan tetap sebesar Rp7.200.000,00. Sesuai kesepakatan bersama, sebesar 50% dari total penghasilan dialokasikan untuk kebutuhan pokok rumah tangga, 20% disisihkan untuk tabungan pendidikan anak dan dana darurat di bank syariah, 20% untuk cicilan tempat tinggal, serta sisanya untuk pos sosial dan rekreasi keluarga. Pada bulan ini, terdapat pengeluaran tambahan untuk perbaikan atap rumah sehingga pos kebutuhan pokok membengkak sebesar 15% dari alokasi awal. Pak Handoko harus merealokasi pos anggaran lain secara seimbang tanpa mengurangi target tabungan pendidikan.`,
      dataVisual: `KOMPOSISI ALOKASI PENGHASILAN BULANAN:\n- Total Gaji     : Rp7.200.000,00\n- Pokok (50%)    : Rp3.600.000,00 (+15% ekstra)\n- Tabungan (20%) : Rp1.440.000,00 (tetap dipertahankan)\n- Cicilan (20%)  : Rp1.440.000,00 | Sisa Rekreasi (10%): Rp720.000,00`,
      analisis: `Stimulus teks ~100 kata yang memadukan literasi finansial keluarga dan persentase alokasi dana secara sistematis.`,
      numerasi: `Kalkulasi persentase bersusun, nominal penambahan biaya, dan redistribusi anggaran sisa.`
    },
    'Pertanian': {
      narasi: `Kelompok Tani Makmur di daerah lumbung pangan menerapkan teknik pemupukan berimbang dan sistem pengairan irigasi tetes modern untuk meningkatkan produktivitas panen jagung hibrida di lahan seluas 1,5 hektar. Menurut anjuran penyuluh pertanian lapangan, tanaman jagung membutuhkan rasio takaran pupuk nitrogen (N), fosfor (P), dan kalium (K) dengan perbandingan tertentu pada setiap fase vegetatif dan generatif pertumbuhan. Pada pemupukan dasar pertama, petani menaburkan 120 kg pupuk urea dan 80 kg pupuk NPK secara merata. Menjelang fase pembungaan, debit air pengairan ditingkatkan dari 4.000 liter per hektar menjadi 6.500 liter per hektar guna memastikan proses pengisian bulir jagung berlangsung maksimal.`,
      dataVisual: `DATA TEKNIS LAHAN PERTANIAN JAGUNG:\n- Luas Lahan       : 1,5 Hektar\n- Pemupukan Awal   : 120 kg Urea + 80 kg NPK\n- Laju Debit Air   : 4.000 L/ha ditingkatkan ke 6.500 L/ha\n- Estimasi Panen   : 7,5 ton per hektar`,
      analisis: `Teks naratif ~100 kata dengan takaran pupuk rasional dan debit air per hektar yang menguji kemampuan proporsi perbandingan senilai.`,
      numerasi: `Menghitung total volume kebutuhan air dan pupuk untuk seluruh luas lahan 1,5 hektar.`
    },
    'Energi': {
      narasi: `Dalam upaya mewujudkan sekolah ramah lingkungan dan hemat energi, SMP Negeri 2 memasang instalasi panel surya fotovoltaik on-grid di atap gedung laboratorium sains. Rangkaian panel surya tersebut terdiri dari 18 unit modul panel dengan kapasitas daya terpasang masing-masing sebesar 400 Watt-peak. Selama musim kemarau, sistem ini mampu menyerap radiasi sinar matahari efektif rata-rata selama 5 jam per hari. Energi listrik ramah lingkungan yang diproduksi setiap hari disalurkan langsung untuk menyalakan perangkat komputer, proyektor ruang kelas, dan pompa air sirkulasi. Pengelola sarana mencatat total penghematan tagihan listrik bulanan serta menghitung titik impas investasi biaya instalasi.`,
      dataVisual: `DATA INSTALASI PEMBANGKIT SURYA:\n- Modul Terpasang : 18 unit panel surya\n- Daya Satuan     : 400 Watt-peak (Wp)\n- Waktu Efektif   : 5 jam penyinaran surya per hari\n- Tarif Listrik   : Rp1.444,70 per kWh (1 kWh = 1.000 Wh)`,
      analisis: `Narasi teks berukuran ~100 kata yang mengaitkan teknologi energi terbarukan dengan konversi satuan daya listrik Watt ke kilowatt-jam (kWh).`,
      numerasi: `Menghitung total energi listrik harian (Wh = Daya x Waktu), konversi ke kWh, dan penghematan biaya listrik bulanan.`
    },
    'Kesehatan masyarakat': {
      narasi: `Puskesmas Kecamatan menyelenggarakan program survei skrining kebugaran jasmani dan pemantauan status gizi berkala bagi 240 siswa kelas VII di wilayah kerjanya. Petugas kesehatan mengukur tinggi badan, berat badan, serta denyut nadi istirahat guna menghitung nilai Indeks Massa Tubuh (IMT) masing-masing peserta didik. Berdasarkan hasil pengolahan data awal, ditemukan bahwa 15% siswa berada dalam kategori berat badan kurang, 65% siswa berada dalam rentang berat badan normal ideal, dan sisanya tergolong kategori berat badan berlebih. Tim dokter puskesmas merancang program intervensi edukasi gizi seimbang serta panduan menu sarapan sehat untuk memulihkan proporsi berat badan siswa ke rentang sehat.`,
      dataVisual: `HASIL SKRINING GIZI PUSKESMAS:\n- Populasi Sampel  : 240 siswa kelas VII\n- Gizi Kurang      : 15% (36 siswa)\n- Gizi Normal      : 65% (156 siswa)\n- Gizi Berlebih    : Sisa persentase (20% = 48 siswa)`,
      analisis: `Stimulus teks ~100 kata bertema kesehatan masyarakat yang memuat data frekuensi persentase kelompok data statistik.`,
      numerasi: `Mengonversi data persentase menjadi frekuensi absolut dan menganalisis diagram lingkaran status gizi.`
    },
    'Data lingkungan': {
      narasi: `Stasiun Pemantau Kualitas Udara Otomatis (SPKU) mencatat fluktuasi konsentrasi partikulat halus PM2.5 di sekitar kawasan industri dan jalan protokol selama sepekan terakhir. Pada hari Senin hingga Rabu saat aktivitas produksi pabrik dan mobilitas kendaraan angkutan barang mencapai puncaknya, rata-rata konsentrasi PM2.5 tercatat sebesar 68 mikrogram per meter kubik, yang berada dalam kategori tidak sehat bagi kelompok sensitif. Namun, setelah turun hujan deras disertai pembatasan operasional armada truk berat pada akhir pekan, konsentrasi partikulat polutan turun drastis hingga mencapai 28 mikrogram per meter kubik. Dinas Lingkungan Hidup menganalisis laju penurunan tersebut untuk mengevaluasi efektivitas kebijakan pengendalian emisi.`,
      dataVisual: `DATA KONSENTRASI PARTIKULAT UDARA (PM2.5):\n- Awal Pekan (Senin-Rabu) : 68 µg/m³ (Kategori Tidak Sehat)\n- Akhir Pekan (Sabtu-Minggu): 28 µg/m³ (Kategori Sedang)\n- Baku Mutu Nasional       : Maksimal 15 µg/m³ rata-rata tahunan`,
      analisis: `Teks teks ilmiah populer ~100 kata yang menyajikan selisih penurunan konsentrasi polutan udara untuk analisis tren data lingkungan.`,
      numerasi: `Menghitung persentase penurunan polutan dan rata-rata laju perubahan harian.`
    },
    'Infrastruktur': {
      narasi: `Balai Pengelola Jalan Nasional melakukan pemeriksaan berkala terhadap daya dukung konstruksi jembatan penghubung antardesa yang melintasi aliran sungai berbatu deras. Jembatan baja sepanjang 48 meter tersebut memiliki batas kapasitas beban gandar maksimum sebesar 8 ton untuk setiap kendaraan yang melintas. Untuk menguji elastisitas dan lendutan bentang utama jembatan terhadap beban dinamis, tim insinyur menempatkan sejumlah sensor regangan presisi tinggi di lima titik tumpuan gelagar baja. Truk penguji bermuatan terkontrol dengan variasi tonase dijalankan melintasi jembatan pada kecepatan stabil 20 km/jam. Hasil pencatatan grafik lendutan dianalisis untuk memastikan faktor keamanan struktur jembatan masih memenuhi standar teknis jalan.`,
      dataVisual: `PARAMETRIK UJI BEBAN JEMBATAN:\n- Panjang Bentang : 48 meter (5 titik tumpuan berjarak sama)\n- Beban Maksimum  : 8 ton per gandar\n- Kecepatan Uji   : 20 km/jam\n- Toleransi Lendut: Maksimal L/800 = 60 mm`,
      analisis: `Narasi teks ~100 kata berbobot sains-rekayasa jalan dan jembatan dengan batasan pertidaksamaan beban teknis.`,
      numerasi: `Menghitung jarak antartitik tumpuan dan menguji batas ambang toleransi lendutan fraksional.`
    },
    'Literasi digital': {
      narasi: `Organisasi kesiswaan SMP mengadakan survei perilaku penggunaan media digital dan platform jejaring sosial yang melibatkan 350 responden peserta didik lintas jenjang kelas. Kuesioner daring mengumpulkan informasi mengenai durasi rata-rata waktu menatap layar (screen time) setiap hari, jenis aplikasi pembelajaran yang sering diakses, serta tingkat kesadaran terhadap keamanan kata sandi akun pribadi. Rekapitulasi survei menunjukkan bahwa rata-rata siswa menghabiskan waktu 4,5 jam per hari untuk gawai, dengan alokasi 1,5 jam untuk mengerjakan tugas sekolah dan 3 jam untuk hiburan digital. Tim konselor sekolah memanfaatkan temuan data ini untuk merancang lokakarya manajemen waktu digital sehat dan etika komunikasi siber.`,
      dataVisual: `STATISTIK SURVEI SCREEN TIME (350 Siswa):\n- Rata-rata Total : 4,5 jam per hari\n- Tugas Belajar   : 1,5 jam (33,3%)\n- Hiburan/Medsos  : 3,0 jam (66,7%)\n- Rekomendasi Medis: Maksimal 2 jam non-edukasi`,
      analisis: `Stimulus teks ~100 kata yang relevan dengan kehidupan remaja era digital, memuat data pemusatan rata-rata dan proporsi pecahan.`,
      numerasi: `Menganalisis perbandingan rasio durasi belajar vs hiburan dan menghitung akumulasi jam per minggu.`
    },
    'Fenomena sosial': {
      narasi: `Palang Merah Remaja (PMR) sekolah mengkoordinasikan aksi solidaritas penggalangan bantuan logistik sembako bagi warga masyarakat yang terdampak musibah banjir bandang di desa tetangga. Selama tiga hari posko peduli dibuka, terkumpul donasi sukarela berupa 480 kg beras kemasan, 160 liter minyak goreng, dan 720 bungkus mi instan dari para siswa dan guru. Panitia relawan bertugas mengemas ulang seluruh bantuan tersebut ke dalam paket kardus sembako keluarga dengan proporsi isi yang seragam dan adil agar tidak menimbulkan kecemburuan sosial. Mereka harus memperhitungkan jumlah paket sembako terbanyak yang dapat disusun lengkap serta menghitung sisa bahan yang belum terdistribusikan.`,
      dataVisual: `REKAPITULASI LOGISTIK BENCANA:\n- Beras        : 480 kg\n- Minyak Goreng: 160 liter\n- Mi Instan    : 720 bungkus\n- Syarat Paket : Isi seragam menggunakan konsep FPB`,
      analisis: `Teks naratif ~100 kata bertema aksi kemanusiaan sosial yang menguji konsep Faktor Persekutuan Terbesar (FPB) pembagian paket.`,
      numerasi: `Menentukan FPB dari 480, 160, dan 720 untuk mencari banyak paket kardus sembako maksimum yang terbentuk.`
    }
  };

  const handleGenerateStimulus = () => {
    let judul = `Stimulus: Kasus ${selectedContext} Berbasis ${selectedStimulusType}`;
    let template = TEXT_STIMULI_100_WORDS[selectedContext];

    if (!template) {
      template = TEXT_STIMULI_100_WORDS['UMKM'];
    }

    let narasi = template.narasi;

    // Adjust word count slightly if user explicitly toggled ringkas or ekspansif
    if (targetWordCountMode === 'ringkas') {
      // Trim slightly to ~80 words
      const words = narasi.split(/\s+/);
      narasi = words.slice(0, 80).join(' ') + '.';
    } else if (targetWordCountMode === 'ekspansif') {
      narasi = `${template.narasi} Data hasil pencatatan diverifikasi ulang oleh tim verifikator lapangan guna memastikan seluruh instrumen pengukuran memenuhi standar baku nasional tanpa deviasi angka yang berarti.`;
    }

    const words = countWords(narasi);

    setGeneratedStimulus({
      judul,
      narasi,
      dataVisual: template.dataVisual,
      analisisFungsi: template.analisis,
      relevansiNumerasi: template.numerasi,
      wordCount: words
    });
  };

  const handleCopy = () => {
    if (!generatedStimulus) return;
    const text = `
${generatedStimulus.judul}
[PANJANG STIMULUS: ${generatedStimulus.wordCount} KATA (STANDAR ~100 KATA)]

[NARASI STIMULUS TEKS]
${generatedStimulus.narasi}

[DATA REKAPITULASI ESENSIAL]
${generatedStimulus.dataVisual}

[FUNGSI MATEMATIS]
${generatedStimulus.analisisFungsi}

[KEMAMPUAN LITERASI NUMERASI]
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
          Konteks berfungsi sebagai penyedia stimulus matematika esensial dengan panjang stimulus teks terkalibrasi <strong>kurang lebih 100 kata</strong> (standar asesmen SMP Fase D: 90–110 kata).
        </p>

        {/* Highlight Banner: Standar Stimulus Teks ~100 Kata */}
        <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-lg flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-900">
            <AlignLeft className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Kaidah Stimulus Teks Fase D:</strong> Panjang narasi ideal adalah <strong>kurang lebih 100 kata</strong> agar memuat konteks dan angka esensial tanpa membebani daya baca kognitif siswa.
            </span>
          </div>
          <span className="font-bold text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-200 shrink-0 shadow-2xs">
            Target: ~100 Kata
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: 14 Contexts & Stimulus selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">Pilih 14 Ragam Konteks Asesmen</h2>
            <span className="text-[11px] text-slate-400">Tersedia narasi teks presisi ~100 kata</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
            {contextCatalog.map(ctx => (
              <div
                key={ctx.id}
                onClick={() => setSelectedContext(ctx.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedContext === ctx.id
                    ? 'border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-950 ring-1 ring-indigo-500'
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
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-xs text-slate-700">Tipe Stimulus</label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {selectedStimulusType === 'Teks' ? 'Teks ~100 Kata' : selectedStimulusType}
                </span>
              </div>
              <select
                value={selectedStimulusType}
                onChange={(e) => setSelectedStimulusType(e.target.value as StimulusType)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
              >
                <option value="Teks">Teks (Narasi Kurang Lebih 100 Kata)</option>
                <option value="Tabel">Tabel + Narasi Konteks</option>
                <option value="Grafik">Grafik Tren + Narasi</option>
                <option value="Diagram">Diagram Teknis + Narasi</option>
                <option value="Infografis">Infografis Multimodal</option>
                <option value="Denah">Denah / Peta Berskala</option>
                <option value="Data Numerik">Data Numerik Spesifik</option>
              </select>
            </div>

            {/* Target Word Count Preset Selector */}
            <div>
              <label className="font-semibold text-xs text-slate-700 block mb-1">
                Kalibrasi Panjang Stimulus Teks:
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'ringkas', label: 'Ringkas', words: '~80 kata' },
                  { id: 'standar', label: 'Standar', words: '~100 kata' },
                  { id: 'ekspansif', label: 'Luas', words: '~120 kata' },
                ].map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setTargetWordCountMode(preset.id as any)}
                    className={`py-1.5 px-1 text-center rounded-lg border text-xs transition-all ${
                      targetWordCountMode === preset.id
                        ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px]">{preset.label}</span>
                    <span className="text-[9px] opacity-80 block">{preset.words}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-xs text-slate-700 block mb-1">Elemen Materi Terkait</label>
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
              <span>GENERATE STIMULUS TEKS (~100 KATA)</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Output preview */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Hasil Rekayasa Stimulus Matematika Kontekstual
              </h2>
              {generatedStimulus && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">
                    Konteks: <strong>{selectedContext}</strong>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                    generatedStimulus.wordCount >= 90 && generatedStimulus.wordCount <= 110
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Panjang Teks: {generatedStimulus.wordCount} Kata (Standar ~100 Kata ✓)
                  </span>
                </div>
              )}
            </div>

            {generatedStimulus && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportStimulusToWord({
                    judul: generatedStimulus.judul,
                    narasi: generatedStimulus.narasi,
                    dataVisual: generatedStimulus.dataVisual,
                    analisisFungsi: generatedStimulus.analisisFungsi,
                    relevansiNumerasi: generatedStimulus.relevansiNumerasi,
                    wordCount: generatedStimulus.wordCount,
                    konteks: selectedContext,
                    elemen: selectedElement
                  })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-200 transition-colors"
                  title="Unduh stimulus ini ke format Word / Docs (.doc)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Docs (.doc)</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedSuccess ? 'Tersalin' : 'Salin Stimulus'}</span>
                </button>
              </div>
            )}
          </div>

          {!generatedStimulus ? (
            <div className="py-20 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pilih konteks dari 14 ragam pilihan di samping dan klik <strong>"GENERATE STIMULUS TEKS (~100 KATA)"</strong> untuk memproduksi narasi terkalibrasi kurang lebih 100 kata yang siap digunakan pada naskah soal.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Kotak Narasi Utama (~100 Kata) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {generatedStimulus.judul}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {generatedStimulus.wordCount} kata
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed font-normal text-xs sm:text-[13px] bg-white p-3 rounded-lg border border-slate-200">
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
