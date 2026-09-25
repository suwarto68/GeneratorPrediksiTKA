import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RotateCw, 
  FileCheck, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { QuestionData, ValidationResult } from '../types';
import { validateQuestion } from '../services/validatorService';
import { INITIAL_QUESTIONS_SAMPLE } from '../data/baseline2026Data';

interface ValidatorViewProps {
  questionToValidate?: QuestionData | null;
  sampleQuestions?: QuestionData[];
}

export const ValidatorView: React.FC<ValidatorViewProps> = ({
  questionToValidate,
  sampleQuestions = INITIAL_QUESTIONS_SAMPLE
}) => {
  const [activeQuestion, setActiveQuestion] = useState<QuestionData>(
    questionToValidate || sampleQuestions[0]
  );

  const [validationResult, setValidationResult] = useState<ValidationResult>(() => {
    return validateQuestion(questionToValidate || sampleQuestions[0]);
  });

  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (questionToValidate) {
      setActiveQuestion(questionToValidate);
      setValidationResult(validateQuestion(questionToValidate));
    }
  }, [questionToValidate]);

  const handleSelectQuestion = (q: QuestionData) => {
    setActiveQuestion(q);
    setValidationResult(validateQuestion(q));
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setValidationResult(validateQuestion(activeQuestion));
      setIsValidating(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>Fitur P · Standar Audit Kualitas Asesmen</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Validator Butir Soal TKA Fase D
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Memeriksa 14 aspek standar mutu butir soal: materi, konstruksi, kaidah matematika, kejelasan stimulus, dan bahasa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Question selector & Summary info */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">Pilih Soal yang Ditelaah</h2>
            <span className="text-[11px] text-slate-400">Pilih butir dari bank soal aktif</span>
          </div>

          <div className="space-y-2">
            {sampleQuestions.map(q => (
              <div
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  activeQuestion.id === q.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{q.id} · {q.bentuk_soal}</span>
                  <span className="text-[10px] text-slate-500">{q.elemen}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{q.pertanyaan}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleRunValidation}
              disabled={isValidating}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Memvalidasi 14 Kaidah...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>JALANKAN ULANG VALIDASI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Validation Verdict & 14 Checklist Items */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          {/* Status Verdict Header Card */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            validationResult.status === 'LAYAK'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : validationResult.status === 'PERLU REVISI'
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-rose-50/70 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center gap-3">
              {validationResult.status === 'LAYAK' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : validationResult.status === 'PERLU REVISI' ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight">
                    STATUS: {validationResult.status === 'LAYAK' ? '✓ LAYAK' : validationResult.status === 'PERLU REVISI' ? '⚠ PERLU REVISI' : '✗ TIDAK LAYAK'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                    Skor: {validationResult.score}/100
                  </span>
                </div>
                <p className="text-xs mt-0.5 font-medium leading-relaxed opacity-90">
                  {validationResult.summary}
                </p>
              </div>
            </div>
          </div>

          {/* 14 Checklist Inspection Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hasil Telaah 14 Kaidah Mutu Butir Soal Asesmen
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {validationResult.checks.map((check, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border flex items-start gap-2.5 transition-colors ${
                    check.status === 'Pass'
                      ? 'bg-slate-50 border-slate-200'
                      : check.status === 'Warning'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {check.status === 'Pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : check.status === 'Warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{check.criterion}</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{check.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Box */}
          {validationResult.recommendations.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 block">Rekomendasi Tindak Lanjut Penelaah:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                {validationResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
