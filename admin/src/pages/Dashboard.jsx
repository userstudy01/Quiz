// import { useState, useEffect } from 'react';
// import API from '../utils/api';

// export default function Dashboard() {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const { data } = await API.get('/questions');
//         setQuestions(data);
//       } catch (error) { console.error(error); }
//     };
//     fetchQuestions();
//   }, []);

//   const totalQs = questions.length;
//   const theoryQs = questions.filter(q => q.section === 'Theory').length;
//   const practicalQs = questions.filter(q => q.section === 'Practical').length;

//   return (
//     <div className="p-6 md:p-8 bg-white min-h-screen font-sans text-slate-900">
//       {/* --- TOP HEADER --- */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
//           <p className="text-slate-400 text-sm font-medium">Plan, prioritize, and accomplish your tasks with ease.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="bg-emerald-900 text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-emerald-900/20 text-sm flex items-center gap-2 transition-transform active:scale-95">
//             <span className="text-lg">+</span> Add Project
//           </button>
//           <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-50">
//             Import Data
//           </button>
//         </div>
//       </div>

//       {/* --- MAIN GRID --- */}
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT COLUMN (STATS & ANALYTICS) */}
//         <div className="col-span-12 lg:col-span-8 space-y-6">
          
//           {/* 4 STAT CARDS (Exactly like image) */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//             {/* Total Questions Card */}
//             <div className="bg-emerald-900 text-white p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Question's</p>
//                 <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <h2 className="text-4xl font-black">{totalQs}</h2>
//               <p className="text-[9px] opacity-70">↑ Increased from last month</p>
//             </div>

//             {/* Theory Card */}
//             <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Theory Items</p>
//                 <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <h2 className="text-4xl font-black">{theoryQs}</h2>
//               <p className="text-[9px] text-slate-400">Core Concepts</p>
//             </div>

//             {/* Practical Card */}
//             <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Practical Items</p>
//                 <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <h2 className="text-4xl font-black">{practicalQs}</h2>
//               <p className="text-[9px] text-slate-400">Applied Tasks</p>
//             </div>

//             {/* XP Card */}
//             <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px]">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Repository XP</p>
//                 <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <h2 className="text-4xl font-black">{totalQs * 100}</h2>
//               <p className="text-[9px] text-slate-400">Total System Value</p>
//             </div>
//           </div>

//           {/* PROJECT ANALYTICS BAR CHART (Visual Port) */}
//           <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
//             <div className="flex justify-between items-center mb-8">
//               <h3 className="font-black text-lg">Project Analytics</h3>
//               <select className="text-xs font-bold border-none bg-slate-50 rounded-lg px-2 py-1 outline-none">
//                 <option>Weekly</option>
//               </select>
//             </div>
//             <div className="flex items-end justify-between h-48 px-4">
//               {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
//                 <div key={i} className="flex flex-col items-center gap-2 w-full">
//                   <div 
//                     className={`w-8 rounded-full transition-all duration-500 ${i === 3 ? 'bg-emerald-900' : 'bg-emerald-100'}`} 
//                     style={{ height: `${h}%` }}
//                   ></div>
//                   <span className="text-[10px] font-bold text-slate-300">S M T W T F S'.split(' ')[i]</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* TEAM COLLABORATION */}
//           <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
//              <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-black text-lg">Team Collaboration</h3>
//                 <button className="text-[10px] font-bold border border-slate-200 px-3 py-1 rounded-full">+ Add Member</button>
//              </div>
//              <div className="space-y-4">
//                 {[
//                   { name: 'Admin User', role: 'System Manager', status: 'Active', img: 'A' },
//                   { name: 'Developer', role: 'Content Creator', status: 'Pending', img: 'D' }
//                 ].map((user, i) => (
//                   <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{user.img}</div>
//                       <div>
//                         <p className="text-sm font-bold">{user.name}</p>
//                         <p className="text-[10px] text-slate-400 font-medium">{user.role}</p>
//                       </div>
//                     </div>
//                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{user.status}</span>
//                   </div>
//                 ))}
//              </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN (REMINIDERS & PROGRESS) */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
          
//           {/* REMINDERS CARD */}
//           <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
//             <h3 className="font-black text-lg mb-4">Reminders</h3>
//             <div className="bg-slate-50 p-4 rounded-3xl space-y-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-emerald-900 rounded-2xl flex items-center justify-center text-white italic">D</div>
//                 <div>
//                   <p className="text-sm font-black">Review New Questions</p>
//                   <p className="text-[10px] text-slate-400 font-medium">Time: 02:00 pm - 04:00 pm</p>
//                 </div>
//               </div>
//               <button className="w-full bg-emerald-900 text-white py-3 rounded-2xl font-bold text-xs shadow-md">
//                 View All Tasks
//               </button>
//             </div>
//           </div>

