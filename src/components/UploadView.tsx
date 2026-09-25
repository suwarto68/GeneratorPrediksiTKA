import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  Trash2, 
  Database, 
  Layers, 
  Sparkles, 
  AlertCircle,
  FileCheck,
  RotateCw
} from 'lucide-react';
import { UploadedDoc, AssessmentItem } from '../types';
import { parseUploadedFile } from '../services/documentParser';

interface UploadViewProps {
  uploadedDocs: UploadedDoc[];
  onAddDocument: (doc: UploadedDoc, extractedItems: AssessmentItem[]) => void;
  onRemoveDocument: (docId: string) => void;
  onIntegrateIntoPrediction: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  uploadedDocs,
  onAddDocument,
  onRemoveDocument,
  onIntegrateIntoPrediction
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    setIsProcessing(true);

    try {
      const file = files[0];
      const result = await parseUploadedFile(file);
      onAddDocument(result.doc, result.extractedItems);
      setSuccessMsg(`Dokumen "${file.name}" berhasil diunggah dan diekstrak (${result.extractedItems.length} indikator terdeteksi).`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setUploadError(`Gagal membaca dokumen: ${err.message || 'Format tidak didukung'}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <UploadCloud className="w-4 h-4" />
          <span>Fitur W · Ekstraksi & Manajemen Dokumen Acuan</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Unggah Dokumen Acuan Asesmen
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Unggah dokumen referensi (PDF, DOCX, XLSX, TXT) untuk diekstrak teks, tabel, materi, dan indikatornya ke dalam basis data sementara.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="bg-white border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center transition-colors shadow-2xs">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <label
              htmlFor="file-upload-input"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer block"
            >
              Klik untuk memilih berkas dokumen
            </label>
            <p className="text-xs text-slate-500 mt-1">
              Mendukung: PDF, Word (DOCX), Excel (XLSX/CSV), Text (TXT)
            </p>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 py-2 px-3 rounded-lg">
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Mengekstrak teks, tabel, dan indikator dokumen...</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center justify-center gap-2 text-xs text-rose-800 bg-rose-50 py-2 px-3 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Preloaded Curated Reference Sources Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Dokumen Acuan Terkonfigurasi (Sumber Utama)</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            3 Sumber Utama Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>1. Kisi-kisi Try Out I TKA 2026</span>
            </div>
            <p className="text-[11px] text-slate-500">Mencakup pemetaan materi & indikator butir acuan 2026.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>2. Soal TKA Matematika SMP 2026</span>
            </div>
            <p className="text-[11px] text-slate-500">Distribusi tingkat kesulitan & pola distraktor pilihan ganda.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>3. Kerangka Asesmen SMP Fase D</span>
            </div>
            <p className="text-[11px] text-slate-500">Standar capaian pembelajaran literasi numerasi resmi.</p>
          </div>
        </div>
      </div>

      {/* Uploaded User Documents Manager */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Daftar Dokumen Unggahan Tambahan ({uploadedDocs.length})
            </h2>
          </div>

          {uploadedDocs.length > 0 && (
            <button
              onClick={onIntegrateIntoPrediction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Integrasikan ke Prediksi 2027</span>
            </button>
          )}
        </div>

        {uploadedDocs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Belum ada berkas tambahan yang diunggah. Sistem saat ini beroperasi menggunakan 3 dokumen acuan dasar.
          </div>
        ) : (
          <div className="space-y-2">
            {uploadedDocs.map(doc => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {doc.type}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-slate-500 text-[11px]">
                      {(doc.size / 1024).toFixed(1)} KB · Terdeteksi {doc.detectedCount} Indikator · Pukul {doc.uploadedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Terekstraksi
                  </span>
                  <button
                    onClick={() => onRemoveDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
