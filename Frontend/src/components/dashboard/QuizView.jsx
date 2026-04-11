import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { fetchProgress, saveProgress } from '../../features/api';
import Sidebar from './Sidebar';
import StatsPanel from './StatsPanel';
import { API_URL } from '../../features/api';

export default function QuizView({ user, questions, selectedRound, setSelectedRound }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [attempts, setAttempts] = useState({});
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Theory');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewingHistoryIndex, setViewingHistoryIndex] = useState(null);

  const MAX_ATTEMPTS = 4;

  useEffect(() => {
    if (!selectedRound || !user) return;
    const localKey = `quiz_draft_${user.id}_${selectedRound}`;
    const localData = localStorage.getItem(localKey);
    if (localData) {
      const parsed = JSON.parse(localData);
      setUserAnswers(parsed.userAnswers || {});
      setScores(parsed.scores || {});
      setAttempts(parsed.attempts || {});
      setHistory(parsed.history || []);
    }

    const loadDBData = async () => {
      try {
        const savedData = await fetchProgress(selectedRound);
        if (savedData && Object.keys(savedData.scores || {}).length > 0) {
          setUserAnswers(savedData.userAnswers || {});
          setScores(savedData.scores || {});
          setAttempts(savedData.attempts || {});
          setHistory(savedData.history || []);
        }
      } catch (err) { console.error("DB Sync failed"); }
    };
    loadDBData();
  }, [selectedRound, user]);

  const roundQuestions = [...questions].filter(q => q.title === selectedRound).reverse();

  const syncData = async (newAnswers, newScores, newAttempts, newHistory) => {
    const currentScores = newScores || scores;
    let totalTheory = 0;
    let totalPractical = 0;

    roundQuestions.forEach(q => {
      const evalData = currentScores[q._id];
      if (evalData && evalData.isLocked) {
        if (q.section === 'Theory' || !q.section) totalTheory += evalData.points;
        else if (q.section === 'Practical') totalPractical += evalData.points;
      }
    });

    const localKey = `quiz_draft_${user?.id}_${selectedRound}`;
    localStorage.setItem(localKey, JSON.stringify({
      userAnswers: newAnswers || userAnswers,
      scores: currentScores,
      attempts: newAttempts || attempts,
      history: newHistory || history
    }));

    try {
      await saveProgress({
        moduleName: selectedRound,
        userAnswers: newAnswers || userAnswers,
        scores: { ...currentScores, theory: totalTheory, practical: totalPractical },
        attempts: newAttempts || attempts,
        history: newHistory || history
      });
    } catch (err) { console.error("Failed to sync to DB"); }
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#00A896', '#30D158', '#E5F1F0', '#FFFFFF'], zIndex: 9999 });
  };

  const updateScoreAndSave = (qId, resultObj, nAnswers, nAttempts) => {
    const nScores = { ...scores, [qId]: resultObj };
    setScores(nScores);
    syncData(nAnswers, nScores, nAttempts, history);
    
    if (resultObj.isLocked) {
      const currentTabQuestions = roundQuestions.filter(q => (q.section || 'Theory') === activeTab);
      const currentIndex = currentTabQuestions.findIndex(q => q._id === qId);
      
      if (currentIndex !== -1 && currentIndex < currentTabQuestions.length - 1) {
        const nextId = currentTabQuestions[currentIndex + 1]._id;
        setTimeout(() => { document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 500);
      } else if (activeTab === 'Theory') {
        // Switch to practical tab if theory is done
        setTimeout(() => { 
          setActiveTab('Practical'); 
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000); 
      }
    }
  };

  const autoEvaluate = (questionId, expectedAns, userAns) => {
    const currentAttempts = (attempts[questionId] || 0) + 1;
    const newAttempts = { ...attempts, [questionId]: currentAttempts };
    setAttempts(newAttempts);

    const newUserAnswers = { ...userAnswers, [questionId]: userAns };
    setUserAnswers(newUserAnswers);

    const expectedWithoutCode = expectedAns.replace(/```[\s\S]*?```/g, '');
    const expectedWords = [...new Set(expectedWithoutCode.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])];
    const userWords = [...new Set(userAns.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])];
    const stopWords = ['the', 'and', 'for', 'that', 'this', 'with', 'what', 'when', 'how', 'are', 'you', 'can', 'use'];
    const filteredExpected = expectedWords.filter(w => !stopWords.includes(w));

    if (filteredExpected.length === 0) {
      updateScoreAndSave(questionId, { points: 1, status: 'Verified', isLocked: true }, newUserAnswers, newAttempts);
      triggerConfetti();
      return;
    }

    let matchCount = 0;
    filteredExpected.forEach(w => { if (userWords.includes(w)) matchCount++; });
    const matchPercentage = matchCount / filteredExpected.length;

    if (matchPercentage >= 0.40) {
      updateScoreAndSave(questionId, { points: 1, status: 'Passed', isLocked: true }, newUserAnswers, newAttempts);
      triggerConfetti();
    } else if (matchPercentage >= 0.20) {
      updateScoreAndSave(questionId, { points: 0.5, status: 'Partial', isLocked: true }, newUserAnswers, newAttempts);
    } else {
      if (currentAttempts >= MAX_ATTEMPTS) updateScoreAndSave(questionId, { points: 0, status: 'Failed', isLocked: true }, newUserAnswers, newAttempts);
      else updateScoreAndSave(questionId, { points: 0, status: `Retry ${currentAttempts}/${MAX_ATTEMPTS}`, isLocked: false }, newUserAnswers, newAttempts);
    }
  };

  const evaluateHistoryQuestion = (qId, expectedAns, userAns) => {
    const expectedWithoutCode = expectedAns.replace(/```[\s\S]*?```/g, '');
    const expectedWords = [...new Set(expectedWithoutCode.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])];
    const userWords = [...new Set(userAns.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])];
    let matchCount = 0;
    expectedWords.forEach(w => { if (userWords.includes(w)) matchCount++; });
    const matchPercentage = matchCount / (expectedWords.length || 1);

    let resultObj = { points: 0, status: 'Failed', isLocked: true };
    if (matchPercentage >= 0.40) {
      resultObj = { points: 1, status: 'Passed', isLocked: true };
      triggerConfetti(); 
    } else if (matchPercentage >= 0.20) {
      resultObj = { points: 0.5, status: 'Partial', isLocked: true };
    }

    const updatedHistory = [...history];
    updatedHistory[viewingHistoryIndex].savedScores[qId] = resultObj;

    const newTotal = Object.values(updatedHistory[viewingHistoryIndex].savedScores).reduce((acc, curr) => acc + (curr.points || 0), 0);
    updatedHistory[viewingHistoryIndex].score = newTotal;

    setHistory(updatedHistory);
    syncData(userAnswers, scores, attempts, updatedHistory);
  };

  const handleTextChange = (qId, text) => {
    if (viewingHistoryIndex !== null) {
      const updatedHistory = [...history];
      const targetSession = { ...updatedHistory[viewingHistoryIndex] };
      targetSession.savedAnswers = { ...targetSession.savedAnswers, [qId]: text };
      const updatedScores = { ...targetSession.savedScores };
      delete updatedScores[qId];
      targetSession.savedScores = updatedScores;
      updatedHistory[viewingHistoryIndex] = targetSession;
      setHistory(updatedHistory);
      syncData(userAnswers, scores, attempts, updatedHistory);
    } else {
      const newAnswers = { ...userAnswers, [qId]: text };
      setUserAnswers(newAnswers);
      syncData(newAnswers, scores, attempts, history);
    }
  };

  const handleNewAttempt = () => {
    if (Object.keys(scores).length === 0) return alert("Complete a session to archive.");
    if (window.confirm("Archive this session and start fresh?")) {
      let stats = { passed: 0, partial: 0, failed: 0, totalScore: 0 };
      roundQuestions.forEach(q => {
        const evalData = scores[q._id];
        if (evalData?.isLocked) {
          stats.totalScore += evalData.points;
          if (evalData.points === 1) stats.passed++;
          else if (evalData.points === 0.5) stats.partial++;
          else if (evalData.points === 0) stats.failed++;
        }
      });
      const newHistory = [{ date: new Date().toLocaleString(), ...stats, score: stats.totalScore, savedAnswers: { ...userAnswers }, savedScores: { ...scores }, savedAttempts: { ...attempts } }, ...history];
      setScores({}); setUserAnswers({}); setAttempts({}); setHistory(newHistory);
      setViewingHistoryIndex(null); syncData({}, {}, {}, newHistory);
      setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleForceSubmit = async () => {
    let tTheory = 0; let tPractical = 0;
    roundQuestions.forEach(q => {
      const evalData = scores[q._id];
      if (evalData?.isLocked) {
        if (q.section === 'Practical') tPractical += evalData.points;
        else tTheory += evalData.points;
      }
    });

    try {
      const storedUser = JSON.parse(localStorage.getItem('user')) || {};
      const token = user?.token || storedUser?.token || ""; 
      // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}api/evaluations/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ moduleName: selectedRound, userAnswers, scores: { ...scores, theory: tTheory, practical: tPractical }, attempts, history })
      });
      if (response.ok) alert("✅ 100% Saved!");
      else alert("❌ Failed to save.");
    } catch (err) { alert("❌ Critical Error."); }
  };

  const isHistoryMode = viewingHistoryIndex !== null;
  const activeAnswers = isHistoryMode ? (history[viewingHistoryIndex].savedAnswers || {}) : userAnswers;
  const activeScores = isHistoryMode ? (history[viewingHistoryIndex].savedScores || {}) : scores;
  const activeAttempts = isHistoryMode ? (history[viewingHistoryIndex].savedAttempts || {}) : attempts;

  const groupedQuestions = roundQuestions.reduce((acc, q) => {
    const section = q.section || 'Theory';
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {});

  const currentTabQuestions = groupedQuestions[activeTab] || [];
  let stats = { passed: 0, partial: 0, failed: 0, totalScore: 0 };
  currentTabQuestions.forEach(q => {
    const evalData = activeScores[q._id];
    if (evalData?.isLocked) {
      stats.totalScore += evalData.points;
      if (evalData.points === 1) stats.passed++;
      else if (evalData.points === 0.5) stats.partial++;
      else if (evalData.points === 0) stats.failed++;
    }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#E5F1F0] text-[#1A2533] font-sans relative">
      
      {/* 1. The Separated Left Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleExitModule={() => setSelectedRound(null)}
        isHistoryMode={isHistoryMode}
        setViewingHistoryIndex={setViewingHistoryIndex}
        handleNewAttempt={handleNewAttempt}
        history={history}
        viewingHistoryIndex={viewingHistoryIndex}
      />

      <main className="flex-1 h-full overflow-y-auto bg-[#E5F1F0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 pb-16">
          <header className="lg:hidden sticky top-0 z-30 bg-[#E5F1F0]/95 backdrop-blur-sm py-4 border-b-2 border-[#EAEAEA] flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-white border rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
            <h1 className="text-xl font-black truncate">{isHistoryMode ? `Archive: ${history[viewingHistoryIndex].date.split(',')[0]}` : selectedRound}</h1>
          </header>
          <div className="hidden lg:block pt-10 pb-6"><h1 className="text-4xl font-black">{selectedRound}</h1><p className="text-sm text-[#888888] mt-2 font-medium">{isHistoryMode ? <span className="text-[#00A896] font-bold px-3 py-1 bg-[#00A896]/10 rounded-full border border-[#00A896]/30">👀 Viewing Archived Session: {history[viewingHistoryIndex].date}</span> : "Complete the challenges below."}</p></div>
          
          <div className="flex gap-6 border-b-2 border-[#D9E9E8] mb-8 sticky lg:static top-0 bg-[#E5F1F0] z-20 pt-2">
            {Object.keys(groupedQuestions).map(section => (
              <button key={section} onClick={() => setActiveTab(section)} className={`pb-3 text-sm font-black uppercase tracking-widest border-b-[3px] transition-all ${activeTab === section ? 'border-[#00A896] text-[#1A2533]' : 'border-transparent text-[#888888]'}`}>
                {section}<span className={`ml-2 px-2 py-0.5 text-[10px] rounded-full ${activeTab === section ? 'bg-[#00A896] text-white' : 'bg-white text-[#888888]'}`}>{groupedQuestions[section].length}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {currentTabQuestions.map((q, index) => {
              const evalRes = activeScores[q._id];
              const locked = isHistoryMode || evalRes?.isLocked;
              const currentAttempts = activeAttempts[q._id] || 0;

              return (
                <div id={q._id} key={q._id} className={`bg-white p-6 md:p-8 rounded-3xl transition-all border-2 ${locked ? (evalRes?.points === 1 ? 'border-[#30D158] bg-[#E5FAF0]' : evalRes?.points === 0.5 ? 'border-[#0A84FF] bg-[#EBF5FF]' : 'border-[#FF3B30] bg-[#FFF1F0]') : 'border-[#EAEAEA]'}`}>
                  <div className="flex justify-between items-center mb-6"><div className="flex gap-3 items-center"><span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${evalRes?.points > 0 ? 'bg-[#30D158] text-white' : 'bg-[#E5F1F0] text-[#00A896]'}`}>{index + 1}</span><span className="text-[10px] uppercase font-bold text-white bg-[#00A896] px-3 py-1.5 rounded-full">{q.tags ? q.tags[0] : 'Concept'}</span></div>{evalRes && <span className={`text-[11px] font-bold px-4 py-1.5 rounded-full ${evalRes.points === 1 ? 'bg-[#30D158] text-white' : evalRes.points === 0.5 ? 'bg-[#0A84FF] text-white' : 'bg-[#FF3B30] text-white'}`}>{evalRes.status}</span>}</div>
                  <h3 className="text-xl font-bold mb-5 leading-snug">{q.questionText}</h3>
                  <textarea className={`w-full p-4 bg-[#F9F9F9] rounded-xl outline-none text-base ${locked ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white'}`} rows="3" value={activeAnswers[q._id] || ""} onChange={(e) => handleTextChange(q._id, e.target.value)} disabled={!isHistoryMode && locked} />
                  
                  {(!locked || (isHistoryMode && !activeScores[q._id])) && (
                    <button onClick={() => {
                        if (isHistoryMode) evaluateHistoryQuestion(q._id, q.solutionMarkdown, activeAnswers[q._id]);
                        else autoEvaluate(q._id, q.solutionMarkdown, activeAnswers[q._id]);
                      }} 
                      className="w-full py-3.5 rounded-xl text-sm font-black bg-[#00A896] text-white shadow-md active:scale-95 transition-all mt-4"
                    >
                      {isHistoryMode ? 'Re-verify Answer' : currentAttempts > 0 ? `Try Again (${MAX_ATTEMPTS - currentAttempts} left)` : 'Check Understanding'}
                    </button>
                  )}
                  
                  {(locked || isHistoryMode) && evalRes && <div className="mt-2 pt-6 border-t-2 border-[#EAEAEA] animate-fade-in"><h4 className="text-xs text-[#888888] uppercase font-black tracking-widest mb-3">Core Concept</h4><div className="text-sm text-[#00A896] bg-[#E5F1F0] p-5 rounded-xl border font-mono whitespace-pre-wrap">{q.solutionMarkdown}</div></div>}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 2. The Separated Right Stats Panel */}
      <StatsPanel 
        isHistoryMode={isHistoryMode}
        activeTab={activeTab}
        stats={stats}
        currentTabQuestions={currentTabQuestions}
        activeScores={activeScores}
        handleForceSubmit={handleForceSubmit}
      />
    </div>
  );
}