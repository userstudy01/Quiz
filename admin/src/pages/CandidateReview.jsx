import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import API from '../utils/api';

export default function CandidateReview() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 STATE DROPDOWN AUR CALENDAR KE LIYE
  const [expandedSession, setExpandedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); 
  
  useEffect(() => {
    if (!id || id === 'undefined') {
      setError("Invalid Candidate ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchCandidateData = async () => {
      try {
        const { data } = await API.get(`/evaluations/admin/candidate/${id}`);
        setCandidate(data);
      } catch (err) {
        setError(err.message || "Failed to fetch candidate details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateData();
  }, [id]);

  
  // Loading State UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold animate-pulse">Loading candidate profile...</p>
      </div>
    );
  }

  // Error State UI
  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] p-10 flex flex-col items-center justify-center text-center">
        <div className="text-rose-600 bg-white p-8 rounded-[32px] border border-slate-100 mb-6 max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h2 className="font-extrabold text-xl mb-2 text-slate-800">Oops! Something went wrong.</h2>
          <p className="font-medium text-rose-500">{error || "Candidate not found."}</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Go Back
        </button>
      </div>
    );
  }

  // ==========================================
  // 🔥 FIX 1: BULLETPROOF DATE FILTER
  // ==========================================
  const filteredHistory = selectedDate 
    ? (candidate.history || []).filter(session => {
        if (!session.date) return false;
        
        // Extract numbers from target date (YYYY-MM-DD)
        const [sYear, sMonth, sDay] = selectedDate.split('-');
        const targetY = parseInt(sYear, 10);
        const targetM = parseInt(sMonth, 10);
        const targetD = parseInt(sDay, 10);

        // Extract numbers from DB string (like "4/12/2026, 7:47 PM")
        const nums = session.date.match(/(\d+)/g);
        if (!nums || nums.length < 3) return false;

        const n1 = parseInt(nums[0], 10);
        const n2 = parseInt(nums[1], 10);
        const n3 = parseInt(nums[2], 10);

        let sessionY = n3 > 1000 ? n3 : (n1 > 1000 ? n1 : 0);
        let sessionM = n1 > 1000 ? n2 : n1;
        let sessionD = n1 > 1000 ? n3 : n2;
        
        // Match numbers ignoring format (MM/DD ya DD/MM dono cover karega)
        if (sessionY === targetY) {
           if ((sessionM === targetM && sessionD === targetD) || (sessionM === targetD && sessionD === targetM)) {
               return true;
           }
        }
        return false;
      })
    : (candidate.history || []);


  // ==========================================
  // 🔥 FIX 2: DYNAMIC STATS CALCULATION
  // ==========================================
  let uniqueAttempted = new Set();
  let theoryScore = 0;
  let practicalScore = 0;

  // Active Session check karein
  let isActiveSessionMatching = true;
  if (selectedDate) {
      const activeDateStr = candidate.updatedAt || candidate.createdAt;
      if (activeDateStr) {
          const aD = new Date(activeDateStr);
          const aY = aD.getFullYear();
          const aM = String(aD.getMonth() + 1).padStart(2, '0');
          const aDay = String(aD.getDate()).padStart(2, '0');
          isActiveSessionMatching = (`${aY}-${aM}-${aDay}` === selectedDate);
      } else {
          isActiveSessionMatching = false;
      }
  }

  // 1. Agar History me sessions hain toh unko add karo
  filteredHistory.forEach(session => {
    theoryScore += (Number(session.score) || Number(session.totalScore) || 0);
    if (session.savedAnswers) {
      Object.keys(session.savedAnswers).forEach(qId => uniqueAttempted.add(qId));
    }
  });

  // 2. Agar Active Session filter me aata hai (ya filter band hai) toh usko add karo
  if (isActiveSessionMatching) {
    if (candidate.userAnswers) {
      Object.keys(candidate.userAnswers).forEach(qId => uniqueAttempted.add(qId));
    }
    if (candidate.attempts) {
      Object.keys(candidate.attempts).forEach(qId => uniqueAttempted.add(qId));
    }

    let activeTheory = Number(candidate.scores?.theory) || Number(candidate.theory) || 0;
    let activePractical = Number(candidate.scores?.practical) || Number(candidate.practical) || 0;
    
    if (activeTheory === 0 && activePractical === 0 && (candidate.overallXP || candidate.score || candidate.totalScore)) {
        activeTheory = Number(candidate.overallXP || candidate.score || candidate.totalScore || 0);
    }
    
    theoryScore += activeTheory;
    practicalScore += activePractical;
  }

  // 3. Set the final UI Variables
  const attemptedCount = uniqueAttempted.size;
  const theoryCount = candidate.theoryCount || attemptedCount; 
  const practicalCount = candidate.practicalCount || 0;
  
  const totalScore = practicalScore + theoryScore;
  const percentage = (totalScore / 200) * 100;

  

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800 p-4 sm:p-6 md:p-10 pt-24 lg:pt-10 flex justify-center">
      
      {/* Main White Canvas Card */}
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] p-6 md:p-10 lg:p-12 overflow-hidden relative">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-slate-800 hover:text-slate-500 font-bold text-base transition-colors"
          >
            <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </div>
            Candidates
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* 🔥 CALENDAR DATE PICKER */}
            <div className="relative">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-4 pr-3 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-bold text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer bg-slate-50 hover:bg-white"
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate("")}
                  className="absolute right-[-10px] top-[-10px] w-6 h-6 bg-slate-800 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md hover:bg-rose-500 transition-colors"
                  title="Clear Filter"
                >
                  ✕
                </button>
              )}
            </div>

            <button className="flex-1 md:flex-none px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all">
              Export Report
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md transition-all">
              Contact User
            </button>
            {/* Avatar Stack Placeholder */}
            <div className="hidden lg:flex -space-x-3 ml-4">
               <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white"></div>
               <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white"></div>
               <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700">+3</div>
            </div>
          </div>
        </div>

        {/* Profile & Progress Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-100 pb-12">
          {/* Avatar Illustration Area */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center shadow-inner">
               <span className="text-5xl font-black text-cyan-600 uppercase">
                 {candidate.name ? candidate.name.charAt(0) : '?'}
               </span>
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
               <span className="text-xl">🔥</span>
            </div>
          </div>

          {/* Profile Details & Bar */}
          <div className="flex-1 w-full text-center md:text-left mt-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{candidate.name || "Unknown Candidate"}</h1>
            <p className="text-slate-400 font-medium text-sm mb-6">{candidate.email}</p>

            {candidate.moduleName && (
    <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-purple-100 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
      Module: {candidate.moduleName}
    </div>
  )}
            
            {/* Progress Bar Container */}
            <div className="max-w-xl">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {selectedDate ? `Filtered Score` : `Overall Score`}
                 </span>
                 <span className="text-[10px] font-bold text-slate-300">{totalScore} / 200 XP</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-orange-400 relative transition-all duration-500"
                  style={{ width: `${Math.max(percentage, 0)}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- THREE MAIN METRICS --- */}
        <div className="flex flex-col md:flex-row justify-around items-center py-10 gap-8 border-b border-slate-100">
          
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-100 rounded-[14px] flex items-center justify-center text-slate-600 shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 leading-none">{attemptedCount}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Questions Attempted</p>
            </div>
          </div>

          <div className="w-px h-12 bg-slate-100 hidden md:block"></div>

          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-100 rounded-[14px] flex items-center justify-center text-slate-600 shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 leading-none">{theoryScore}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Theory Score</p>
            </div>
          </div>

          <div className="w-px h-12 bg-slate-100 hidden md:block"></div>

          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-100 rounded-[14px] flex items-center justify-center text-slate-600 shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 leading-none">{practicalScore}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Practical Score</p>
            </div>
          </div>

        </div>

        {/* --- EVALUATION PANELS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
          
          {/* Panel 1: Theory Feedback */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-lg text-slate-900">Theory Feedback</h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full">{theoryCount} Qs</span>
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
              {candidate.overallTheoryReview || <span className="italic text-slate-400">No overall theory feedback has been recorded for this candidate yet.</span>}
            </div>
            
            <div className="mt-6 text-center">
              <button className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">Edit Theory Notes</button>
            </div>
          </div>

          {/* Panel 2: Practical Feedback */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-lg text-slate-900">Practical Feedback</h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full">{practicalCount} Qs</span>
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
              {candidate.overallPracticalReview || <span className="italic text-slate-400">No overall practical feedback has been recorded for this candidate yet.</span>}
            </div>

            <div className="mt-6 text-center">
              <button className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">Edit Practical Notes</button>
            </div>
          </div>

        </div>
        
        <div className="pt-4">
          <h3 className="font-extrabold text-xl text-slate-900 mb-6">Detailed Answer Breakdown</h3>
          
          {/* 1. ACTIVE / UNARCHIVED ANSWERS */}
          {isActiveSessionMatching && candidate.userAnswers && Object.keys(candidate.userAnswers).length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Current Active Session</h4>
              <div className="bg-slate-50/50 rounded-[32px] p-6 sm:p-8 border border-slate-100 space-y-6">
                {Object.entries(candidate.userAnswers).map(([questionId, answer], index) => {
                  const scoreDetail = candidate.rawScores ? candidate.rawScores[questionId] : null;
                  const points = scoreDetail?.points || 0;
                  
                  return (
                    <div key={questionId} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-50">
                        <span className="text-xs font-black bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full uppercase tracking-widest">
                          Active Q {index + 1}
                        </span>
                        <span className={`text-[11px] font-black uppercase px-4 py-1.5 rounded-full ${points > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {points} Points
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Candidate's Answer:</h4>
                        <div className="text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed font-mono">
                          {answer || <span className="text-slate-400 italic font-sans">No text provided.</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. ARCHIVED SESSIONS (PAST SESSIONS - DARK UI WITH DROPDOWN) */}
          {filteredHistory && filteredHistory.length > 0 && (
            <div className="mb-10 animate-fade-in">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex justify-between items-end">
                <span>{selectedDate ? `Sessions on ${selectedDate}` : 'Past Sessions'}</span>
                {selectedDate && <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-600 shadow-sm border border-slate-200">Filtered View</span>}
              </h4>
              
              <div className="grid grid-cols-1 gap-5">
                {filteredHistory.map((session, hIndex) => (
                  <div key={hIndex} className="flex flex-col">
                    
                    {/* YEH MAIN CARD HAI JIS PAR CLICK KARNE SE DROPDOWN KHULEGA */}
                    <div 
                      onClick={() => setExpandedSession(expandedSession === hIndex ? null : hIndex)}
                      className="bg-[#1A2533] p-5 rounded-[20px] flex flex-col md:flex-row justify-between items-start md:items-center border border-[#2A3543] shadow-lg hover:border-[#00A896] cursor-pointer transition-colors z-10"
                    >
                      <div className="flex flex-col mb-3 md:mb-0">
                        <p className="text-white font-black text-sm mb-2">
                          {session.date ? session.date.split(',')[0] : `Archive #${hIndex + 1}`}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                          <span className="text-[#888888]">P:<span className="text-white ml-1">{session.passed || 0}</span></span>
                          <span className="text-[#888888]">M:<span className="text-white ml-1">{session.partial || 0}</span></span>
                          <span className="text-[#888888]">F:<span className="text-[#FF3B30] ml-1">{session.failed || 0}</span></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-[#00A896] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-[0_0_10px_rgba(0,168,150,0.3)] tracking-widest uppercase">
                          XP: {session.score || session.totalScore || 0}
                        </div>
                        {/* Dropdown Arrow */}
                        <div className="text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full">
                           {expandedSession === hIndex ? 'Hide Answers ▲' : 'View Answers ▼'}
                        </div>
                      </div>
                    </div>

                    {/* 🔥 YEH DROPDOWN CONTENT HAI JO CLICK PAR DIKHEGA */}
                    {expandedSession === hIndex && (
                      <div className="bg-slate-50 border border-slate-200 rounded-b-[20px] p-6 pt-8 -mt-4 animate-fade-in shadow-inner">
                        {!session.savedAnswers || Object.keys(session.savedAnswers).length === 0 ? (
                           <p className="text-center text-slate-500 text-sm font-medium">No detailed answers in this session.</p>
                        ) : (
                           <div className="space-y-4">
                             {Object.entries(session.savedAnswers).map(([qId, ans], qIndex) => {
                               const sDetail = session.savedScores ? session.savedScores[qId] : null;
                               const pts = sDetail?.points || 0;
                               return (
                                 <div key={qId} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
                                   <div className="flex justify-between items-center mb-3 border-b border-slate-50 pb-3">
                                     <span className="text-xs font-black bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase tracking-widest">
                                       Archived Q {qIndex + 1}
                                     </span>
                                     <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${pts > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                       {pts} Points
                                     </span>
                                   </div>
                                   <div>
                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Answer:</h4>
                                     <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap font-mono">
                                       {ans || <span className="text-slate-400 italic font-sans">No text provided.</span>}
                                     </div>
                                   </div>
                                 </div>
                               )
                             })}
                           </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PAST SESSIONS GRID VIEW */}
          {filteredHistory && filteredHistory.length > 0 && (
            <div className="mb-10 animate-fade-in">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex justify-between items-end">
                <span>{selectedDate ? `Grid View for ${selectedDate}` : 'Past Sessions (Grid View)'}</span>
                {selectedDate && <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-600">Filtered View</span>}
              </h4>
              
              {/* CSS Grid for the Dark Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredHistory.map((session, hIndex) => (
                  <div 
                    key={hIndex} 
                    className="bg-[#1A2533] p-5 rounded-[20px] flex flex-col justify-between border border-[#2A3543] shadow-lg hover:border-[#00A896] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                      <div>
                        <p className="text-white font-black text-sm">
                          {session.date ? session.date.split(',')[0] : `Archive #${hIndex + 1}`}
                        </p>
                      </div>
                      <div className="bg-[#00A896] text-white px-3 py-1 rounded-full text-[10px] font-black shadow-[0_0_10px_rgba(0,168,150,0.3)] tracking-widest uppercase">
                        XP: {session.score || session.totalScore || 0}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                      <span className="text-[#888888]">
                        P:<span className="text-white ml-1">{session.passed || 0}</span>
                      </span>
                      <span className="text-[#888888]">
                        M:<span className="text-white ml-1">{session.partial || 0}</span>
                      </span>
                      <span className="text-[#888888]">
                        F:<span className="text-[#FF3B30] ml-1">{session.failed || 0}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isActiveSessionMatching && filteredHistory.length === 0 && (
            <div className="bg-slate-50/50 rounded-[32px] p-6 sm:p-8 border border-slate-100">
              <div className="text-center text-slate-400 py-10 font-medium">
                <div className="text-4xl mb-3 opacity-50">📅</div>
                No data available for the selected date.
              </div>
            </div>
          )}
          
          {!selectedDate && (!candidate.userAnswers || Object.keys(candidate.userAnswers).length === 0) && (!candidate.history || candidate.history.length === 0) && (
            <div className="bg-slate-50/50 rounded-[32px] p-6 sm:p-8 border border-slate-100">
              <div className="text-center text-slate-400 py-10 font-medium">
                <div className="text-4xl mb-3 opacity-50">📝</div>
                This candidate hasn't submitted any detailed answers yet.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}