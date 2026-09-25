import React from 'react';
import { 
  FileSpreadsheet, 
  BarChart3, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Download, 
  UploadCloud, 
  Sliders, 
  BookOpen, 
  Compass, 
  FileText,
  FileCheck,
  Image as ImageIcon
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickExportExcel: () => void;
  onPrint: () => void;
  totalItems: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickExportExcel,
  onPrint,
  totalItems
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'input-data', label: 'Input Prediksi', icon: Sliders },
    { id: 'kisi-kisi', label: 'Tabel Kisi-Kisi', icon: FileSpreadsheet },
    { id: 'distribusi', label: 'Distribusi Soal', icon: Layers },
    { id: 'generator-indikator', label: 'Gen. Indikator', icon: Compass },
    { id: 'generator-stimulus', label: 'Gen. Stimulus', icon: BookOpen },
    { id: 'generator-soal', label: 'Gen. Soal', icon: Sparkles },
    { id: 'validator', label: 'Validator', icon: CheckCircle2 },
    { id: 'prompt-infografis', label: 'Prompt Infografis', icon: ImageIcon },
    { id: 'kualitas', label: 'Analisis Kualitas', icon: FileCheck },
    { id: 'perbandingan', label: '2026 vs 2027', icon: FileText },
    { id: 'upload', label: 'Upload Dokumen', icon: UploadCloud },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      {/* Top Banner with Brand and Global Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ∑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  PREDIKSI KISI-KISI TKA MATEMATIKA SMP 2027
                </span>
                <span className="text-xs text-slate-500 hidden md:inline">· Fase D</span>
                <span className="text-xs text-slate-500 hidden md:inline">· {totalItems} Soal</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AI-Powered Assessment Blueprint Generator Berbasis Analisis Dokumen TKA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onQuickExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Unduh Kisi-Kisi format Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              title="Cetak atau Simpan PDF Resmi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5 min-w-max" aria-label="Tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs font-semibold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
