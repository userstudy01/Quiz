import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';
import { fetchQuestions, fetchProgress, saveProgress } from '../features/api';
import confetti from 'canvas-confetti'; // 🎉 Confetti library added!

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({}); 
  const [attempts, setAttempts] = useState({}); 
  const [history, setHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Theory');
  
  // Tracking if user is viewing a past session
  const [viewingHistoryIndex, setViewingHistoryIndex] = useState(null);

  const MAX_ATTEMPTS = 4; 

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setIsLoading(false);
      }
    };
    getQuestions();
  }, []);

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
      } catch (err) {
        console.error("DB Sync failed");
      }
    };
    loadDBData();
  }, [selectedRound, user]);

  const syncData = async (newAnswers, newScores, newAttempts, newHistory) => {
    const localKey = `quiz_draft_${user?.id}_${selectedRound}`;
    localStorage.setItem(localKey, JSON.stringify({
      userAnswers: newAnswers || userAnswers,
      scores: newScores || scores,
      attempts: newAttempts || attempts,
      history: newHistory || history
    }));

    try {
      await saveProgress({
        moduleName: selectedRound,
        userAnswers: newAnswers || userAnswers,
        scores: newScores || scores,
        attempts: newAttempts || attempts,
        history: newHistory || history
      });
    } catch (err) {
      console.error("Failed to sync to DB");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const roundQuestions = selectedRound ? [...questions].filter(q => q.title === selectedRound).reverse() : [];

  // 🎉 FIRE CONFETTI BLAST FUNCTION
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#0D9488', '#14B8A6', '#F0F5F4', '#FFD700'], // Matches your new theme!
      zIndex: 9999
    });
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
      triggerConfetti(); // 🎉 BLAST CONFETTI HERE!
      return;
    }

    let matchCount = 0;
    filteredExpected.forEach(w => { if (userWords.includes(w)) matchCount++; });
    const matchPercentage = matchCount / filteredExpected.length;

    if (matchPercentage >= 0.40) {
      updateScoreAndSave(questionId, { points: 1, status: 'Passed', isLocked: true }, newUserAnswers, newAttempts);
      triggerConfetti(); // 🎉 BLAST CONFETTI HERE TOO!
    } else if (matchPercentage >= 0.20) {
      updateScoreAndSave(questionId, { points: 0.5, status: 'Partial', isLocked: true }, newUserAnswers, newAttempts);
    } else {
      handleFailLogic(questionId, currentAttempts, newUserAnswers, newAttempts);
    }
  };

  const handleFailLogic = (questionId, currentAttempts, newUserAnswers, newAttempts) => {
    if (currentAttempts >= MAX_ATTEMPTS) {
      updateScoreAndSave(questionId, { points: 0, status: 'Failed', isLocked: true }, newUserAnswers, newAttempts);
    } else {
      updateScoreAndSave(questionId, { points: 0, status: `Retry ${currentAttempts}/${MAX_ATTEMPTS}`, isLocked: false }, newUserAnswers, newAttempts);
    }
  };

  const updateScoreAndSave = (questionId, resultObj, newUserAnswers, newAttempts) => {
    const newScores = { ...scores, [questionId]: resultObj };
    setScores(newScores);
    syncData(newUserAnswers, newScores, newAttempts, history);

    if (resultObj.isLocked) {
      const currentTabQuestions = roundQuestions.filter(q => (q.section || 'Theory') === activeTab);
      const currentIndex = currentTabQuestions.findIndex(q => q._id === questionId);
      if (currentIndex !== -1 && currentIndex < currentTabQuestions.length - 1) {
        const nextQuestionId = currentTabQuestions[currentIndex + 1]._id;
        setTimeout(() => {
          document.getElementById(nextQuestionId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
  };

  const handleTextChange = (qId, text) => {
    const newAnswers = { ...userAnswers, [qId]: text };
    setUserAnswers(newAnswers);
    syncData(newAnswers, scores, attempts, history);
  };

  const handleNewAttempt = () => {
    if (Object.keys(scores).length === 0) return alert("Complete a session to archive.");
    if (window.confirm("Archive this session and start fresh?")) {
      
      const newHistory = [{
        date: new Date().toLocaleString(), 
        ...stats, 
        score: stats.totalScore,
        savedAnswers: { ...userAnswers }, 
        savedScores: { ...scores },       
        savedAttempts: { ...attempts }    
      }, ...history];

      setScores({}); setUserAnswers({}); setAttempts({}); setHistory(newHistory); 
      setViewingHistoryIndex(null); 
      syncData({}, {}, {}, newHistory); 
      setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModuleSelect = (roundName) => {
    setSelectedRound(roundName);
    setActiveTab('Theory'); 
    setViewingHistoryIndex(null); 
  };

  const scrollToQuestion = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-medium text-[#0D9488] bg-[#DFEAE9]">Preparing Environment...</div>;

  const availableRounds = [...new Set([...questions].reverse().map(q => q.title))];

  // ================= VIEW 1: MODULE SELECTION =================
  if (!selectedRound) {
    return (
      <div className="min-h-screen bg-[#DFEAE9] text-[#111827] selection:bg-[#0D9488]/20 font-sans">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <header className="flex justify-between items-center pb-6 mb-10 border-b-2 border-[#C5D7D6]">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#111827]">
                Knowledge <span className="text-[#14B8A6]">Hub</span>
              </h1>
              <p className="text-sm text-[#64748B] mt-2 font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></span>
                Welcome back, {user?.name}
              </p>
            </div>
            <button onClick={handleLogout} className="text-sm font-bold text-[#111827] bg-white hover:bg-[#F0F5F4] border border-[#C5D7D6] px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95">
              Sign Out
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRounds.length === 0 ? (
              <div className="col-span-full text-center text-[#64748B] mt-10 border-2 border-dashed border-[#C5D7D6] p-10 rounded-[1.5rem] bg-[#F0F5F4]">No modules available.</div>
            ) : (
              availableRounds.map((roundName, index) => {
                const qCount = questions.filter(q => q.title === roundName).length;
                const cardColors = ['bg-[#0D9488] text-white', 'bg-[#ffffff] text-[#111827] border border-[#C5D7D6]', 'bg-[#14B8A6] text-white'];
                const colorTheme = cardColors[index % 3];

                return (
                  <div key={index} onClick={() => handleModuleSelect(roundName)} className={`${colorTheme} p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm flex flex-col min-h-[180px]`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index % 3 === 1 ? 'bg-[#DFEAE9] text-[#0D9488]' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 leading-tight">{roundName}</h3>
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <p className={`text-xs font-bold ${index % 3 === 1 ? 'text-[#64748B]' : 'text-white/80'}`}>{qCount} Challenges</p>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${index % 3 === 1 ? 'bg-[#0D9488] text-white' : 'bg-white text-black'}`}>→</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= DYNAMIC DATA SELECTION =================
  const isHistoryMode = viewingHistoryIndex !== null;
  const activeAnswers = isHistoryMode ? (history[viewingHistoryIndex].savedAnswers || {}) : userAnswers;
  const activeScores = isHistoryMode ? (history[viewingHistoryIndex].savedScores || {}) : scores;
  const activeAttempts = isHistoryMode ? (history[viewingHistoryIndex].savedAttempts || {}) : attempts;

  // ================= VIEW 2: SELECTED ROUND =================
  let stats = { passed: 0, partial: 0, failed: 0, totalScore: 0 };
  roundQuestions.forEach(q => {
    const evalData = activeScores[q._id];
    if (evalData && evalData.isLocked) {
      stats.totalScore += evalData.points;
      if (evalData.points === 1) stats.passed++;
      else if (evalData.points === 0.5) stats.partial++;
      else if (evalData.points === 0) stats.failed++;
    }
  });

  const groupedQuestions = roundQuestions.reduce((acc, q) => {
    const section = q.section || 'Theory';
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {});

  const availableSections = Object.keys(groupedQuestions);
  const currentTabQuestions = groupedQuestions[activeTab] || [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#DFEAE9] text-[#111827] font-sans relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-[#111827]/30 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* LEFT SIDEBAR */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-80 bg-[#1E293B] border-r border-[#1E293B] z-50 lg:z-10 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex justify-between items-center p-6 border-b border-[#334155]">
          <h3 className="text-sm font-black text-white uppercase tracking-wide">Workspace</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden w-7 h-7 flex items-center justify-center bg-[#334155] rounded-full text-white shadow-sm border border-[#334155] text-xs">✖</button>
        </div>
        
        <div className="p-6 space-y-4">
          <button onClick={() => setSelectedRound(null)} className="w-full bg-[#334155] hover:bg-[#475569] text-white border border-[#334155] font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2">
            ← Exit Module
          </button>
          
          {isHistoryMode ? (
            <button onClick={() => setViewingHistoryIndex(null)} className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
              ← Resume Current Session
            </button>
          ) : (
            <button onClick={handleNewAttempt} className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
              ⟳ Restart Session
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 border-t border-[#334155]/50">
          <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">Past Sessions</h4>
          {history.length === 0 ? (
            <div className="p-4 rounded-xl text-center bg-[#334155] border border-[#334155]"><p className="text-[#94A3B8] text-xs font-medium">No history yet.</p></div>
          ) : (
            <div className="space-y-3">
              {history.map((record, i) => (
                <div 
                  key={i} 
                  onClick={() => setViewingHistoryIndex(i)}
                  className={`p-4 rounded-xl shadow-sm cursor-pointer transition-all border ${
                    viewingHistoryIndex === i 
                      ? 'bg-[#475569] border-[#14B8A6] shadow-md ring-1 ring-[#14B8A6]' 
                      : 'bg-[#334155] border-[#334155] hover:border-[#14B8A6]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-[#E2E8F0]">{record.date.split(',')[0]}</span>
                    <span className="text-[10px] font-black bg-[#14B8A6] text-white px-2 py-0.5 rounded-full shadow-sm">XP: {record.score}</span>
                  </div>
                  <div className="flex gap-1.5 text-[10px] font-bold">
                    <span className="text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded">P:{record.passed}</span>
                    <span className="text-[#14B8A6] bg-[#14B8A6]/10 px-1.5 py-0.5 rounded">M:{record.partial}</span>
                    <span className="text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">F:{record.failed}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CENTER CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth w-full flex flex-col">
        <div className="max-w-4xl w-full mx-auto px-6 lg:px-10 pb-16 flex-1">
          
          {/* Mobile-only Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-[#DFEAE9]/95 backdrop-blur-sm pt-6 pb-4 mb-6 border-b-2 border-[#C5D7D6] flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-white border border-[#C5D7D6] rounded-full shadow-sm text-[#111827]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h1 className="text-xl font-black text-[#111827] leading-tight truncate">
                {isHistoryMode ? `Archive: ${history[viewingHistoryIndex].date.split(',')[0]}` : selectedRound}
              </h1>
            </div>
          </header>

          {/* Desktop Title */}
          <div className="hidden lg:block pt-10 pb-6">
            <h1 className="text-4xl font-black text-[#111827] leading-tight">
              {selectedRound}
            </h1>
            <p className="text-sm text-[#64748B] mt-2 font-medium">
              {isHistoryMode ? (
                <span className="text-[#14B8A6] font-bold px-3 py-1 bg-[#14B8A6]/10 rounded-full border border-[#14B8A6]/30">
                  👀 Viewing Archived Session: {history[viewingHistoryIndex].date}
                </span>
              ) : "Complete the challenges below."}
            </p>
          </div>

          <div className="flex gap-6 border-b-2 border-[#C5D7D6] mb-8 lg:mt-4 sticky lg:static top-0 bg-[#DFEAE9] z-20 pt-2">
            {availableSections.map(section => (
              <button
                key={section}
                onClick={() => setActiveTab(section)}
                className={`pb-3 text-sm font-black uppercase tracking-widest transition-colors border-b-[3px] outline-none ${
                  activeTab === section
                    ? 'border-[#0D9488] text-[#0D9488]'
                    : 'border-transparent text-[#94A3B8] hover:text-[#64748B]'
                }`}
              >
                {section}
                <span className={`ml-2 px-2 py-0.5 text-[10px] rounded-full ${activeTab === section ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-white text-[#94A3B8]'}`}>
                  {groupedQuestions[section].length}
                </span>
              </button>
            ))}
          </div>

          {/* ACTIVE TAB QUESTIONS */}
          <div className="space-y-6">
            {currentTabQuestions.map((q, index) => {
              const evaluation = activeScores[q._id];
              const isLocked = isHistoryMode || evaluation?.isLocked;
              const currentAttempts = activeAttempts[q._id] || 0;
              const isPassed = evaluation?.points > 0;

              return (
                <div id={q._id} key={q._id} className="relative">
                  <div className={`bg-white p-6 md:p-8 rounded-3xl transition-all duration-300 ${isLocked ? (evaluation?.points > 0 ? 'border-2 border-[#0D9488] bg-[#F0F5F4] shadow-sm' : 'border-2 border-red-200 bg-red-50/50') : 'shadow-sm border border-[#C5D7D6]'}`}>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-3 items-center">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${isPassed ? 'bg-[#0D9488] text-white shadow-sm' : 'bg-[#DFEAE9] text-[#0D9488]'}`}>
                          {index + 1}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#14B8A6] tracking-widest bg-[#E0F2F1] px-3 py-1.5 rounded-full">
                          {q.tags ? q.tags[0] : 'Concept'}
                        </span>
                      </div>
                      
                      {evaluation && (
                        <span className={`text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm ${
                          evaluation.points === 1 ? 'bg-[#0D9488] text-white' : 
                          evaluation.points === 0.5 ? 'bg-[#14B8A6] text-white' : 
                          evaluation.isLocked ? 'bg-red-500 text-white' :
                          'bg-orange-100 text-orange-800' 
                        }`}>
                          {evaluation.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#111827] mb-5 leading-snug">{q.questionText}</h3>
                    
                    <textarea
                      className={`w-full p-4 bg-[#F0F5F4] border-none rounded-xl outline-none resize-none text-base text-[#111827] mb-5 leading-relaxed transition-all shadow-inner placeholder:text-[#94A3B8] ${isLocked ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#14B8A6]/50 focus:bg-white'}`}
                      rows="3"
                      placeholder={isHistoryMode ? "No answer provided in this session." : isLocked ? "Response archived." : "Share your understanding here..."}
                      value={activeAnswers[q._id] || ""}
                      onChange={(e) => handleTextChange(q._id, e.target.value)}
                      disabled={isLocked}
                    ></textarea>

                    {!isLocked && !isHistoryMode && (
                      <button onClick={() => autoEvaluate(q._id, q.solutionMarkdown, activeAnswers[q._id])}
                      className="w-full py-3.5 rounded-xl text-sm font-black tracking-wide transition-all active:scale-[0.98] bg-[#0D9488] text-white shadow-md hover:bg-[#0F766E]">
                        {currentAttempts > 0 ? `Try Again (${MAX_ATTEMPTS - currentAttempts} left)` : 'Check Understanding'}
                      </button>
                    )}

                    {(isLocked || isHistoryMode) && evaluation && (
                      <div className="mt-2 pt-6 border-t-2 border-[#C5D7D6] animate-fade-in">
                        <h4 className="text-xs text-[#64748B] uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#14B8A6]"></span> Core Concept
                        </h4>
                        <div className="text-sm text-[#0D9488] font-medium bg-white p-5 rounded-xl border border-[#C5D7D6] leading-relaxed shadow-sm whitespace-pre-wrap font-mono">
                          {q.solutionMarkdown}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden xl:flex w-80 bg-[#DFEAE9] border-l border-[#C5D7D6] flex-col h-full">
        <div className="p-6 border-b border-[#C5D7D6] bg-white">
          <h3 className="text-sm font-black text-[#111827] uppercase tracking-wide mb-4">
            {isHistoryMode ? 'Archived Score' : 'Module Score'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#DFEAE9] p-3 rounded-xl border border-[#C5D7D6]">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Passed</div>
              <div className="text-lg font-black text-[#0D9488]">{stats.passed}</div>
            </div>
            <div className="bg-[#E0F2F1] p-3 rounded-xl border border-[#C5D7D6]">
              <div className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider mb-1">NEEDS IMPROVEMENT</div>
              <div className="text-lg font-black text-[#14B8A6]">{stats.partial}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Failed</div>
              <div className="text-lg font-black text-red-600">{stats.failed}</div>
            </div>
            <div className="bg-[#0D9488] p-3 rounded-xl border border-[#0F766E] shadow-md">
              <div className="text-[10px] font-bold text-[#DFEAE9] uppercase tracking-wider mb-1">Total XP</div>
              <div className="text-lg font-black text-white">{stats.totalScore}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#DFEAE9]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Progress Map</h4>
            <span className="text-[10px] font-bold text-[#14B8A6] bg-[#E0F2F1] px-2 py-0.5 rounded-full">{activeTab}</span>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {currentTabQuestions.map((q, i) => {
              const evalData = activeScores[q._id];
              let btnClass = "bg-white border-[#C5D7D6] text-[#64748B] hover:border-[#14B8A6]"; 
              
              if (evalData?.isLocked) {
                if (evalData.points === 1) btnClass = "bg-[#0D9488] border-[#0D9488] text-white shadow-sm"; 
                else if (evalData.points === 0.5) btnClass = "bg-[#14B8A6] border-[#14B8A6] text-white shadow-sm"; 
                else btnClass = "bg-red-500 border-red-500 text-white shadow-sm"; 
              } else if (evalData) {
                btnClass = "bg-orange-100 border-orange-300 text-orange-800 animate-pulse"; 
              }

              return (
                <button 
                  key={q._id}
                  onClick={() => scrollToQuestion(q._id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border transition-all ${btnClass}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}