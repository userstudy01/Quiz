import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';
import { fetchQuestions, fetchProgress, saveProgress } from '../features/api';
import confetti from 'canvas-confetti';

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
    const currentScores = newScores || scores;

    // 🔥 THIS IS THE FIX: Calculate totals so the Admin Panel can see them!
    let totalTheory = 0;
    let totalPractical = 0;

    roundQuestions.forEach(q => {
      const evalData = currentScores[q._id];
      if (evalData && evalData.isLocked) {
        if (q.section === 'Theory' || !q.section) {
          totalTheory += evalData.points;
        } else if (q.section === 'Practical') {
          totalPractical += evalData.points;
        }
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
        // 🔥 Send both the detailed scores AND the calculated totals
        scores: {
          ...currentScores,
          theory: totalTheory,
          practical: totalPractical
        },
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

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00A896', '#30D158', '#E5F1F0', '#FFFFFF'],
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
    if (viewingHistoryIndex !== null) {
      // 🟢 CHANGE: Editing Past Sessions
      const updatedHistory = [...history];
      const targetSession = { ...updatedHistory[viewingHistoryIndex] };

      // 1. Update the text
      targetSession.savedAnswers = { ...targetSession.savedAnswers, [qId]: text };

      // 2. IMPORTANT: Remove the "Locked" status and points so the red/green border goes away
      const updatedScores = { ...targetSession.savedScores };
      delete updatedScores[qId]; // This removes the "Failed" or "Passed" state while typing
      targetSession.savedScores = updatedScores;

      updatedHistory[viewingHistoryIndex] = targetSession;
      setHistory(updatedHistory);

      // Sync to DB
      syncData(userAnswers, scores, attempts, updatedHistory);
    } else {
      // Standard logic for current session
      const newAnswers = { ...userAnswers, [qId]: text };
      setUserAnswers(newAnswers);
      syncData(newAnswers, scores, attempts, history);
    }
  };

  const handleNewAttempt = () => {
    if (Object.keys(scores).length === 0) return alert("Complete a session to archive.");
    if (window.confirm("Archive this session and start fresh?")) {

      // Calculate overall stats for history archival (All questions combined)
      let overallStats = { passed: 0, partial: 0, failed: 0, totalScore: 0 };
      roundQuestions.forEach(q => {
        const evalData = scores[q._id];
        if (evalData && evalData.isLocked) {
          overallStats.totalScore += evalData.points;
          if (evalData.points === 1) overallStats.passed++;
          else if (evalData.points === 0.5) overallStats.partial++;
          else if (evalData.points === 0) overallStats.failed++;
        }
      });

      const newHistory = [{
        date: new Date().toLocaleString(),
        ...overallStats,
        score: overallStats.totalScore,
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-medium text-[#1A2533] bg-[#E5F1F0]">Preparing Environment...</div>;

  const availableRounds = [...new Set([...questions].reverse().map(q => q.title))];

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
      triggerConfetti(); // 🎊 This gives you the celebration effect in history mode!
    } else if (matchPercentage >= 0.20) {
      resultObj = { points: 0.5, status: 'Partial', isLocked: true };
    }

    const updatedHistory = [...history];
    updatedHistory[viewingHistoryIndex].savedScores[qId] = resultObj;

    // Update total XP for the sidebar
    const newTotal = Object.values(updatedHistory[viewingHistoryIndex].savedScores)
      .reduce((acc, curr) => acc + (curr.points || 0), 0);
    updatedHistory[viewingHistoryIndex].score = newTotal;

    setHistory(updatedHistory);
    syncData(userAnswers, scores, attempts, updatedHistory);
  };

  // 🔥 FINAL BULLETPROOF SAVE FUNCTION
  const handleForceSubmit = async () => {
    // 1. Calculate totals
    let totalTheory = 0;
    let totalPractical = 0;

    roundQuestions.forEach(q => {
      const evalData = scores[q._id];
      if (evalData && evalData.isLocked) {
        if (q.section === 'Theory' || !q.section) {
          totalTheory += evalData.points;
        } else if (q.section === 'Practical') {
          totalPractical += evalData.points;
        }
      }
    });

    const payload = {
      moduleName: selectedRound,
      userAnswers: userAnswers,
      scores: {
        ...scores,
        theory: totalTheory,
        practical: totalPractical
      },
      attempts: attempts,
      history: history
    };

    try {
      // 2. Grab the Token
      const storedUser = JSON.parse(localStorage.getItem('user')) || {};
      const token = user?.token || storedUser?.token || ""; 

      // 3. Fetch using Vite Proxy (No localhost needed, avoids CORS blocks)
     const response = await fetch('http://localhost:5000/api/evaluations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      // 4. Handle Response
      if (response.ok) {
        alert("✅ 100% Saved! Check the Admin Panel now.");
      } else {
        const errData = await response.json();
        alert(`❌ Backend Rejected it: ${errData.message}`);
      }
      
    } catch (err) {
      alert("❌ Critical Error: Please Refresh your browser page (F5) and try again.");
    }
  };
  // ================= VIEW 1: MODULE SELECTION =================
  if (!selectedRound) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] text-[#1A2533] selection:bg-[#00A896]/10 font-sans">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <header className="flex justify-between items-center pb-6 mb-10 border-b-2 border-[#EAEAEA]">
            <div>
              {/* Logo Text - Now Clickable! */}
              <Link to="/" className="cursor-pointer">
                <h1 className="text-4xl font-black tracking-tight text-[#1A2533] hover:opacity-80 transition-opacity">
                  Knowledge <span className="text-[#00A896]">Hub</span>
                </h1>
              </Link>
              <p className="text-sm text-[#888888] mt-2 font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A896]"></span>
                Welcome back, {user?.name}
              </p>
            </div>
            <button onClick={handleLogout} className="text-sm font-bold text-[#1A2533] bg-white hover:bg-[#F9F9F9] border border-[#EAEAEA] px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95">
              Sign Out
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRounds.length === 0 ? (
              <div className="col-span-full text-center text-[#888888] mt-10 border-2 border-dashed border-[#EAEAEA] p-10 rounded-[1.5rem] bg-[#F9F9F9]">No modules available.</div>
            ) : (
              availableRounds.map((roundName, index) => {
                const qCount = questions.filter(q => q.title === roundName).length;
                const cardColors = ['bg-[#00A896] text-white', 'bg-[#FFFFFF] text-[#1A2533] border border-[#EAEAEA]', 'bg-[#1A2533] text-white'];
                const colorTheme = cardColors[index % 3];

                return (
                  <div key={index} onClick={() => handleModuleSelect(roundName)} className={`${colorTheme} p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-soft flex flex-col min-h-[180px]`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index % 3 === 1 ? 'bg-[#E5F1F0] text-[#00A896]' : 'bg-white/10 text-white backdrop-blur-sm'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 leading-tight">{roundName}</h3>
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <p className={`text-xs font-bold ${index % 3 === 1 ? 'text-[#888888]' : 'text-white/80'}`}>{qCount} Challenges</p>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${index % 3 === 1 ? 'bg-[#00A896] text-white' : 'bg-white text-black'}`}>→</span>
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

  // Group Questions First
  const groupedQuestions = roundQuestions.reduce((acc, q) => {
    const section = q.section || 'Theory';
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {});

  const availableSections = Object.keys(groupedQuestions);
  const currentTabQuestions = groupedQuestions[activeTab] || [];

  // ================= VIEW 2: SELECTED ROUND & TAB SPECIFIC STATS =================
  // 🔥 FEATURE: Stats now dynamically calculate ONLY for the currently active tab!
  let stats = { passed: 0, partial: 0, failed: 0, totalScore: 0 };
  currentTabQuestions.forEach(q => {
    const evalData = activeScores[q._id];
    if (evalData && evalData.isLocked) {
      stats.totalScore += evalData.points;
      if (evalData.points === 1) stats.passed++;
      else if (evalData.points === 0.5) stats.partial++;
      else if (evalData.points === 0) stats.failed++;
    }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#E5F1F0] text-[#1A2533] font-sans relative">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && <div className="fixed inset-0 bg-[#1A2533]/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* LEFT SIDEBAR (Contrasting Dark Charcoal Blue) */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-80 bg-[#1A2533] border-r border-[#1A2533] z-50 lg:z-10 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex justify-between items-center p-6 border-b border-[#2A3543]">
          <h3 className="text-sm font-black text-white uppercase tracking-wide">Workspace</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden w-7 h-7 flex items-center justify-center bg-[#2A3543] rounded-full text-white shadow-sm border border-[#2A3543] text-xs">✖</button>
        </div>

        <div className="p-6 space-y-4">
          <button onClick={() => setSelectedRound(null)} className="w-full bg-[#2A3543] hover:bg-[#3A4553] text-white font-bold py-3 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2">
            ← Exit Module
          </button>

          {isHistoryMode ? (
            <button onClick={() => setViewingHistoryIndex(null)} className="w-full bg-[#00A896] hover:bg-[#009686] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
              ← Resume Current Session
            </button>
          ) : (
            <button onClick={handleNewAttempt} className="w-full bg-[#00A896] hover:bg-[#009686] text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
              ⟳ Restart Session
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 border-t border-[#2A3543]/50">
          <h4 className="text-[10px] font-bold text-[#E5F1F0] uppercase tracking-widest mb-4">Past Sessions</h4>
          {history.length === 0 ? (
            <div className="p-4 rounded-xl text-center bg-[#2A3543] border border-[#2A3543]"><p className="text-white/60 text-xs font-medium">No history yet.</p></div>
          ) : (
            <div className="space-y-3">
              {history.map((record, i) => (
                <div
                  key={i}
                  onClick={() => setViewingHistoryIndex(i)}
                  className={`p-4 rounded-xl shadow-sm cursor-pointer transition-all border ${viewingHistoryIndex === i
                    ? 'bg-[#2A3543] border-[#00A896] shadow-md ring-1 ring-[#00A896]'
                    : 'bg-[#2A3543] border-[#2A3543] hover:border-[#00A896]'
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-[#E2E8F0]">{record.date.split(',')[0]}</span>
                    <span className="text-[10px] font-black bg-[#00A896] text-white px-2 py-0.5 rounded-full shadow-sm">XP: {record.score}</span>
                  </div>
                  <div className="flex gap-1.5 text-[10px] font-bold">
                    <span className="text-white bg-[#30D158]/10 px-1.5 py-0.5 rounded">P:{record.passed}</span>
                    <span className="text-white bg-[#0A84FF]/10 px-1.5 py-0.5 rounded">M:{record.partial}</span>
                    <span className="text-white bg-[#FF3B30]/10 px-1.5 py-0.5 rounded">F:{record.failed}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CENTER CONTENT AREA (Crisp Light Background) */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth w-full flex flex-col bg-[#E5F1F0]">
        <div className="max-w-4xl w-full mx-auto px-6 lg:px-10 pb-16 flex-1 relative">

          {/* Mobile-only Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-[#E5F1F0]/95 backdrop-blur-sm pt-6 pb-4 mb-6 border-b-2 border-[#EAEAEA] flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-white border border-[#EAEAEA] rounded-full shadow-sm text-[#1A2533]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h1 className="text-xl font-black text-[#1A2533] leading-tight truncate">
                {isHistoryMode ? `Archive: ${history[viewingHistoryIndex].date.split(',')[0]}` : selectedRound}
              </h1>
            </div>
          </header>

          {/* Desktop Title */}
          <div className="hidden lg:block pt-10 pb-6">
            <h1 className="text-4xl font-black text-[#1A2533] leading-tight">
              {selectedRound}
            </h1>
            <p className="text-sm text-[#888888] mt-2 font-medium">
              {isHistoryMode ? (
                <span className="text-[#00A896] font-bold px-3 py-1 bg-[#00A896]/10 rounded-full border border-[#00A896]/30">
                  👀 Viewing Archived Session: {history[viewingHistoryIndex].date}
                </span>
              ) : "Complete the challenges below."}
            </p>
          </div>

          {/* MOBILE SCORE GRID (Visible only on mobile/tablet) */}
          <div className="xl:hidden grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-[#E5FAF0] p-3 rounded-xl border border-[#D0F0E0]">
              <div className="text-[10px] font-bold text-[#30D158] uppercase tracking-wider mb-1">Passed</div>
              <div className="text-lg font-black text-[#30D158]">{stats.passed}</div>
            </div>
            <div className="bg-[#EBF5FF] p-3 rounded-xl border border-[#D0E5FF]">
              <div className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-wider mb-1">Needs Imp.</div>
              <div className="text-lg font-black text-[#0A84FF]">{stats.partial}</div>
            </div>
            <div className="bg-[#FFF1F0] p-3 rounded-xl border border-[#FFD0D0]">
              <div className="text-[10px] font-bold text-[#FF3B30] uppercase tracking-wider mb-1">Failed</div>
              <div className="text-lg font-black text-[#FF3B30]">{stats.failed}</div>
            </div>
            <div className="bg-[#00A896] p-3 rounded-xl border border-[#009686] shadow-md">
              <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">Total XP</div>
              <div className="text-lg font-black text-white">{stats.totalScore}</div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b-2 border-[#D9E9E8] mb-8 lg:mt-4 sticky lg:static top-0 bg-[#E5F1F0] z-20 pt-2 selection:bg-[#00A896]/10">
            {availableSections.map(section => (
              <button
                key={section}
                onClick={() => setActiveTab(section)}
                className={`pb-3 text-sm font-black uppercase tracking-widest transition-colors border-b-[3px] outline-none ${activeTab === section
                  ? 'border-[#00A896] text-[#1A2533]'
                  : 'border-transparent text-[#888888] hover:text-[#1A2533]'
                  }`}
              >
                {section}
                <span className={`ml-2 px-2 py-0.5 text-[10px] rounded-full ${activeTab === section ? 'bg-[#00A896] text-white' : 'bg-white text-[#888888]'}`}>
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
                  <div className={`bg-white p-6 md:p-8 rounded-3xl transition-all duration-300 shadow-soft ${isLocked ? (evaluation?.points === 1 ? 'border-2 border-[#30D158] bg-[#E5FAF0] shadow-sm' : evaluation?.points === 0.5 ? 'border-2 border-[#0A84FF] bg-[#EBF5FF]' : 'border-2 border-[#FF3B30] bg-[#FFF1F0]') : 'border border-[#EAEAEA]'}`}>

                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-3 items-center">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${isPassed ? 'bg-[#30D158] text-white shadow-sm' : 'bg-[#E5F1F0] text-[#00A896]'}`}>
                          {index + 1}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-white tracking-widest bg-[#00A896] px-3 py-1.5 rounded-full">
                          {q.tags ? q.tags[0] : 'Concept'}
                        </span>
                      </div>

                      {evaluation && (
                        <span className={`text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm ${evaluation.points === 1 ? 'bg-[#30D158] text-white' :
                          evaluation.points === 0.5 ? 'bg-[#0A84FF] text-white' :
                            evaluation.isLocked ? 'bg-[#FF3B30] text-white' :
                              'bg-orange-100 text-orange-800'
                          }`}>
                          {evaluation.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#1A2533] mb-5 leading-snug">{q.questionText}</h3>

                    <textarea
                      className={`w-full p-4 bg-[#F9F9F9] border-none rounded-xl outline-none resize-none text-base text-[#1A2533] mb-5 leading-relaxed transition-all shadow-inner placeholder:text-[#888888] ${isLocked ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white focus:shadow-soft'}`}
                      rows="3"
                      placeholder={isHistoryMode ? "No answer provided in this session." : isLocked ? "Response archived." : "Share your understanding here..."}
                      value={activeAnswers[q._id] || ""}
                      onChange={(e) => handleTextChange(q._id, e.target.value)}
                      disabled={!isHistoryMode && isLocked}
                    ></textarea>

                    {/* 🟢 NEW BUTTON LOGIC: Shows in live sessions OR when editing history */}
                    {(!isLocked || (isHistoryMode && !activeScores[q._id])) && (
                      <button
                        onClick={() => {
                          if (isHistoryMode) {
                            // Run evaluation specifically for the archived session
                            evaluateHistoryQuestion(q._id, q.solutionMarkdown, activeAnswers[q._id]);
                          } else {
                            // Run standard evaluation for live session
                            autoEvaluate(q._id, q.solutionMarkdown, activeAnswers[q._id]);
                          }
                        }}
                        className="w-full py-3.5 rounded-xl text-sm font-black tracking-wide transition-all active:scale-[0.98] bg-[#00A896] hover:bg-[#009686] text-white shadow-md"
                      >
                        {/* Dynamic text: 'Re-verify' for history, 'Check' for live session */}
                        {isHistoryMode
                          ? 'Re-verify Answer'
                          : currentAttempts > 0
                            ? `Try Again (${MAX_ATTEMPTS - currentAttempts} left)`
                            : 'Check Understanding'
                        }
                      </button>
                    )}

                    {(isLocked || isHistoryMode) && evaluation && (
                      <div className="mt-2 pt-6 border-t-2 border-[#EAEAEA] animate-fade-in">
                        <h4 className="text-xs text-[#888888] uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00A896]"></span> Core Concept
                        </h4>
                        <div className="text-sm text-[#00A896] font-medium bg-[#E5F1F0] p-5 rounded-xl border border-[#EAEAEA] leading-relaxed shadow-sm whitespace-pre-wrap font-mono relative overflow-hidden">
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

      {/* RIGHT SIDEBAR (Desktop Only) */}
      <aside className="hidden xl:flex w-80 bg-[#EAEFF0] border-l border-[#D9E9E8] flex-col h-full selection:bg-[#00A896]/10">
        <div className="p-6 border-b border-[#D9E9E8] bg-white">
          {/* 🔥 NEW: Title updates dynamically based on the Active Tab! */}
          <h3 className="text-sm font-black text-[#1A2533] uppercase tracking-wide mb-4">
            {isHistoryMode ? `Archived ${activeTab} Score` : `${activeTab} Score`}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#E5FAF0] p-3 rounded-xl border border-[#D0F0E0]">
              <div className="text-[10px] font-bold text-[#30D158] uppercase tracking-wider mb-1">Passed</div>
              <div className="text-lg font-black text-[#30D158]">{stats.passed}</div>
            </div>
            <div className="bg-[#EBF5FF] p-3 rounded-xl border border-[#D0E5FF]">
              <div className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-wider mb-1">Needs Imp.</div>
              <div className="text-lg font-black text-[#0A84FF]">{stats.partial}</div>
            </div>
            <div className="bg-[#FFF1F0] p-3 rounded-xl border border-[#FFD0D0]">
              <div className="text-[10px] font-bold text-[#FF3B30] uppercase tracking-wider mb-1">Failed</div>
              <div className="text-lg font-black text-[#FF3B30]">{stats.failed}</div>
            </div>
            <div className="bg-[#00A896] p-3 rounded-xl border border-[#009686] shadow-md">
              <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">Total XP</div>
              <div className="text-lg font-black text-white">{stats.totalScore}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#EAEFF0]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold text-[#1A2533] uppercase tracking-widest">Progress Map</h4>
            <span className="text-[10px] font-bold text-white bg-[#00A896] px-2 py-0.5 rounded-full">{activeTab}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {currentTabQuestions.map((q, i) => {
              const evalData = activeScores[q._id];
              let btnClass = "bg-white border-[#EAEAEA] text-[#888888] hover:border-[#00A896] hover:shadow-soft";

              if (evalData?.isLocked) {
                if (evalData.points === 1) btnClass = "bg-[#30D158] border-[#30D158] text-white shadow-soft";
                else if (evalData.points === 0.5) btnClass = "bg-[#0A84FF] border-[#0A84FF] text-white shadow-soft";
                else btnClass = "bg-[#FF3B30] border-[#FF3B30] text-white shadow-soft";
              } else if (evalData) {
                btnClass = "bg-[#00A896] border-[#009686] text-white animate-pulse shadow-soft";
              }

              return (
                <button
                  key={q._id}
                  onClick={() => scrollToQuestion(q._id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-all ${btnClass}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-10 mb-20">
            <button
              onClick={handleForceSubmit}
              className="bg-[#00A896] hover:bg-[#008c7d] text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
              Submit to Database
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}