//           {/* PROJECT PROGRESS (Circular chart from image) */}
//           <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center">
//             <h3 className="font-black text-lg w-full mb-6 text-left">Project Progress</h3>
//             <div className="relative w-40 h-40 flex items-center justify-center">
//               {/* Simple SVG semi-circle to match the image */}
//               <svg className="w-full h-full transform -rotate-90">
//                 <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="15" fill="transparent" />
//                 <circle cx="80" cy="80" r="70" stroke="#064e3b" strokeWidth="15" fill="transparent" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" />
//               </svg>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-4xl font-black">75%</span>
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Database Full</span>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mt-6 w-full">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
//                 <span className="text-[10px] font-bold text-slate-400">Completed</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
//                 <span className="text-[10px] font-bold text-slate-400">In Progress</span>
//               </div>
//             </div>
//           </div>

//           {/* TIME TRACKER (Bottom black card from image) */}
//           <div className="bg-slate-950 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
//             <div className="relative z-10">
//               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">System Uptime</p>
//               <h2 className="text-4xl font-mono font-black mb-6">24:08:12</h2>
//               <div className="flex gap-3">
//                 <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">||</button>
//                 <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">■</button>
//               </div>
//             </div>
//             {/* Abstract background waves like image */}
//             <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mb-10"></div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import API from '../utils/api';

// export default function Dashboard() {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const { data } = await API.get('/questions');
//         setQuestions(data);
//       } catch (error) { console.error(error); }
//     };
//     fetchQuestions();
//   }, []);

//   const totalQs = questions.length;
//   const theoryQs = questions.filter(q => q.section === 'Theory').length;
//   const practicalQs = questions.filter(q => q.section === 'Practical').length;

//   return (
//     <div className="p-6 md:p-8 bg-[#FDFDFD] min-h-screen font-sans text-[#1A2533] selection:bg-[#00A896]/10">
//       {/* --- TOP HEADER --- */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-black tracking-tight text-[#1A2533]">Dashboard</h1>
//           <p className="text-[#888888] text-sm font-medium mt-1">Plan, prioritize, and accomplish your tasks with ease.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="bg-[#00A896] hover:bg-[#009686] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md shadow-[#00A896]/20 text-sm flex items-center gap-2 transition-all active:scale-95">
//             <span className="text-lg leading-none">+</span> Add Project
//           </button>
//           <button className="bg-white border border-[#EAEAEA] text-[#1A2533] px-5 py-2.5 rounded-2xl font-bold text-sm hover:border-[#00A896] hover:text-[#00A896] transition-all shadow-sm">
//             Import Data
//           </button>
//         </div>
//       </div>

//       {/* --- MAIN GRID --- */}
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* LEFT COLUMN (STATS & ANALYTICS) */}
//         <div className="col-span-12 lg:col-span-8 space-y-6">
          
//           {/* 4 STAT CARDS */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//             {/* Total Questions Card */}
//             <div className="bg-[#00A896] text-white p-6 rounded-[2rem] shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden">
//               <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
//               <div className="flex justify-between items-start relative z-10">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Total Questions</p>
//                 <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] backdrop-blur-sm">↗</div>
//               </div>
//               <div className="relative z-10">
//                 <h2 className="text-4xl font-black mb-1">{totalQs}</h2>
//                 <p className="text-[10px] text-white/80 font-bold">↑ Increased from last month</p>
//               </div>
//             </div>

//             {/* Theory Card */}
//             <div className="bg-white border border-[#EAEAEA] p-6 rounded-[2rem] shadow-soft flex flex-col justify-between min-h-[160px] hover:border-[#00A896]/50 transition-colors">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Theory Items</p>
//                 <div className="w-7 h-7 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <div>
//                 <h2 className="text-4xl font-black text-[#1A2533] mb-1">{theoryQs}</h2>
//                 <p className="text-[10px] font-bold text-[#888888]">Core Concepts</p>
//               </div>
//             </div>

//             {/* Practical Card */}
//             <div className="bg-white border border-[#EAEAEA] p-6 rounded-[2rem] shadow-soft flex flex-col justify-between min-h-[160px] hover:border-[#00A896]/50 transition-colors">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Practical Items</p>
//                 <div className="w-7 h-7 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <div>
//                 <h2 className="text-4xl font-black text-[#1A2533] mb-1">{practicalQs}</h2>
//                 <p className="text-[10px] font-bold text-[#888888]">Applied Tasks</p>
//               </div>
//             </div>

