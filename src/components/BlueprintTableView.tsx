import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  ChevronRight,
  X,
  FileSpreadsheet,
  FileText,
  Eye,
  ExternalLink,
  ImageIcon
} from 'lucide-react';
import { AssessmentItem, ElementType, CognitiveLevel, QuestionForm, PredictivePriority } from '../types';
import { exportToExcel, exportToCSV, exportToWord, copyTableToClipboard } from '../services/exportService';

interface BlueprintTableViewProps {
  items: AssessmentItem[];
  onSelectForQuestionGen: (item: AssessmentItem) => void;
  onSelectForInfographicPrompt: (item: AssessmentItem) => void;
  onOpenPromptModal: (item: AssessmentItem) => void;
}

export const BlueprintTableView: React.FC<BlueprintTableViewProps> = ({
  items,
  onSelectForQuestionGen,
  onSelectForInfographicPrompt,
  onOpenPromptModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedCognitive, setSelectedCognitive] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<AssessmentItem | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedElement !== 'all' && item.elemen !== selectedElement) return false;
      if (selectedCognitive !== 'all' && item.level_kognitif !== selectedCognitive) return false;
      if (selectedForm !== 'all' && item.bentuk_soal !== selectedForm) return false;
      if (selectedPriority !== 'all' && item.prioritas_prediktif !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          item.indikator_prediktif.toLowerCase().includes(q) ||
          item.subelemen.toLowerCase().includes(q) ||
          item.kompetensi.toLowerCase().includes(q) ||
          item.alasan.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [items, selectedElement, selectedCognitive, selectedForm, selectedPriority, searchQuery]);

  const handleCopyTable = async () => {
    const success = await copyTableToClipboard(filteredItems);
    if (success) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar & Export Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Prediksi Kisi-Kisi TKA Matematika SMP 2027
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredItems.length} dari total {items.length} indikator prediktif Fase D.
            </p>
          </div>

          {/* Export Buttons Suite */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => exportToExcel(filteredItems)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Unduh Microsoft Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => exportToWord(filteredItems)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Unduh Dokumen Word"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Word</span>
            </button>

            <button
              onClick={() => exportToCSV(filteredItems)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Unduh Format CSV"
            >
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleCopyTable}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Salin isi tabel untuk ditempel ke Excel atau Google Spreadsheet"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Table</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              title="Cetak langsung atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari indikator, subelemen, atau materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Filter Elemen */}
          <div>
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              aria-label="Filter Elemen Materi"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="all">Semua Elemen</option>
              <option value="Bilangan">Bilangan</option>
              <option value="Aljabar">Aljabar</option>
              <option value="Geometri dan Pengukuran">Geometri & Pengukuran</option>
              <option value="Data dan Peluang">Data & Peluang</option>
            </select>
          </div>

          {/* Filter Level Kognitif */}
          <div>
            <select
              value={selectedCognitive}
              onChange={(e) => setSelectedCognitive(e.target.value)}
              aria-label="Filter Level Kognitif"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="all">Semua Kognitif</option>
              <option value="Memahami">Memahami (L1)</option>
              <option value="Mengaplikasikan">Mengaplikasikan (L2)</option>
              <option value="Menalar">Menalar (L3/HOTS)</option>
            </select>
          </div>

          {/* Filter Bentuk Soal */}
          <div>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              aria-label="Filter Bentuk Soal"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="all">Semua Bentuk Soal</option>
              <option value="PG">PG Tunggal</option>
              <option value="PG Kompleks/MCMA">PG Kompleks (MCMA)</option>
              <option value="PG Kategori">PG Kategori (B/S)</option>
            </select>
          </div>

          {/* Filter Prioritas */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="Filter Prioritas Prediktif"
              className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
            >
              <option value="all">Semua Prioritas</option>
              <option value="Prioritas Tinggi">Prioritas Tinggi</option>
              <option value="Prioritas Menengah">Prioritas Menengah</option>
              <option value="Prioritas Pengayaan">Prioritas Pengayaan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-3 px-2 text-center w-10">No</th>
                <th className="py-3 px-3 w-28">Elemen</th>
                <th className="py-3 px-3 w-36">Subelemen</th>
                <th className="py-3 px-3 w-48">Kompetensi</th>
                <th className="py-3 px-4 min-w-[280px]">Indikator Prediktif 2027</th>
                <th className="py-3 px-2 text-center w-28">Level Kognitif</th>
                <th className="py-3 px-2 text-center w-28">Bentuk Soal</th>
                <th className="py-3 px-2 text-center w-24">Stimulus</th>
                <th className="py-3 px-2 text-center w-28">Prioritas</th>
                <th className="py-3 px-3 min-w-[200px]">Alasan Prediksi</th>
                <th className="py-3 px-2 text-center w-16 print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-500">
                    Tidak ditemukan indikator yang sesuai dengan kriteria filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setActiveModalItem(item)}
                  >
                    <td className="py-3 px-2 text-center font-bold text-slate-700">
                      {item.no}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {item.elemen}
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {item.subelemen}
                    </td>

                    <td className="py-3 px-3 text-slate-600 text-[11px] leading-tight">
                      {item.kompetensi}
                    </td>

                    <td className="py-3 px-4 text-slate-900 font-medium leading-snug">
                      <span>{item.indikator_prediktif}</span>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>Konteks: {item.konteks}</span>
                        <span>·</span>
                        <span>Sumber: {item.sumber_acuan}</span>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block font-semibold ${
                        item.level_kognitif === 'Menalar'
                          ? 'text-purple-700'
                          : item.level_kognitif === 'Mengaplikasikan'
                          ? 'text-emerald-700'
                          : 'text-sky-700'
                      }`}>
                        {item.level_kognitif}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center font-medium text-slate-700">
                      {item.bentuk_soal}
                    </td>

                    <td className="py-3 px-2 text-center text-slate-600">
                      {item.stimulus}
                    </td>

                    <td className="py-3 px-2 text-center font-semibold">
                      <span className={
                        item.prioritas_prediktif === 'Prioritas Tinggi'
                          ? 'text-amber-700'
                          : item.prioritas_prediktif === 'Prioritas Menengah'
                          ? 'text-blue-700'
                          : 'text-slate-600'
                      }>
                        {item.prioritas_prediktif}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Skor: {item.skor_prediksi}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px] leading-tight">
                      {item.alasan}
                    </td>

                    <td className="py-3 px-2 text-center print:hidden" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveModalItem(item)}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-200 transition-colors"
                        title="Lihat Detail Indikator"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Item */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  #{activeModalItem.no}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Detail Indikator Prediktif TKA 2027
                  </h3>
                  <p className="text-xs text-slate-500">{activeModalItem.elemen} · {activeModalItem.subelemen}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">Indikator Prediktif:</span>
                <p className="text-slate-900 font-medium text-sm leading-snug">
                  {activeModalItem.indikator_prediktif}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 border border-slate-100 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">Level Kognitif</span>
                  <span className="font-bold text-slate-800">{activeModalItem.level_kognitif}</span>
                </div>
                <div className="p-2 border border-slate-100 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">Bentuk Soal</span>
                  <span className="font-bold text-slate-800">{activeModalItem.bentuk_soal}</span>
                </div>
                <div className="p-2 border border-slate-100 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">Stimulus</span>
                  <span className="font-bold text-slate-800">{activeModalItem.stimulus}</span>
                </div>
                <div className="p-2 border border-slate-100 rounded-lg">
                  <span className="text-[11px] text-slate-400 block">Konteks</span>
                  <span className="font-bold text-slate-800">{activeModalItem.konteks}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Kompetensi yang Diukur:</span>
                <p className="text-slate-600 leading-relaxed">{activeModalItem.kompetensi}</p>
              </div>

              {activeModalItem.kemampuan_numerasi && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">Kemampuan Numerasi Terkait:</span>
                  <p className="text-slate-600 leading-relaxed">{activeModalItem.kemampuan_numerasi}</p>
                </div>
              )}

              {activeModalItem.potensi_visual && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">Potensi Representasi Visual:</span>
                  <p className="text-slate-600 leading-relaxed">{activeModalItem.potensi_visual}</p>
                </div>
              )}

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">{activeModalItem.prioritas_prediktif}</span>
                  <span className="text-[11px] text-amber-700 font-semibold">Skor: {activeModalItem.skor_prediksi}/100</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  <strong>Alasan:</strong> {activeModalItem.alasan}
                </p>
                <p className="text-slate-500 text-[10px] pt-1">
                  Acuan Dokumen: {activeModalItem.sumber_acuan}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => {
                  onOpenPromptModal(activeModalItem);
                  setActiveModalItem(null);
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Salin Prompt AI</span>
              </button>

              <button
                onClick={() => {
                  onSelectForInfographicPrompt(activeModalItem);
                  setActiveModalItem(null);
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Prompt Infografis</span>
              </button>

              <button
                onClick={() => {
                  onSelectForQuestionGen(activeModalItem);
                  setActiveModalItem(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Susun Soal untuk Indikator Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
