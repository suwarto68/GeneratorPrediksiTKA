export type ElementType = 'Bilangan' | 'Aljabar' | 'Geometri dan Pengukuran' | 'Data dan Peluang';

export type CognitiveLevel = 'Memahami' | 'Mengaplikasikan' | 'Menalar';

export type QuestionForm = 'PG' | 'PG Kompleks/MCMA' | 'PG Kategori';

export type PredictivePriority = 'Prioritas Tinggi' | 'Prioritas Menengah' | 'Prioritas Pengayaan';

export type PredictionMode = 'Konservatif' | 'Seimbang' | 'Eksploratif';

export type DistributionMode = 'Otomatis' | 'Mengikuti baseline 2026' | 'Manual';

export type StimulusType = 
  | 'Teks' 
  | 'Tabel' 
  | 'Grafik' 
  | 'Diagram' 
  | 'Infografis' 
  | 'Peta Sederhana' 
  | 'Denah' 
  | 'Data Numerik' 
  | 'Kombinasi';

export type ContextType =
  | 'Kehidupan sehari-hari'
  | 'Sekolah'
  | 'Lingkungan'
  | 'Teknologi'
  | 'Transportasi'
  | 'Ekonomi'
  | 'UMKM'
  | 'Pertanian'
  | 'Energi'
  | 'Kesehatan masyarakat'
  | 'Data lingkungan'
  | 'Infrastruktur'
  | 'Literasi digital'
  | 'Fenomena sosial';

export interface AssessmentItem {
  id: string;
  no: number;
  tahun: number;
  jenjang: string;
  fase: string;
  mata_pelajaran: string;
  elemen: ElementType;
  subelemen: string;
  kompetensi: string;
  indikator_prediktif: string;
  level_kognitif: CognitiveLevel;
  bentuk_soal: QuestionForm;
  stimulus: StimulusType;
  konteks: ContextType;
  prioritas_prediktif: PredictivePriority;
  skor_prediksi: number; // 0 - 100
  alasan: string;
  sumber_acuan: string;
  status_label: 'Data Sumber' | 'Analisis' | 'Prediksi' | 'Inferensi/Analisis';
  kemampuan_numerasi?: string;
  potensi_visual?: string;
}

export interface QuestionData {
  id: string;
  item_id?: string;
  elemen: ElementType;
  subelemen: string;
  indikator: string;
  level_kognitif: CognitiveLevel;
  bentuk_soal: QuestionForm;
  konteks: ContextType;
  stimulus_type: StimulusType;
  stimulus_text: string;
  stimulus_data?: string; // tables or description of chart
  pertanyaan: string;
  // For PG
  options?: { label: string; text: string; isCorrect: boolean }[];
  // For PG Kompleks
  complex_statements?: { statement: string; isCorrect: boolean; reason?: string }[];
  // For PG Kategori
  category_statements?: { statement: string; category: string }[];
  kunci: string;
  pembahasan: string;
  aspek_numerasi: string;
}

export interface ValidationCheck {
  criterion: string;
  passed: boolean;
  status: 'Pass' | 'Warning' | 'Fail';
  note: string;
}

export interface ValidationResult {
  id: string;
  question_id: string;
  status: 'LAYAK' | 'PERLU REVISI' | 'TIDAK LAYAK';
  score: number; // 0-100
  summary: string;
  checks: ValidationCheck[];
  recommendations: string[];
}

export interface InfographicPrompt {
  id: string;
  item_id: string;
  judul: string;
  tujuan_visual: string;
  elemen_visual: string;
  data: string;
  label: string;
  warna: string;
  komposisi: string;
  rasio: '16:9' | 'A4' | '1:1';
  larangan: string[];
  informasi_tampak: string;
  full_prompt_text: string;
}

export interface ComparisonAspect {
  aspek: string;
  acuan_2026: string;
  prediksi_2027: string;
  perubahan: string;
  alasan: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  extractedText: string;
  detectedCount: number;
  status: 'Terekstraksi' | 'Proses' | 'Gagal';
  sourceTag: string;
}

export interface PredictionConfig {
  jenjang: string;
  fase: string;
  mataPelajaran: string;
  tahunTarget: number;
  jumlahSoal: number;
  sources: {
    kisiKisi2026: boolean;
    soalTka2026: boolean;
    kerangkaAsesmen: boolean;
    dokumenPengguna: boolean;
  };
  modePrediksi: PredictionMode;
  distribusiMateriMode: DistributionMode;
  customDistribution: {
    bilangan: number; // percentage
    aljabar: number;
    geometri: number;
    dataPeluang: number;
  };
  customCognitive: {
    memahami: number;
    mengaplikasikan: number;
    menalar: number;
  };
  customForms: {
    pg: number;
    pgKompleks: number;
    pgKategori: number;
  };
  allowedStimuli: StimulusType[];
}
