import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Bot, Image, FileText, Palette } from 'lucide-react';
import { AssessmentItem } from '../types';
import { generatePortableAIPrompts } from '../services/infographicPromptService';

interface PortablePromptsModalProps {
  item: AssessmentItem | null;
  onClose: () => void;
}

export const PortablePromptsModal: React.FC<PortablePromptsModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const [activePlatform, setActivePlatform] = useState<'gemini' | 'canva' | 'image' | 'text'>('gemini');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const prompts = generatePortableAIPrompts(item);

  const platformTabs = [
    { id: 'gemini', label: 'Gemini / AI Studio', icon: Bot, prompt: prompts.geminiPrompt },
    { id: 'canva', label: 'Canva AI / Poster', icon: Palette, prompt: prompts.canvaPrompt },
    { id: 'image', label: 'AI Image (Midjourney/DALL-E)', icon: Image, prompt: prompts.imageGenPrompt },
    { id: 'text', label: 'AI Text Generator', icon: FileText, prompt: prompts.textGenPrompt },
  ];

  const currentPrompt = platformTabs.find(p => p.id === activePlatform)?.prompt || prompts.geminiPrompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Prompt Portable untuk AI Eksternal
              </h3>
              <p className="text-xs text-slate-500">
                Indikator #{item.no} · {item.elemen} ({item.subelemen})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
          {platformTabs.map(p => {
            const Icon = p.icon;
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Output Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Prompt siap salin dan tempel:</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSuccess ? 'Prompt Tersalin!' : 'Copy Prompt'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
            {currentPrompt}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
          <span>Bersifat standar dan portable tanpa memerlukan format API khusus.</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