//             {/* XP Card */}
//             <div className="bg-white border border-[#EAEAEA] p-6 rounded-[2rem] shadow-soft flex flex-col justify-between min-h-[160px] hover:border-[#00A896]/50 transition-colors">
//               <div className="flex justify-between items-start">
//                 <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Repository XP</p>
//                 <div className="w-7 h-7 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center text-[10px]">↗</div>
//               </div>
//               <div>
//                 <h2 className="text-4xl font-black text-[#1A2533] mb-1">{totalQs * 100}</h2>
//                 <p className="text-[10px] font-bold text-[#888888]">Total System Value</p>
//               </div>
//             </div>
//           </div>

//           {/* PROJECT ANALYTICS BAR CHART */}
//           <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft">
//             <div className="flex justify-between items-center mb-8">
//               <h3 className="font-black text-lg text-[#1A2533]">Project Analytics</h3>
//               <select className="text-xs font-bold border border-[#EAEAEA] bg-[#F9F9F9] text-[#1A2533] rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-[#00A896] transition-colors">
//                 <option>Weekly</option>
//                 <option>Monthly</option>
//               </select>
//             </div>
//             <div className="flex items-end justify-between h-48 px-2 md:px-6">
//               {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
//                 <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
//                   <div 
//                     className={`w-8 rounded-full transition-all duration-300 group-hover:bg-[#00A896] ${i === 3 ? 'bg-[#00A896] shadow-md shadow-[#00A896]/20' : 'bg-[#E5F1F0]'}`} 
//                     style={{ height: `${h}%` }}
//                   ></div>
//                   <span className={`text-[10px] font-bold transition-colors ${i === 3 ? 'text-[#1A2533]' : 'text-[#888888] group-hover:text-[#1A2533]'}`}>
//                     {'SMTWTFS'.split('')[i]}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* TEAM COLLABORATION */}
//           <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft">
//              <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-black text-lg text-[#1A2533]">Team Collaboration</h3>
//                 <button className="text-[10px] font-bold border border-[#EAEAEA] bg-[#F9F9F9] text-[#1A2533] px-4 py-2 rounded-xl hover:border-[#00A896] transition-colors shadow-sm">+ Add Member</button>
//              </div>
//              <div className="space-y-3">
//                 {[
//                   { name: 'Admin User', role: 'System Manager', status: 'Active', img: 'A' },
//                   { name: 'Developer', role: 'Content Creator', status: 'Pending', img: 'D' }
//                 ].map((user, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 hover:bg-[#F9F9F9] border border-transparent hover:border-[#EAEAEA] rounded-2xl transition-all cursor-pointer">
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 bg-[#E5F1F0] rounded-full flex items-center justify-center font-black text-[#00A896] shadow-inner">{user.img}</div>
//                       <div>
//                         <p className="text-sm font-bold text-[#1A2533]">{user.name}</p>
//                         <p className="text-[10px] text-[#888888] font-bold uppercase tracking-wider">{user.role}</p>
//                       </div>
//                     </div>
//                     <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${user.status === 'Active' ? 'bg-[#E5FAF0] text-[#30D158]' : 'bg-[#FFF1F0] text-[#FF3B30]'}`}>{user.status}</span>
//                   </div>
//                 ))}
//              </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN (REMINDERS & PROGRESS) */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
          
//           {/* REMINDERS CARD */}
//           <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft">
//             <h3 className="font-black text-lg text-[#1A2533] mb-6">Reminders</h3>
//             <div className="bg-[#F9F9F9] border border-[#EAEAEA] p-5 rounded-3xl space-y-4">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-[#00A896] rounded-2xl flex items-center justify-center text-white italic font-serif shadow-inner">D</div>
//                 <div>
//                   <p className="text-sm font-black text-[#1A2533]">Review New Questions</p>
//                   <p className="text-[10px] text-[#888888] font-bold mt-0.5">Time: 02:00 pm - 04:00 pm</p>
//                 </div>
//               </div>
//               <button className="w-full bg-[#1A2533] hover:bg-[#2A3543] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]">
//                 View All Tasks
//               </button>
//             </div>
//           </div>

//           {/* PROJECT PROGRESS */}
//           <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft flex flex-col items-center">
//             <h3 className="font-black text-lg text-[#1A2533] w-full mb-8 text-left">Project Progress</h3>
//             <div className="relative w-48 h-48 flex items-center justify-center">
//               <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
//                 <circle cx="96" cy="96" r="80" stroke="#F9F9F9" strokeWidth="16" fill="transparent" />
//                 <circle cx="96" cy="96" r="80" stroke="#00A896" strokeWidth="16" fill="transparent" strokeDasharray="502" strokeDashoffset="125" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
//               </svg>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-5xl font-black text-[#1A2533]">75%</span>
//                 <span className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mt-1">Database Full</span>
//               </div>
//             </div>
//             <div className="flex justify-center gap-6 mt-8 w-full border-t border-[#EAEAEA] pt-6">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-[#00A896] shadow-sm"></div>
//                 <span className="text-[11px] font-bold text-[#888888]">Completed</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-[#F9F9F9] border border-[#EAEAEA]"></div>
//                 <span className="text-[11px] font-bold text-[#888888]">In Progress</span>
//               </div>
//             </div>
//           </div>

//           {/* TIME TRACKER */}
//           <div className="bg-[#1A2533] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
//             <div className="relative z-10">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-2">System Uptime</p>
//               <h2 className="text-5xl font-black font-mono tracking-tight mb-8">24:08<span className="text-[#00A896]">:12</span></h2>
//               <div className="flex gap-4">
//                 <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all font-bold backdrop-blur-sm border border-white/5">||</button>
//                 <button className="w-12 h-12 bg-[#FF3B30] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF3B30]/20 hover:bg-[#E5352A] transition-all">■</button>
//               </div>
//             </div>
//             {/* Abstract background waves */}
//             <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 bg-[#00A896]/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
//             <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-[#30D158]/10 rounded-full blur-2xl"></div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

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
    // 🔥 FIX: Added pt-24 for mobile to avoid Hamburger menu overlap
    <div className="p-4 sm:p-6 md:p-8 pt-24 lg:pt-8 bg-[#FDFDFD] min-h-screen font-sans text-[#1A2533] selection:bg-[#00A896]/10">
      
      {/* --- TOP HEADER --- */}
      {/* 🔥 FIX: flex-col on mobile so buttons don't overflow */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1A2533]">Dashboard</h1>
          <p className="text-[#888888] text-sm font-medium mt-1">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="bg-[#00A896] hover:bg-[#009686] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md shadow-[#00A896]/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-95">
            <span className="text-lg leading-none">+</span> Add Project
          </button>
          <button className="bg-white border border-[#EAEAEA] text-[#1A2533] px-5 py-2.5 rounded-2xl font-bold text-sm hover:border-[#00A896] hover:text-[#00A896] transition-all shadow-sm flex items-center justify-center">
            Import Data
          </button>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (STATS & ANALYTICS) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* 4 STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Questions Card */}
            <div className="bg-[#00A896] text-white p-6 rounded-[2rem] shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Total Questions</p>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] backdrop-blur-sm italic font-black">↗</div>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-1">{totalQs}</h2>
                <p className="text-[10px] text-white/80 font-bold">↑ Increased from last month</p>
              </div>
            </div>

            {/* Theory Card */}
            <div className="bg-white border border-[#EAEAEA] p-6 rounded-[2rem] shadow-soft flex flex-col justify-between min-h-[160px] hover:border-[#00A896]/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Theory Items</p>
                <div className="w-7 h-7 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center text-[10px] italic font-black">↗</div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#1A2533] mb-1">{theoryQs}</h2>
                <p className="text-[10px] font-bold text-[#888888]">Core Concepts</p>
              </div>
            </div>

            {/* Practical Card */}
            <div className="bg-white border border-[#EAEAEA] p-6 rounded-[2rem] shadow-soft flex flex-col justify-between min-h-[160px] hover:border-[#00A896]/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Practical Items</p>
                <div className="w-7 h-7 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center text-[10px] italic font-black">↗</div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#1A2533] mb-1">{practicalQs}</h2>
                <p className="text-[10px] font-bold text-[#888888]">Applied Tasks</p>
              </div>
            </div>

            {/* XP Card */}
            <div className="bg-white border border-[#EAEAEA] p-6 rounded-[2rem] shadow-soft flex flex-col justify-between min-h-[160px] hover:border-[#00A896]/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Repository XP</p>
                <div className="w-7 h-7 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center text-[10px] italic font-black">↗</div>
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#1A2533] mb-1">{totalQs * 100}</h2>
                <p className="text-[10px] font-bold text-[#888888]">Total Value</p>
              </div>
            </div>
          </div>

          {/* PROJECT ANALYTICS BAR CHART */}
          <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft overflow-x-auto">
            <div className="flex justify-between items-center mb-8 min-w-[300px]">
              <h3 className="font-black text-lg text-[#1A2533]">Project Analytics</h3>
              <select className="text-xs font-bold border border-[#EAEAEA] bg-[#F9F9F9] text-[#1A2533] rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-[#00A896] transition-colors">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="flex items-end justify-between h-48 px-2 md:px-6 min-w-[400px]">
              {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-full group cursor-pointer">
                  <div 
                    className={`w-8 rounded-full transition-all duration-300 group-hover:bg-[#00A896] ${i === 3 ? 'bg-[#00A896] shadow-md shadow-[#00A896]/20' : 'bg-[#E5F1F0]'}`} 
                    style={{ height: `${h}%` }}
                  ></div>
                  <span className={`text-[10px] font-bold transition-colors ${i === 3 ? 'text-[#1A2533]' : 'text-[#888888] group-hover:text-[#1A2533]'}`}>
                    {'SMTWTFS'.split('')[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM COLLABORATION */}
          <div className="bg-white border border-[#EAEAEA] p-6 sm:p-8 rounded-[2rem] shadow-soft">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-[#1A2533]">Team Collaboration</h3>
                <button className="text-[10px] font-bold border border-[#EAEAEA] bg-[#F9F9F9] text-[#1A2533] px-4 py-2 rounded-xl hover:border-[#00A896] transition-colors shadow-sm">+ Add Member</button>
             </div>
             <div className="space-y-3">
                {[
                  { name: 'Admin User', role: 'System Manager', status: 'Active', img: 'A' },
                  { name: 'Developer', role: 'Content Creator', status: 'Pending', img: 'D' }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-[#F9F9F9] border border-transparent hover:border-[#EAEAEA] rounded-2xl transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#E5F1F0] rounded-full flex items-center justify-center font-black text-[#00A896] shadow-inner">{user.img}</div>
                      <div>
                        <p className="text-sm font-bold text-[#1A2533]">{user.name}</p>
                        <p className="text-[10px] text-[#888888] font-bold uppercase tracking-wider">{user.role}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider hidden xs:block ${user.status === 'Active' ? 'bg-[#E5FAF0] text-[#30D158]' : 'bg-[#FFF1F0] text-[#FF3B30]'}`}>{user.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN (REMINDERS & PROGRESS) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* REMINDERS CARD */}
          <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft">
            <h3 className="font-black text-lg text-[#1A2533] mb-6">Reminders</h3>
            <div className="bg-[#F9F9F9] border border-[#EAEAEA] p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00A896] rounded-2xl flex items-center justify-center text-white italic font-serif shadow-inner font-black text-xl">D</div>
                <div>
                  <p className="text-sm font-black text-[#1A2533]">Review Questions</p>
                  <p className="text-[10px] text-[#888888] font-bold mt-0.5">02:00 pm - 04:00 pm</p>
                </div>
              </div>
              <button className="w-full bg-[#1A2533] hover:bg-[#2A3543] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98]">
                View All Tasks
              </button>
            </div>
          </div>

          {/* PROJECT PROGRESS */}
          <div className="bg-white border border-[#EAEAEA] p-8 rounded-[2rem] shadow-soft flex flex-col items-center">
            <h3 className="font-black text-lg text-[#1A2533] w-full mb-8 text-left">Project Progress</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                <circle cx="96" cy="96" r="80" stroke="#F9F9F9" strokeWidth="16" fill="transparent" />
                <circle cx="96" cy="96" r="80" stroke="#00A896" strokeWidth="16" fill="transparent" strokeDasharray="502" strokeDashoffset="125" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-[#1A2533]">75%</span>
                <span className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mt-1">Database Full</span>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-8 w-full border-t border-[#EAEAEA] pt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00A896] shadow-sm"></div>
                <span className="text-[11px] font-bold text-[#888888]">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F9F9F9] border border-[#EAEAEA]"></div>
                <span className="text-[11px] font-bold text-[#888888]">In Progress</span>
              </div>
            </div>
          </div>

          {/* TIME TRACKER */}
          <div className="bg-[#1A2533] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-2">System Uptime</p>
              <h2 className="text-4xl xs:text-5xl font-black font-mono tracking-tight mb-8 text-white">24:08<span className="text-[#00A896]">:12</span></h2>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all font-bold backdrop-blur-sm border border-white/5 italic font-black">||</button>
                <button className="w-12 h-12 bg-[#FF3B30] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF3B30]/20 hover:bg-[#E5352A] transition-all font-black">■</button>
              </div>
            </div>
            {/* Abstract background waves */}
            <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 bg-[#00A896]/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-[#30D158]/10 rounded-full blur-2xl"></div>
          </div>

        </div>
      </div>
    </div>
  );
}