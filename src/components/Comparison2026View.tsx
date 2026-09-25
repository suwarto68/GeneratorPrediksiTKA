import React from 'react';
import { Clock, TrendingUp, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { BASELINE_COMPARISONS } from '../data/baseline2026Data';

export const Comparison2026View: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4" />
          <span>Fitur R · Komparasi Longitudinal Asesmen</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Analisis Acuan 2026 → Rancangan Prediksi 2027
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perbandingan aspek struktural antara dokumen acuan TKA 2026 dan rancangan prediktif 2027 dengan rasionalisasi analitik yang transparan.
        </p>
      </div>

      {/* Official Transparency Reminder Box */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="block mb-0.5">Catatan Transparansi Perubahan:</strong>
          Seluruh kolom perubahan dan pergeseran indikator di bawah ini merupakan <em>analisis inferensial dan proyeksi prediktif tim penyusun</em> berbasis tren literasi numerasi, 
          <strong> BUKAN merupakan pengumuman kebijakan atau kisi-kisi resmi pemerintah</strong>.
        </div>
      </div>

      {/* Master Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-3 px-4 w-40">Aspek Asesmen</th>
                <th className="py-3 px-4 w-52">Dokumen Acuan 2026</th>
                <th className="py-3 px-4 w-56">Rancangan Prediksi 2027</th>
                <th className="py-3 px-4 w-52">Arah Perubahan</th>
                <th className="py-3 px-4">Alasan & Rasionalisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {BASELINE_COMPARISONS.map((comp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 align-top">
                    {comp.aspek}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 align-top leading-relaxed">
                    {comp.acuan_2026}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold align-top leading-relaxed bg-indigo-50/20">
                    {comp.prediksi_2027}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-indigo-700 align-top leading-relaxed">
                    {comp.perubahan}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] align-top leading-relaxed">
                    {comp.alasan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
