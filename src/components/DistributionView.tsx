import React from 'react';
import { Layers, PieChart, TrendingUp, BarChart3, Grid, FileCheck } from 'lucide-react';
import { AssessmentItem, ElementType } from '../types';
import { AnalysisSummary } from '../services/predictionEngine';

interface DistributionViewProps {
  items: AssessmentItem[];
  summary: AnalysisSummary;
}

export const DistributionView: React.FC<DistributionViewProps> = ({ items, summary }) => {
  const total = items.length;

  // Cross tabulation: Materi vs Level Kognitif
  const matrixMateriKognitif: Record<ElementType, Record<string, number>> = {
    'Bilangan': { 'Memahami': 0, 'Mengaplikasikan': 0, 'Menalar': 0 },
    'Aljabar': { 'Memahami': 0, 'Mengaplikasikan': 0, 'Menalar': 0 },
    'Geometri dan Pengukuran': { 'Memahami': 0, 'Mengaplikasikan': 0, 'Menalar': 0 },
    'Data dan Peluang': { 'Memahami': 0, 'Mengaplikasikan': 0, 'Menalar': 0 },
  };

  // Cross tabulation: Materi vs Bentuk Soal
  const matrixMateriBentuk: Record<ElementType, Record<string, number>> = {
    'Bilangan': { 'PG': 0, 'PG Kompleks/MCMA': 0, 'PG Kategori': 0 },
    'Aljabar': { 'PG': 0, 'PG Kompleks/MCMA': 0, 'PG Kategori': 0 },
    'Geometri dan Pengukuran': { 'PG': 0, 'PG Kompleks/MCMA': 0, 'PG Kategori': 0 },
    'Data dan Peluang': { 'PG': 0, 'PG Kompleks/MCMA': 0, 'PG Kategori': 0 },
  };

  items.forEach(item => {
    if (matrixMateriKognitif[item.elemen]) {
      matrixMateriKognitif[item.elemen][item.level_kognitif] = 
        (matrixMateriKognitif[item.elemen][item.level_kognitif] || 0) + 1;
    }
    if (matrixMateriBentuk[item.elemen]) {
      matrixMateriBentuk[item.elemen][item.bentuk_soal] = 
        (matrixMateriBentuk[item.elemen][item.bentuk_soal] || 0) + 1;
    }
  });

  const elementsList: ElementType[] = ['Bilangan', 'Aljabar', 'Geometri dan Pengukuran', 'Data dan Peluang'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Dashboard Distribusi Analitik</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Distribusi Prediksi Soal TKA Matematika SMP 2027
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pemetaan proporsi butir soal berdasarkan Elemen Materi, Tingkat Kognitif, dan Bentuk Instrumen Asesmen.
        </p>
      </div>

      {/* Row 1: The Three Core Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* H. Distribusi Materi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Distribusi Materi</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{total} Soal</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Bilangan' as ElementType, count: summary.elementCounts['Bilangan'], pct: summary.elementPercentages['Bilangan'], baseline: '16%', color: 'bg-blue-600' },
              { name: 'Aljabar' as ElementType, count: summary.elementCounts['Aljabar'], pct: summary.elementPercentages['Aljabar'], baseline: '34%', color: 'bg-indigo-600' },
              { name: 'Geometri & Pengukuran' as ElementType, count: summary.elementCounts['Geometri dan Pengukuran'], pct: summary.elementPercentages['Geometri dan Pengukuran'], baseline: '30%', color: 'bg-emerald-600' },
              { name: 'Data dan Peluang' as ElementType, count: summary.elementCounts['Data dan Peluang'], pct: summary.elementPercentages['Data dan Peluang'], baseline: '20%', color: 'bg-amber-600' },
            ].map(m => (
              <div key={m.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{m.name}</span>
                  <span className="text-slate-600 font-medium">
                    {m.count} Butir ({m.pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-500`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-right">
                  Baseline Acuan 2026: {m.baseline}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* I. Distribusi Kognitif */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Distribusi Kognitif</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">Fase D</span>
          </div>

          <div className="space-y-3">
            {[
              { level: 'Memahami (L1)', count: summary.cognitiveCounts['Memahami'] || 0, desc: 'Mengingat & mengenali rumus/definisi', color: 'bg-sky-500' },
              { level: 'Mengaplikasikan (L2)', count: summary.cognitiveCounts['Mengaplikasikan'] || 0, desc: 'Penerapan konsep pada situasi rutin', color: 'bg-emerald-500' },
              { level: 'Menalar (L3 / HOTS)', count: summary.cognitiveCounts['Menalar'] || 0, desc: 'Analisis, evaluasi & situasi non-rutin', color: 'bg-purple-600' },
            ].map(cog => {
              const pct = total ? Number(((cog.count / total) * 100).toFixed(1)) : 0;
              return (
                <div key={cog.level} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cog.level}</span>
                    <span className="text-slate-600 font-medium">
                      {cog.count} Butir ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cog.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{cog.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* J. Distribusi Bentuk Soal */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">Bentuk Soal</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">Objektif</span>
          </div>

          <div className="space-y-3">
            {[
              { form: 'PG Tunggal (A, B, C, D)', count: summary.formCounts['PG'] || 0, desc: '1 jawaban benar pasti', color: 'bg-slate-700' },
              { form: 'PG Kompleks / MCMA', count: summary.formCounts['PG Kompleks/MCMA'] || 0, desc: 'Pernyataan benar > 1', color: 'bg-indigo-600' },
              { form: 'PG Kategori (Benar/Salah)', count: summary.formCounts['PG Kategori'] || 0, desc: 'Klasifikasi tabel pernyataan', color: 'bg-amber-600' },
            ].map(f => {
              const pct = total ? Number(((f.count / total) * 100).toFixed(1)) : 0;
              return (
                <div key={f.form} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{f.form}</span>
                    <span className="text-slate-600 font-medium">
                      {f.count} Butir ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${f.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{f.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cross-Tabulation Matrix: Materi x Level Kognitif & Materi x Bentuk Soal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matrix 1: Materi x Level Kognitif */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Grid className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Matriks Silang: Materi × Level Kognitif</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2 px-3 font-semibold">Elemen Materi</th>
                  <th className="py-2 px-2 text-center">Memahami (L1)</th>
                  <th className="py-2 px-2 text-center">Mengaplikasikan (L2)</th>
                  <th className="py-2 px-2 text-center">Menalar (L3)</th>
                  <th className="py-2 px-2 text-center font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {elementsList.map(elem => {
                  const m = matrixMateriKognitif[elem];
                  const subTotal = (m['Memahami'] || 0) + (m['Mengaplikasikan'] || 0) + (m['Menalar'] || 0);
                  return (
                    <tr key={elem} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{elem}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{m['Memahami'] || 0}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{m['Mengaplikasikan'] || 0}</td>
                      <td className="py-2.5 px-2 text-center font-semibold text-purple-700">{m['Menalar'] || 0}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-900">{subTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matrix 2: Materi x Bentuk Soal */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <FileCheck className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Matriks Silang: Materi × Bentuk Soal</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2 px-3 font-semibold">Elemen Materi</th>
                  <th className="py-2 px-2 text-center">PG Tunggal</th>
                  <th className="py-2 px-2 text-center">PG Kompleks</th>
                  <th className="py-2 px-2 text-center">PG Kategori</th>
                  <th className="py-2 px-2 text-center font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {elementsList.map(elem => {
                  const m = matrixMateriBentuk[elem];
                  const subTotal = (m['PG'] || 0) + (m['PG Kompleks/MCMA'] || 0) + (m['PG Kategori'] || 0);
                  return (
                    <tr key={elem} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{elem}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{m['PG'] || 0}</td>
                      <td className="py-2.5 px-2 text-center font-semibold text-indigo-700">{m['PG Kompleks/MCMA'] || 0}</td>
                      <td className="py-2.5 px-2 text-center font-semibold text-amber-700">{m['PG Kategori'] || 0}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-900">{subTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
