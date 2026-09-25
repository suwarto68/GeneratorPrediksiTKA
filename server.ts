import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to check if Gemini is configured
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
const ai = hasGeminiKey ? new GoogleGenAI() : null;

// Health & Status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: hasGeminiKey,
    app: 'PREDIKSI KISI-KISI TKA MATEMATIKA SMP 2027',
  });
});

// Endpoint: AI Document Analysis / Parsing assistance
app.post('/api/ai/analyze-document', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server secrets.' });
  }

  const { content, documentTitle } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Konten dokumen kosong.' });
  }

  try {
    const prompt = `Anda adalah Tim Analisis TKA Matematika SMP/MTs Fase D dan Ahli Penyusun Kisi-kisi Asesmen.
Analisis dokumen acuan berikut (Judul: "${documentTitle || 'Dokumen Acuan'}"):

${content.slice(0, 15000)}

ATURAN ANTI-HALUSINASI SANGAT KETAT:
1. Hanya ekstrak data yang secara eksplisit atau nyata ada dalam teks dokumen.
2. Identifikasi:
   - Elemen matematika yang dibahas (Bilangan, Aljabar, Geometri dan Pengukuran, Data dan Peluang)
   - Subelemen / topik spesifik
   - Indikator soal atau kemampuan yang diukur
   - Level kognitif (Memahami, Mengaplikasikan, Menalar)
   - Bentuk soal (PG, PG Kompleks/MCMA, PG Kategori)
   - Konteks/stimulus (Teks, Tabel, Grafik, Diagram, Infografis, dll)
3. Berikan output HANYA dalam format JSON murni tanpa markdown triple-backticks.
Format JSON:
{
  "summary": "Ringkasan temuan acuan dokumen...",
  "detected_elements": ["Bilangan", "Aljabar", ...],
  "items": [
    {
      "elemen": "Bilangan",
      "subelemen": "Bilangan Bulat dan Pecahan",
      "kompetensi": "...",
      "indikator": "...",
      "level_kognitif": "Mengaplikasikan",
      "bentuk_soal": "PG",
      "stimulus": "Teks + Tabel",
      "sumber": "${documentTitle || 'Dokumen Acuan'}"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error analyzing document:', err);
    return res.status(500).json({ error: err.message || 'Gagal menganalisis dokumen dengan AI' });
  }
});

// Endpoint: AI Question Generator
app.post('/api/ai/generate-question', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY belum dikonfigurasi.' });
  }

  const { indicator, element, subelement, cognitiveLevel, questionType, contextType, stimulusType } = req.body;

  try {
    const prompt = `Anda adalah Ahli Konstruksi Soal HOTS dan Literasi Numerasi SMP Matematika Fase D.
Buat 1 butir soal TKA Matematika SMP berkualitas tinggi dengan spesifikasi:
- Elemen: ${element}
- Subelemen: ${subelement}
- Indikator: ${indicator}
- Level Kognitif: ${cognitiveLevel} (Memahami / Mengaplikasikan / Menalar)
- Bentuk Soal: ${questionType} (PG / PG Kompleks/MCMA / PG Kategori)
- Konteks: ${contextType} (berfungsi sebagai stimulus matematika esensial, bukan hiasan)
- Stimulus: ${stimulusType}

ATURAN PENYUSUNAN SOAL:
1. Konteks realistis, relevan dengan dunia peserta didik SMP Fase D.
2. Stimulus menyajikan data/informasi yang mutlak dibutuhkan untuk memecahkan masalah.
3. Kebenaran matematika presisi tanpa kesalahan angka/logika.
4. Pengecoh (distraktor) bermutu tinggi mencerminkan miskonsepsi umum siswa.
5. Format JSON murni tanpa markdown:
{
  "stimulus": "Teks narasi konteks beserta deskripsi data atau tabel/grafik...",
  "pertanyaan": "Kalimat pertanyaan yang jelas dan terarah...",
  "bentuk_soal": "${questionType}",
  "options": [
    {"label": "A", "text": "...", "isCorrect": false},
    {"label": "B", "text": "...", "isCorrect": true},
    {"label": "C", "text": "...", "isCorrect": false},
    {"label": "D", "text": "...", "isCorrect": false}
  ],
  "complex_statements": [
    {"statement": "...", "isCorrect": true, "reason": "..."},
    {"statement": "...", "isCorrect": false, "reason": "..."}
  ],
  "category_statements": [
    {"statement": "...", "category": "Benar / Salah / Sesuai / Tidak Sesuai"}
  ],
  "kunci": "Jawaban yang benar...",
  "pembahasan": "Langkah penyelesaian matematis yang runut dan edukatif...",
  "aspek_numerasi": "Kemampuan numerasi yang diukur..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating question:', err);
    return res.status(500).json({ error: err.message || 'Gagal menghasilkan soal dengan AI' });
  }
});

// Endpoint: AI Question Validator
app.post('/api/ai/validate-question', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY belum dikonfigurasi.' });
  }

  const { questionData } = req.body;

  try {
    const prompt = `Anda adalah Validator Ahli Asesmen Matematika SMP Fase D.
Lakukan telaah kritis terhadap butir soal berikut:
${JSON.stringify(questionData, null, 2)}

Periksa 14 aspek standar:
1. Kesesuaian indikator
2. Kesesuaian level kognitif
3. Kesesuaian materi Fase D
4. Kebenaran matematika
5. Kejelasan stimulus
6. Kualitas pengecoh
7. Potensi ambiguitas / lebih dari satu jawaban
8. Kesesuaian bentuk soal
9. Kesesuaian kaidah bahasa Indonesia
10. Potensi bias (SARA/gender/wilayah)
11. Apakah jawaban mutlak dapat diperoleh dari stimulus
12. Apakah soal terlalu mudah
13. Apakah soal terlalu sulit
14. Apakah terdapat informasi mubazir/tidak relevan

Tentukan status akhir:
- "LAYAK" (✓)
- "PERLU REVISI" (⚠)
- "TIDAK LAYAK" (✗)

Format JSON murni:
{
  "status": "LAYAK | PERLU REVISI | TIDAK LAYAK",
  "score": 85,
  "summary": "Ringkasan telaah telaah kualitatif...",
  "checks": [
    {"criterion": "Kesesuaian Indikator", "passed": true, "note": "..."},
    {"criterion": "Kesesuaian Level Kognitif", "passed": true, "note": "..."},
    {"criterion": "Kebenaran Matematika", "passed": true, "note": "..."},
    {"criterion": "Kejelasan Stimulus", "passed": true, "note": "..."},
    {"criterion": "Kualitas Pengecoh", "passed": true, "note": "..."},
    {"criterion": "Kesesuaian Bahasa & Bebas Bias", "passed": true, "note": "..."}
  ],
  "recommendations": ["Saran 1...", "Saran 2..."]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error validating question:', err);
    return res.status(500).json({ error: err.message || 'Gagal memvalidasi soal' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
