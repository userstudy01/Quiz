import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [questions, setQuestions] = useState([]);

  // 🔥 NEW: Platform Stats State (Replace with real API data later)
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    quizzesTaken: 0,
    avgScore: "0%"
  });

  // Calendar & Event State
  const today = new Date();
  const currentYear = today.getFullYear();
  
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1)); 
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pre-loaded events with Indian National Holidays
  const [events, setEvents] = useState({
    [`${currentYear}-1-26`]: ['🇮🇳 Republic Day'],
    [`${currentYear}-8-15`]: ['🇮🇳 Independence Day'],
    [`${currentYear}-10-2`]: ['🕊️ Gandhi Jayanti'],
    [`${currentYear}-10-31`]: ['🪔 Diwali (Approximate)'],
    [`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`]: ['Review Quiz Platform Status']
  });
  const [newEventText, setNewEventText] = useState("");

  // ==========================================
  // 2. DATA FETCHING & PROCESSING
  // ==========================================
useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Questions (Your existing code)
        const qRes = await API.get('/questions');
        setQuestions(qRes.data);

        // 2. 🔥 NEW: Fetch Dynamic Platform Stats
        // Make sure you have created an API route in Express for '/stats'
        const statsRes = await API.get('/stats'); 
        
        // Update the state with the real data from MongoDB
        setPlatformStats({
          totalUsers: statsRes.data.totalUsers || 0,
          activeToday: statsRes.data.activeToday || 0,
          quizzesTaken: statsRes.data.quizzesTaken || 0,
          avgScore: statsRes.data.avgScore ? `${statsRes.data.avgScore}%` : "0%"
        });

      } catch (error) { 
        console.error("Dashboard Fetch error:", error); 
      }
    };
    
    fetchDashboardData();
  }, []);

  const totalQs = questions.length || 0;

  const getTopCategories = () => {
    if (!questions.length) return [];
    const categoryCounts = questions.reduce((acc, q) => {
      const mainTag = (q.tags && q.tags.length > 0 && q.tags[0].trim() !== '') 
        ? q.tags[0].toUpperCase() 
        : "GENERAL";
      if (!acc[mainTag]) acc[mainTag] = 0;
      acc[mainTag]++;
      return acc;
    }, {});
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const topQuizzes = getTopCategories();

  // ==========================================
  // 3. UI HELPER FUNCTIONS
  // ==========================================
  const getCardTheme = (index) => {
    const themes = [
      { bg: "bg-orange-50", iconBg: "bg-orange-400", text: "text-orange-600", hoverBg: "hover:bg-orange-200", btnBg: "bg-orange-100" },
      { bg: "bg-purple-50", iconBg: "bg-purple-400", text: "text-purple-600", hoverBg: "hover:bg-purple-200", btnBg: "bg-purple-100" },
      { bg: "bg-blue-50", iconBg: "bg-blue-400", text: "text-blue-600", hoverBg: "hover:bg-blue-200", btnBg: "bg-blue-100" },
      { bg: "bg-emerald-50", iconBg: "bg-emerald-400", text: "text-emerald-600", hoverBg: "hover:bg-emerald-200", btnBg: "bg-emerald-100" },
      { bg: "bg-rose-50", iconBg: "bg-rose-400", text: "text-rose-600", hoverBg: "hover:bg-rose-200", btnBg: "bg-rose-100" },
    ];
    return themes[index % themes.length]; 
  };

  const slideLeft = () => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const slideRight = () => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // ==========================================
  // 4. CALENDAR LOGIC
  // ==========================================
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const formatDateKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventText.trim()) return;
    const dateKey = formatDateKey(selectedDate);
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEventText.trim()]
    }));
    setNewEventText("");
  };

  const handleDeleteEvent = (dateKey, index) => {
    setEvents(prev => {
      const updatedEvents = [...prev[dateKey]];
      updatedEvents.splice(index, 1);
      return { ...prev, [dateKey]: updatedEvents };
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const selectedDateKey = formatDateKey(selectedDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="flex bg-[#F4F5F9] min-h-screen font-sans text-slate-800">
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen relative">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search quizzes..." className="w-full bg-white text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm" />
            </div>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative shrink-0 text-slate-500 hover:text-purple-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* 🔥 NEW: PLATFORM PULSE (QUICK STATS ROW) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* 1. Total Users Card */}
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-purple-200 transition-all group cursor-default">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Learners</p>
              <h3 className="text-2xl font-black text-slate-800 leading-tight">{platformStats.totalUsers.toLocaleString()}</h3>
            </div>
          </div>

          {/* 2. Active Today Card */}
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all group cursor-default">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Today</p>
              <h3 className="text-2xl font-black text-slate-800 leading-tight">{platformStats.activeToday.toLocaleString()}</h3>
            </div>
          </div>

          {/* 3. Quizzes Taken Card */}
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all group cursor-default">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quizzes Taken</p>
              <h3 className="text-2xl font-black text-slate-800 leading-tight">{platformStats.quizzesTaken.toLocaleString()}</h3>
            </div>
          </div>

          {/* 4. Avg Score Card */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-[20px] shadow-md shadow-purple-600/20 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
            <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">Avg Platform Score</p>
              <h3 className="text-2xl font-black text-white leading-tight">{platformStats.avgScore}</h3>
            </div>
          </div>

        </section>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT/CENTER COLUMN */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* FEATURED QUIZZES (Scrollable) */}
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-800">Featured Quizzes</h3>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-slate-600">{topQuizzes.length} Categories</span>
                   </div>
                   {topQuizzes.length > 0 && (
                     <div className="flex items-center gap-1">
                        <button onClick={slideLeft} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all active:scale-95">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button onClick={slideRight} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all active:scale-95">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                     </div>
                   )}
                 </div>
              </div>

              <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
              
              <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory hide-scroll scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {topQuizzes.length > 0 ? (
                  topQuizzes.map((quiz, index) => {
                    const theme = getCardTheme(index);
                    return (
                      <div 
                        key={quiz.name} 
                        onClick={() => navigate('/questions')}
                        className="shrink-0 w-[260px] snap-start bg-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <div className={`${theme.bg} rounded-[20px] p-4 flex justify-center mb-4 h-32 items-center`}>
                           <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center shadow-inner transform transition-transform duration-500 group-hover:rotate-0 ${index % 2 === 0 ? '-rotate-6' : 'rotate-6'}`}>
                              <span className="text-white font-black text-xl px-2 truncate">{quiz.name.substring(0, 3)}</span>
                           </div>
                        </div>
                        <h4 className="font-bold text-slate-800 truncate" title={quiz.name}>{quiz.name}</h4>
                        <p className="text-xs font-semibold text-slate-500 mb-4">{quiz.count} Questions Total</p>
                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-2">
                             <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                             <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                             <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">+{Math.max(1, Math.floor(quiz.count / 5))}</div>
                          </div>
                          <button className={`w-8 h-8 ${theme.btnBg} ${theme.hoverBg} ${theme.text} rounded-full flex items-center justify-center transition-colors shadow-sm`}>
                            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full bg-white p-8 rounded-[24px] border border-slate-200 flex items-center justify-center text-slate-400 text-sm font-medium">No questions found. Add some in the Question Bank!</div>
                )}
              </div>
            </section>

            {/* RECENT QUIZZES */}
            <section className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-800">Recent Quizzes</h3>
                 <button className="text-xs font-bold text-purple-600 hover:text-purple-800">View All</button>
              </div>
              <div className="grid grid-cols-12 text-xs font-medium text-slate-400 mb-4 px-2">
                <div className="col-span-5">Quiz Name</div>
                <div className="col-span-3">Date Added</div>
                <div className="col-span-2">Avg Score</div>
                <div className="col-span-2">Level</div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'React Hooks Mastery', date: 'May 12', score: '85%', level: 'Advanced', icon: '⚛️', bg: 'bg-blue-50' },
                  { name: 'CSS Flexbox Basics', date: 'May 14', score: '92%', level: 'Beginner', icon: '🎨', bg: 'bg-orange-50' },
                  { name: 'Node.js API Setup', date: 'May 17', score: '78%', level: 'Intermediate', icon: '🟢', bg: 'bg-green-50' },
                  { name: 'JavaScript Async/Await', date: 'May 26', score: '64%', level: 'Advanced', icon: 'JS', bg: 'bg-purple-50' },
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-2 py-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${item.bg} shadow-inner`}>{item.icon}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400">10 questions</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-sm font-semibold text-slate-600">{item.date}</div>
                    <div className="col-span-2 text-sm font-bold text-slate-800">{item.score}</div>
                    <div className="col-span-2 text-xs font-semibold text-slate-500">{item.level}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            
            {/* Profile Summary */}
            <section className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-purple-100 rounded-full mb-3 flex items-center justify-center relative shadow-inner">
                  <span className="text-2xl">👨‍💻</span>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-purple-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
               </div>
               <h3 className="font-bold text-slate-800 text-lg">Admin User</h3>
               <p className="text-xs font-semibold text-slate-400 mt-0.5">Master Instructor</p>
            </section>

            {/* INTERACTIVE CALENDAR */}
            <section className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <div className="flex gap-2 text-slate-400">
                     <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors hover:text-slate-800"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg></button>
                     <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors hover:text-slate-800"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg></button>
                  </div>
               </div>

               <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
                 <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
               </div>

               <div className="grid grid-cols-7 text-center text-sm font-semibold text-slate-700 gap-y-3 mb-2">
                 {blanks.map((_, i) => (
                   <div key={`blank-${i}`} className="text-transparent">0</div>
                 ))}
                 
                 {days.map((day) => {
                   const loopDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                   const loopDateKey = formatDateKey(loopDate);
                   const isSelected = selectedDateKey === loopDateKey;
                   const hasEvents = events[loopDateKey] && events[loopDateKey].length > 0;
                   const isToday = day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

                   return (
                     <div key={day} className="relative flex justify-center items-center h-8">
                       <button 
                         onClick={() => {
                           setSelectedDate(loopDate);
                           setIsModalOpen(true);
                         }}
                         className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                           isSelected 
                             ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold' 
                             : isToday 
                               ? 'bg-purple-50 text-purple-700 font-bold ring-2 ring-purple-200' 
                               : 'hover:bg-purple-50 hover:text-purple-700'
                         }`}
                       >
                         {day}
                       </button>
                       {hasEvents && !isSelected && (
                         <span className="absolute bottom-0 w-1 h-1 bg-purple-500 rounded-full"></span>
                       )}
                     </div>
                   );
                 })}
               </div>
            </section>

            {/* Quiz Progress/Stats */}
            <section className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4">Database Progress</h3>
               <div className="space-y-4">
                 
                 <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-[16px] text-white flex items-center justify-between shadow-lg shadow-purple-600/20 transform hover:-translate-y-1 transition-transform cursor-pointer">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold backdrop-blur-sm">50%</div>
                     <div>
                       <p className="text-sm font-bold">Practical Tasks</p>
                       <p className="text-[10px] font-medium text-purple-200 mt-0.5">75 questions added</p>
                     </div>
                   </div>
                   <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </div>

                 <div className="border border-slate-200 p-4 rounded-[16px] flex items-center justify-between hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold shadow-inner">65%</div>
                     <div>
                       <p className="text-sm font-bold text-slate-800">Theory Concepts</p>
                       <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{totalQs} total items</p>
                     </div>
                   </div>
                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </div>

               </div>
            </section>
          </div>
        </div>

      </main>

      {/* ========================================== */}
      {/* POP-UP MODAL (EVENT MANAGER) */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-fade-in">
            {/* Modal Header */}
            <div className="bg-purple-600 p-5 flex justify-between items-center text-white">
              <div>
                <h3 className="font-bold text-lg">
                  {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
                <p className="text-purple-200 text-xs font-medium mt-0.5">Manage tasks & events</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {(events[selectedDateKey] || []).length === 0 ? (
                  <div className="text-center py-8">
                     <span className="text-4xl block mb-3">📅</span>
                     <p className="text-sm text-slate-500 font-medium">No events or tasks planned for this day.</p>
                  </div>
                ) : (
                  (events[selectedDateKey] || []).map((ev, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 flex justify-between items-center group">
                      <span className="truncate pr-2 flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                         {ev}
                      </span>
                      <button 
                        onClick={() => handleDeleteEvent(selectedDateKey, idx)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Task Input */}
              <form onSubmit={handleAddEvent} className="relative">
                <input 
                  type="text" 
                  value={newEventText}
                  onChange={(e) => setNewEventText(e.target.value)}
                  placeholder="Add a new event or task..." 
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!newEventText.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}