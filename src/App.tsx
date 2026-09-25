/**
 * PREDIKSI KISI-KISI TKA MATEMATIKA SMP 2027
 * AI-Powered Assessment Blueprint Generator Berbasis Analisis Dokumen TKA
 * Jenjang SMP/MTs · Fase D · Kurikulum & Standar Asesmen Nasional
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { InputPredictView } from './components/InputPredictView';
import { BlueprintTableView } from './components/BlueprintTableView';
import { ManuscriptView } from './components/ManuscriptView';
import { DistributionView } from './components/DistributionView';
import { IndicatorGeneratorView } from './components/IndicatorGeneratorView';
import { StimulusGeneratorView } from './components/StimulusGeneratorView';
import { QuestionGeneratorView } from './components/QuestionGeneratorView';
import { ValidatorView } from './components/ValidatorView';
import { InfographicPromptView } from './components/InfographicPromptView';
import { QualityAnalysisView } from './components/QualityAnalysisView';
import { Comparison2026View } from './components/Comparison2026View';
import { UploadView } from './components/UploadView';
import { CBTExamView } from './components/CBTExamView';
import { DisclaimerFooter } from './components/DisclaimerFooter';
import { PortablePromptsModal } from './components/PortablePromptsModal';

import { 
  AssessmentItem, 
  PredictionConfig, 
  QuestionData, 
  UploadedDoc 
} from './types';
import { 
  generatePredictedBlueprint, 
  AnalysisSummary 
} from './services/predictionEngine';
import { 
  exportToExcel, 
  exportManuscriptToWord 
} from './services/exportService';
import { buildQuestionsManuscript } from './services/questionManuscriptService';
import { BASELINE_2026_ITEMS } from './data/baseline2026Data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Master prediction configuration state
  const [config, setConfig] = useState<PredictionConfig>({
    jenjang: 'SMP/MTs',
    fase: 'Fase D',
    mataPelajaran: 'Matematika',
    tahunTarget: 2027,
    jumlahSoal: 30,
    sources: {
      kisiKisi2026: true,
      soalTka2026: true,
      kerangkaAsesmen: true,
      dokumenPengguna: false
    },
    modePrediksi: 'Seimbang',
    distribusiMateriMode: 'Mengikuti baseline 2026',
    customDistribution: {
      bilangan: 16,
      aljabar: 34,
      geometri: 30,
      dataPeluang: 20
    },
    customCognitive: {
      memahami: 20,
      mengaplikasikan: 55,
      menalar: 25
    },
    customForms: {
      pg: 60,
      pgKompleks: 25,
      pgKategori: 15
    },
    allowedStimuli: [
      'Teks', 'Tabel', 'Grafik', 'Diagram', 'Infografis', 'Peta Sederhana', 'Denah', 'Data Numerik', 'Kombinasi'
    ]
  });

  // User uploaded documents and extracted items pool
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [customItemsPool, setCustomItemsPool] = useState<AssessmentItem[]>(BASELINE_2026_ITEMS);

  // Active Blueprint Items and Summary
  const [{ items: blueprintItems, summary }, setBlueprintData] = useState<{
    items: AssessmentItem[];
    summary: AnalysisSummary;
  }>(() => generatePredictedBlueprint(config, BASELINE_2026_ITEMS));

  // Active Full Question Manuscript synchronized with the Blueprint
  const [questionsManuscript, setQuestionsManuscript] = useState<QuestionData[]>(() => 
    buildQuestionsManuscript(blueprintItems)
  );

  // Context cross-navigation states
  const [preselectedItem, setPreselectedItem] = useState<AssessmentItem | null>(null);
  const [questionToValidate, setQuestionToValidate] = useState<QuestionData | null>(null);
  const [promptModalItem, setPromptModalItem] = useState<AssessmentItem | null>(null);
  const [isManuscriptUnlocked, setIsManuscriptUnlocked] = useState<boolean>(false);

  // Regenerate Blueprint when requested
  const handleGenerateBlueprint = () => {
    const updated = generatePredictedBlueprint(config, customItemsPool);
    setBlueprintData(updated);
    const updatedQuestions = buildQuestionsManuscript(updated.items);
    setQuestionsManuscript(updatedQuestions);
    setActiveTab('kisi-kisi');
  };

  // Add custom constructed indicator to blueprint
  const handleAddIndicatorToBlueprint = (newItem: AssessmentItem) => {
    const nextNo = blueprintItems.length + 1;
    const itemWithNo = { ...newItem, no: nextNo };
    const updatedItems = [...blueprintItems, itemWithNo];
    
    // Recalculate summary
    const updatedSummary = { ...summary };
    updatedSummary.elementCounts[newItem.elemen] = (updatedSummary.elementCounts[newItem.elemen] || 0) + 1;
    updatedSummary.cognitiveCounts[newItem.level_kognitif] = (updatedSummary.cognitiveCounts[newItem.level_kognitif] || 0) + 1;
    updatedSummary.formCounts[newItem.bentuk_soal] = (updatedSummary.formCounts[newItem.bentuk_soal] || 0) + 1;
    updatedSummary.priorityCounts[newItem.prioritas_prediktif] = (updatedSummary.priorityCounts[newItem.prioritas_prediktif] || 0) + 1;
    updatedSummary.totalAnalyzed = updatedItems.length;

    setBlueprintData({ items: updatedItems, summary: updatedSummary });
    setQuestionsManuscript(buildQuestionsManuscript(updatedItems));
  };

  // Add uploaded file & extracted indicators
  const handleAddDocument = (doc: UploadedDoc, extractedItems: AssessmentItem[]) => {
    setUploadedDocs(prev => [doc, ...prev]);
    if (extractedItems.length > 0) {
      setCustomItemsPool(prev => [...prev, ...extractedItems]);
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== docId));
  };

  const handleIntegrateUploadedDocs = () => {
    const updatedConfig = {
      ...config,
      sources: {
        ...config.sources,
        dokumenPengguna: true
      }
    };
    setConfig(updatedConfig);
    const updated = generatePredictedBlueprint(updatedConfig, customItemsPool);
    setBlueprintData(updated);
    setQuestionsManuscript(buildQuestionsManuscript(updated.items));
    setActiveTab('kisi-kisi');
  };

  // Quick Global Actions
  const handleQuickExportExcel = () => {
    exportToExcel(blueprintItems);
  };

  const handleQuickExportWordManuscript = () => {
    if (!isManuscriptUnlocked) {
      setActiveTab('naskah-soal');
      return;
    }
    exportManuscriptToWord(questionsManuscript, { includeAnswers: true });
  };

  const handlePrint = () => {
    window.print();
  };

  // Cross-view handlers
  const handleSelectForQuestionGen = (item: AssessmentItem) => {
    setPreselectedItem(item);
    setActiveTab('generator-soal');
  };

  const handleSelectForInfographicPrompt = (item: AssessmentItem) => {
    setPreselectedItem(item);
    setActiveTab('prompt-infografis');
  };

  const handleNavigateToValidation = (question: QuestionData) => {
    setQuestionToValidate(question);
    setActiveTab('validator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickExportExcel={handleQuickExportExcel}
        onQuickExportWordManuscript={handleQuickExportWordManuscript}
        onPrint={handlePrint}
        totalItems={blueprintItems.length}
      />

      {/* Main Dynamic View Content */}
      {activeTab === 'ujian-cbt' ? (
        <main className="flex-1 w-full">
          <CBTExamView questions={questionsManuscript} />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              items={blueprintItems}
              summary={summary}
              onNavigate={setActiveTab}
              onExportExcel={handleQuickExportExcel}
              onPrint={handlePrint}
            />
          )}

          {activeTab === 'input-data' && (
            <InputPredictView
              config={config}
              onChangeConfig={setConfig}
              onGenerate={handleGenerateBlueprint}
            />
          )}

          {activeTab === 'kisi-kisi' && (
            <BlueprintTableView
              items={blueprintItems}
              onSelectForQuestionGen={handleSelectForQuestionGen}
              onSelectForInfographicPrompt={handleSelectForInfographicPrompt}
              onOpenPromptModal={(item) => setPromptModalItem(item)}
              onNavigateToManuscript={() => setActiveTab('naskah-soal')}
            />
          )}

          {activeTab === 'naskah-soal' && (
            <ManuscriptView
              questions={questionsManuscript}
              blueprintItems={blueprintItems}
              onValidateQuestion={handleNavigateToValidation}
              onSelectForInfographicPrompt={handleSelectForInfographicPrompt}
              isUnlocked={isManuscriptUnlocked}
              onUnlockChange={setIsManuscriptUnlocked}
            />
          )}

          {activeTab === 'distribusi' && (
            <DistributionView
              items={blueprintItems}
              summary={summary}
            />
          )}

          {activeTab === 'generator-indikator' && (
            <IndicatorGeneratorView
              onAddIndicatorToBlueprint={handleAddIndicatorToBlueprint}
              onNavigateToQuestionGen={handleSelectForQuestionGen}
            />
          )}

          {activeTab === 'generator-stimulus' && (
            <StimulusGeneratorView />
          )}

          {activeTab === 'generator-soal' && (
            <QuestionGeneratorView
              blueprintItems={blueprintItems}
              preselectedItem={preselectedItem}
              onValidateQuestion={handleNavigateToValidation}
            />
          )}

          {activeTab === 'validator' && (
            <ValidatorView
              questionToValidate={questionToValidate}
              sampleQuestions={questionsManuscript}
            />
          )}

          {activeTab === 'prompt-infografis' && (
            <InfographicPromptView
              blueprintItems={blueprintItems}
              preselectedItem={preselectedItem}
            />
          )}

          {activeTab === 'kualitas' && (
            <QualityAnalysisView
              items={blueprintItems}
              summary={summary}
            />
          )}

          {activeTab === 'perbandingan' && (
            <Comparison2026View />
          )}

          {activeTab === 'upload' && (
            <UploadView
              uploadedDocs={uploadedDocs}
              onAddDocument={handleAddDocument}
              onRemoveDocument={handleRemoveDocument}
              onIntegrateIntoPrediction={handleIntegrateUploadedDocs}
            />
          )}
        </main>
      )}

      {/* Portable Prompt Modal */}
      <PortablePromptsModal
        item={promptModalItem}
        onClose={() => setPromptModalItem(null)}
      />

      {/* Disclaimer Footer (Section AA) */}
      {activeTab !== 'ujian-cbt' && <DisclaimerFooter />}
    </div>
  );
}
