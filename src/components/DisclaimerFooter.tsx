import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-slate-600 print:text-black">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Mandated Disclaimer Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold uppercase tracking-wider block mb-1">Catatan / Disclaimer Resmi:</span>
            Hasil yang dihasilkan aplikasi ini merupakan analisis dan prediksi berbasis dokumen referensi yang diunggah pengguna. 
            Hasil bukan merupakan kisi-kisi resmi TKA 2027 dan tidak menjamin materi atau indikator tertentu akan muncul dalam pelaksanaan TKA.
          </div>
        </div>

        {/* System & Curriculum Transparency Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sistem Anti-Halusinasi Aktif: Memisahkan Data Sumber, Analisis, dan Prediksi Kognitif Fase D</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Standar Asesmen SMP/MTs</span>
            <span>·</span>
            <span>Matematika Fase D</span>
            <span>·</span>
            <span>Tahun Target 2027</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
