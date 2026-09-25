import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldAlert, 
  Download,
  Layers
} from 'lucide-react';
import { AssessmentItem, InfographicPrompt } from '../types';
import { createInfographicPrompt } from '../services/infographicPromptService';

interface InfographicPromptViewProps {
  blueprintItems: AssessmentItem[];
  preselectedItem?: AssessmentItem | null;
}

export const InfographicPromptView: React.FC<InfographicPromptViewProps> = ({
  blueprintItems,
  preselectedItem
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    preselectedItem?.id || blueprintItems[0]?.id || 'TKA-BIL-01'
  );
  const [selectedRatio, setSelectedRatio] = useState<'16:9' | 'A4' | '1:1'>('16:9');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const activeItem = blueprintItems.find(i => i.id === selectedItemId) || blueprintItems[0];
  const promptData: InfographicPrompt = createInfographicPrompt(activeItem, selectedRatio);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptData.full_prompt_text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Fitur N & U · Desain Stimulus Visual Asesmen</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Generator Prompt Infografis Pendidikan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Buat prompt terstruktur berstandar industri untuk generator AI gambar (Midjourney, Canva Magic Media, DALL-E 3, Gemini) dengan pengaman kebocoran kunci jawaban.
        </p>
      </div>

      {/* Selector & Ratio Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="font-semibold text-xs text-slate-700 block mb-1">
              Pilih Indikator Stimulus dari Kisi-Kisi:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {blueprintItems.map(item => (
                <option key={item.id} value={item.id}>
                  No. {item.no} · [{item.elemen}] {item.indikator_prediktif.slice(0, 75)}... ({item.stimulus})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">
              Rasio Aspek Gambar:
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['16:9', 'A4', '1:1'] as ('16:9' | 'A4' | '1:1')[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRatio(r)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    selectedRatio === r
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Structured Output Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Formatted Fields breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs">
          <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Elemen Spesifikasi Infografis
          </h2>

          <div className="space-y-1">
            <span className="font-bold text-slate-600 block">Judul Desain:</span>
            <p className="text-slate-800 font-semibold">{promptData.judul}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-600 block">Tujuan Visual:</span>
            <p className="text-slate-700">{promptData.tujuan_visual}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-600 block">Elemen Visual:</span>
            <p className="text-slate-700">{promptData.elemen_visual}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-600 block">Komposisi & Warna:</span>
            <p className="text-slate-700">{promptData.warna}</p>
          </div>

          {/* Safety rules box */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Question Safety (Kaidah Anti-Bocor):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-900 text-[11px]">
              {promptData.larangan.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 2 Columns: The Full Portable Prompt */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Format Prompt Terstruktur [ROLE - OBJECTIVE - CONTENT - VISUAL - SAFETY - FORMAT]
              </h2>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSuccess ? 'Prompt Tersalin!' : 'Copy Prompt'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
            {promptData.full_prompt_text}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>Dapat langsung ditempel ke Canva AI, Google AI Studio, Gemini, Midjourney, atau Photoshop AI.</span>
            <span className="font-semibold text-slate-700">Rasio: {selectedRatio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
