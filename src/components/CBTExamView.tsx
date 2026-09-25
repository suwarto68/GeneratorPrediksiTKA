import React, { useState, useEffect } from 'react';
import { QuestionData } from '../types';
import { 
  CBTExamConfig, 
  CBTExamResult, 
  CBTStudent, 
  ConnectionStatus 
} from '../types/cbtTypes';
import { 
  loadCBTConfig, 
  saveCBTConfig, 
  loadCBTStudents, 
  saveCBTStudents, 
  loadCBTResults, 
  saveExamAnswerToSheet, 
  testGoogleAppsScriptConnection 
} from '../services/cbtGoogleSheetsService';
import { CBTStudentLogin } from './CBTStudentLogin';
import { CBTActiveExam } from './CBTActiveExam';
import { CBTStudentResult } from './CBTStudentResult';
import { CBTAdminPanel } from './CBTAdminPanel';

interface CBTExamViewProps {
  questions: QuestionData[];
}

export const CBTExamView: React.FC<CBTExamViewProps> = ({ questions }) => {
  const [viewState, setViewState] = useState<'login' | 'exam' | 'result' | 'admin'>('login');
  
  // Master config state
  const [config, setConfig] = useState<CBTExamConfig>(() => loadCBTConfig());
  
  // Students database state
  const [students, setStudents] = useState<CBTStudent[]>(() => loadCBTStudents());
  
  // Results database state
  const [results, setResults] = useState<CBTExamResult[]>(() => loadCBTResults());
  
  // Active student in session
  const [currentStudent, setCurrentStudent] = useState<CBTStudent | null>(null);
  
  // Latest submitted result
  const [lastResult, setLastResult] = useState<CBTExamResult | null>(null);

  // Connection status with Google Spreadsheet
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isChecking: false,
    mode: 'offline',
    message: 'Memeriksa koneksi database Google Spreadsheet...'
  });

  // Check connection on component load
  useEffect(() => {
    let isMounted = true;
    const checkConn = async () => {
      if (config.gasWebAppUrl) {
        const res = await testGoogleAppsScriptConnection(config.gasWebAppUrl);
        if (isMounted) setConnectionStatus(res);
      } else {
        if (isMounted) {
          setConnectionStatus({
            isConnected: false,
            isChecking: false,
            mode: 'offline',
            message: 'Mode offline aktif. Konfigurasikan URL Google Apps Script di Panel Proktor untuk sinkronisasi live.'
          });
        }
      }
    };
    checkConn();
    return () => { isMounted = false; };
  }, [config.gasWebAppUrl]);

  // Handlers
  const handleLoginSuccess = (student: CBTStudent) => {
    setCurrentStudent(student);
    setViewState('exam');
  };

  const handleFinishExam = async (result: CBTExamResult) => {
    // 1. Send to Google Sheets and save locally
    const syncRes = await saveExamAnswerToSheet(result, config.gasWebAppUrl);
    
    const enrichedResult: CBTExamResult = {
      ...result,
      statusSync: syncRes.success ? (config.gasWebAppUrl ? 'Tersimpan Online' : 'Tersimpan Lokal') : 'Tersimpan Lokal',
      syncMessage: syncRes.message
    };

    setResults(prev => [enrichedResult, ...prev.filter(r => r.id !== enrichedResult.id)]);
    setLastResult(enrichedResult);

    // Update student status
    if (currentStudent) {
      const updatedStudents = students.map(s => 
        s.id === currentStudent.id 
          ? { ...s, statusUjian: 'Selesai' as const, nilaiTerakhir: enrichedResult.skorAkhir }
          : s
      );
      setStudents(updatedStudents);
      saveCBTStudents(updatedStudents);
    }

    setViewState('result');
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setViewState('login');
  };

  const handleReturnToLogin = () => {
    setCurrentStudent(null);
    setLastResult(null);
    setViewState('login');
  };

  return (
    <div className="w-full min-h-screen">
      {/* 1. LOGIN VIEW */}
      {viewState === 'login' && (
        <CBTStudentLogin
          config={config}
          students={students}
          connectionStatus={connectionStatus}
          onLoginSuccess={handleLoginSuccess}
          onOpenAdmin={() => setViewState('admin')}
        />
      )}

      {/* 2. ACTIVE EXAM FULLSCREEN RUNNER */}
      {viewState === 'exam' && currentStudent && (
        <CBTActiveExam
          student={currentStudent}
          config={config}
          questions={questions}
          onFinishExam={handleFinishExam}
          onLogout={handleLogout}
        />
      )}

      {/* 3. STUDENT FINISH & SCORE CONFIRMATION */}
      {viewState === 'result' && lastResult && (
        <CBTStudentResult
          result={lastResult}
          config={config}
          onReturnToLogin={handleReturnToLogin}
        />
      )}

      {/* 4. ADMIN & PROKTOR CONTROL PANEL */}
      {viewState === 'admin' && (
        <CBTAdminPanel
          config={config}
          students={students}
          results={results}
          questions={questions}
          connectionStatus={connectionStatus}
          onUpdateConfig={(newConfig) => {
            setConfig(newConfig);
            saveCBTConfig(newConfig);
          }}
          onUpdateStudents={(newStudents) => {
            setStudents(newStudents);
            saveCBTStudents(newStudents);
          }}
          onUpdateConnectionStatus={setConnectionStatus}
          onCloseAdmin={() => setViewState('login')}
        />
      )}
    </div>
  );
};
