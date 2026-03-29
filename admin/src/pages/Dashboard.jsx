import { useState, useEffect } from 'react';
import API from '../utils/api';

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get('/questions');
        setQuestions(data);
      } catch (error) { console.error(error); }
    };
    fetchQuestions();
  }, []);

  const totalQs = questions.length;
  const theoryQs = questions.filter(q => q.section === 'Theory').length;
  const practicalQs = questions.filter(q => q.section === 'Practical').length;

  return (
    <div className="p-6 md:p-8 bg-white min-h-screen font-sans text-slate-900">
      {/* --- TOP HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm font-medium">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-emerald-900 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-emerald-900/20 text-sm flex items-center gap-2 transition-transform active:scale-95">
            <span className="text-lg">+</span> Add Project
          </button>
          <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-50">
            Import Data
          </button>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (STATS & ANALYTICS) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* 4 STAT CARDS (Exactly like image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Questions Card */}
            <div className="bg-emerald-900 text-white p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Question's</p>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px]">↗</div>
              </div>
              <h2 className="text-4xl font-black">{totalQs}</h2>
              <p className="text-[9px] opacity-70">↑ Increased from last month</p>
            </div>

            {/* Theory Card */}
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Theory Items</p>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">↗</div>
              </div>
              <h2 className="text-4xl font-black">{theoryQs}</h2>
              <p className="text-[9px] text-slate-400">Core Concepts</p>
            </div>

            {/* Practical Card */}
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Practical Items</p>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">↗</div>
              </div>
              <h2 className="text-4xl font-black">{practicalQs}</h2>
              <p className="text-[9px] text-slate-400">Applied Tasks</p>
            </div>

            {/* XP Card */}
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Repository XP</p>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">↗</div>
              </div>
              <h2 className="text-4xl font-black">{totalQs * 100}</h2>
              <p className="text-[9px] text-slate-400">Total System Value</p>
            </div>
          </div>

          {/* PROJECT ANALYTICS BAR CHART (Visual Port) */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-lg">Project Analytics</h3>
              <select className="text-xs font-bold border-none bg-slate-50 rounded-lg px-2 py-1 outline-none">
                <option>Weekly</option>
              </select>
            </div>
            <div className="flex items-end justify-between h-48 px-4">
              {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full">
                  <div 
                    className={`w-8 rounded-full transition-all duration-500 ${i === 3 ? 'bg-emerald-900' : 'bg-emerald-100'}`} 
                    style={{ height: `${h}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-slate-300">S M T W T F S'.split(' ')[i]</span>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM COLLABORATION */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg">Team Collaboration</h3>
                <button className="text-[10px] font-bold border border-slate-200 px-3 py-1 rounded-full">+ Add Member</button>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'Admin User', role: 'System Manager', status: 'Active', img: 'A' },
                  { name: 'Developer', role: 'Content Creator', status: 'Pending', img: 'D' }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{user.img}</div>
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{user.role}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{user.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN (REMINIDERS & PROGRESS) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* REMINDERS CARD */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
            <h3 className="font-black text-lg mb-4">Reminders</h3>
            <div className="bg-slate-50 p-4 rounded-3xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-900 rounded-2xl flex items-center justify-center text-white italic">D</div>
                <div>
                  <p className="text-sm font-black">Review New Questions</p>
                  <p className="text-[10px] text-slate-400 font-medium">Time: 02:00 pm - 04:00 pm</p>
                </div>
              </div>
              <button className="w-full bg-emerald-900 text-white py-3 rounded-2xl font-bold text-xs shadow-md">
                View All Tasks
              </button>
            </div>
          </div>

          {/* PROJECT PROGRESS (Circular chart from image) */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center">
            <h3 className="font-black text-lg w-full mb-6 text-left">Project Progress</h3>
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Simple SVG semi-circle to match the image */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="15" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke="#064e3b" strokeWidth="15" fill="transparent" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">75%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Database Full</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
                <span className="text-[10px] font-bold text-slate-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
                <span className="text-[10px] font-bold text-slate-400">In Progress</span>
              </div>
            </div>
          </div>

          {/* TIME TRACKER (Bottom black card from image) */}
          <div className="bg-slate-950 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">System Uptime</p>
              <h2 className="text-4xl font-mono font-black mb-6">24:08:12</h2>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">||</button>
                <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">■</button>
              </div>
            </div>
            {/* Abstract background waves like image */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mb-10"></div>
          </div>

        </div>
      </div>
    </div>
  );
}