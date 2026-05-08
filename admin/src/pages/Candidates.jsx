// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../utils/api';

// export default function Candidates() {
//   const navigate = useNavigate();
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [candidateData, setCandidateData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const { data } = await API.get('/evaluations/admin/all');
//         setCandidateData(data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCandidates();

//     const pollingInterval = setInterval(() => {
//       fetchCandidates();
//     }, 5000);

//     return () => clearInterval(pollingInterval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] p-6 md:p-8 lg:p-10 selection:bg-[#00A896]/10">

//       {/* Header */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-black tracking-tight text-[#1A2533]">Candidate Analytics</h1>
//         <p className="text-[#888888] text-sm font-medium mt-1">Review and monitor real-time candidate performance metrics.</p>
//       </div>

//       {/* Main Card */}
//       <div className="bg-white border border-[#EAEAEA] rounded-[2rem] shadow-soft overflow-hidden max-w-6xl">

//         {/* Card Header */}
//         <div className="p-6 border-b border-[#EAEAEA] flex justify-between items-center bg-[#F9F9F9]">
//           <h2 className="text-lg font-black text-[#1A2533]">Live Evaluation Metrics</h2>

//           {/* Dynamic Status Indicator */}
//           {isLoading ? (
//             <div className="flex items-center gap-2 bg-[#FFF8E5] text-[#FF9500] px-4 py-1.5 rounded-full shadow-sm border border-[#FFE8B3]">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse"></span>
//               <span className="text-[10px] font-black uppercase tracking-widest">Fetching...</span>
//             </div>
//           ) : error ? (
//             <div className="flex items-center gap-2 bg-[#FFF0F0] text-[#FF3B30] px-4 py-1.5 rounded-full shadow-sm border border-[#FFD9D9]">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
//               <span className="text-[10px] font-black uppercase tracking-widest">Connection Error</span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2 bg-[#E5FAF0] text-[#30D158] px-4 py-1.5 rounded-full shadow-sm border border-[#D0F0E0]">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse"></span>
//               <span className="text-[10px] font-black uppercase tracking-widest">Live Sync</span>
//             </div>
//           )}
//         </div>

//         {/* Error State */}
//         {error && !isLoading && (
//           <div className="p-10 text-center text-[#FF3B30] font-medium bg-[#FFF0F0] m-6 rounded-xl border border-[#FFD9D9]">
//             Error loading data: {error}. Please check your backend connection.
//           </div>
//         )}

//         {/* Loading State */}
//         {isLoading && !error && (
//           <div className="p-20 text-center flex flex-col items-center justify-center">
//             <div className="w-10 h-10 border-4 border-[#EAEAEA] border-t-[#00A896] rounded-full animate-spin mb-4"></div>
//             <p className="text-[#888888] font-medium">Connecting to database...</p>
//           </div>
//         )}

//         {/* Data Table */}
//         {!isLoading && !error && (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse whitespace-nowrap">
//               <thead>
//                 <tr className="bg-[#FDFDFD] border-b border-[#EAEAEA] text-[#888888] text-xs uppercase tracking-wider font-bold">
//                   <th className="py-4 px-6 font-bold">Candidate Info</th>
//                   <th className="py-4 px-6 font-bold text-center">Practical <span className="font-normal lowercase text-[10px]">(out of 100)</span></th>
//                   <th className="py-4 px-6 font-bold text-center">Theory <span className="font-normal lowercase text-[10px]">(out of 100)</span></th>
//                   <th className="py-4 px-6 font-bold text-center">Overall Total</th>
//                   <th className="py-4 px-6 font-bold">Performance</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#EAEAEA]">
//                 {candidateData.map((candidate) => {
//                   const practical = Number(candidate.practical) || 0;
//                   const theory = Number(candidate.theory) || 0;
//                   const total = practical + theory;
//                   const percentage = (total / 200) * 100;

//                   let statusColor = "text-[#30D158] bg-[#E5FAF0] border-[#D0F0E0]";
//                   let statusText = "Excellent";
//                   if (percentage < 60) {
//                     statusColor = "text-[#FF3B30] bg-[#FFF0F0] border-[#FFD9D9]";
//                     statusText = "Needs Review";
//                   } else if (percentage < 80) {
//                     statusColor = "text-[#FF9500] bg-[#FFF8E5] border-[#FFE8B3]";
//                     statusText = "Average";
//                   }

//                   return (
//                     <tr key={candidate.id || candidate._id} className="hover:bg-[#F9FDFD] transition-colors duration-150 group">
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center font-bold text-sm border border-[#D9E9E8] uppercase">
//                             {candidate.name ? candidate.name.charAt(0) : '?'}
//                           </div>
//                           <div>
//                             <div className="font-bold text-[#1A2533]">{candidate.name || "Unknown User"}</div>
//                             <div className="text-xs text-[#888888] font-medium">{candidate.email || "No email"}</div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="py-4 px-6 text-center">
//                         <span className="font-black text-[#1A2533] text-lg">{practical}</span>
//                       </td>

//                       <td className="py-4 px-6 text-center">
//                         <span className="font-black text-[#1A2533] text-lg">{theory}</span>
//                       </td>

//                       <td className="py-4 px-6">
//                         <div className="flex flex-col items-center gap-1">
//                           <span className="font-black text-[#00A896] text-xl">{total}</span>
//                           <div className="w-24 h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-[#00A896] rounded-full"
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* 🔥 CHANGE 1: THIS IS NOW A CLICKABLE BUTTON */}
//                       {/* 🔥 CHANGE 1: THIS NAVIGATES TO THE NEW PAGE */}
//                       <td className="py-4 px-6">
//                         <button
//                           onClick={() => navigate(`/candidates/${candidate.id || candidate._id}`)} // ✅ ADD THIS LINE
//                           className={`px-3 py-1 text-[11px] font-black uppercase tracking-wide rounded-full border hover:opacity-80 transition-opacity cursor-pointer ${statusColor}`}
//                         >
//                           {statusText}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {candidateData.length === 0 && (
//               <div className="p-16 text-center">
//                 <div className="w-16 h-16 bg-[#F9F9F9] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#EAEAEA]">
//                   <svg className="w-8 h-8 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
//                 </div>
//                 <h3 className="text-lg font-bold text-[#1A2533] mb-1">No Candidates Found</h3>
//                 <p className="text-[#888888] font-medium">Your database connection is successful, but there are no scores to display yet.</p>
//               </div>
//             )}
//           </div>
//         )}

//       </div>

//       {/* 🔥 CHANGE 2: THE POPUP MODAL */}
//       {selectedCandidate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2533]/40 backdrop-blur-sm">
//           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in border border-[#EAEAEA]">

//             {/* Modal Header */}
//             <div className="p-6 border-b border-[#EAEAEA] flex justify-between items-center bg-[#F9F9F9]">
//               <div>
//                 <h2 className="text-xl font-black text-[#1A2533]">{selectedCandidate.name}'s Details</h2>
//                 <p className="text-xs text-[#888888] font-medium">{selectedCandidate.email}</p>
//               </div>
//               <button
//                 onClick={() => setSelectedCandidate(null)}
//                 className="w-8 h-8 flex items-center justify-center bg-white border border-[#EAEAEA] rounded-full hover:bg-[#FDFDFD] text-[#1A2533] font-bold shadow-sm"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Modal Body (Scrollable Answers) */}
//             <div className="p-6 overflow-y-auto flex-1 bg-[#FDFDFD]">
//               {(!selectedCandidate.userAnswers || Object.keys(selectedCandidate.userAnswers).length === 0) ? (
//                 <div className="text-center text-[#888888] py-10 font-medium">No detailed answers recorded yet.</div>
//               ) : (
//                 <div className="space-y-6">
//                   {Object.entries(selectedCandidate.userAnswers).map(([questionId, answer], index) => {
//                     // Safely grab the score details
//                     const scoreDetail = selectedCandidate.rawScores ? selectedCandidate.rawScores[questionId] : null;
//                     const points = scoreDetail?.points || 0;

//                     return (
//                       <div key={questionId} className="border border-[#EAEAEA] rounded-2xl p-5 bg-white shadow-sm hover:border-[#00A896] transition-colors">
//                         <div className="flex justify-between items-start mb-4">
//                           <span className="text-xs font-black bg-[#E5F1F0] text-[#00A896] px-3 py-1 rounded-full uppercase tracking-widest">
//                             Question {index + 1}
//                           </span>
//                           <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${points > 0 ? 'bg-[#E5FAF0] text-[#30D158]' : 'bg-[#FFF1F0] text-[#FF3B30]'}`}>
//                             {points} Points
//                           </span>
//                         </div>

//                         <div>
//                           <h4 className="text-[10px] font-bold text-[#888888] uppercase tracking-widest mb-2 flex items-center gap-1.5">
//                             <span className="w-1.5 h-1.5 rounded-full bg-[#1A2533]"></span>
//                             Candidate's Answer:
//                           </h4>
//                           <p className="text-sm text-[#1A2533] bg-[#F9F9F9] p-4 rounded-xl border border-[#EAEAEA] whitespace-pre-wrap leading-relaxed">
//                             {answer || <span className="text-[#888888] italic">No text provided.</span>}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Candidates() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateData, setCandidateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await API.get('/evaluations/admin/all');
        setCandidateData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();

    // Real-time polling
    const pollingInterval = setInterval(() => {
      fetchCandidates();
    }, 5000);

    return () => clearInterval(pollingInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F5F9] font-sans text-slate-800 flex flex-col pt-24 lg:pt-0">
      
      <div className="p-4 sm:p-6 md:p-8 h-full">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Candidate Analytics</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Review and monitor real-time candidate performance metrics.</p>
          </div>
          
          <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:text-purple-600 hover:border-purple-200 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export Report
          </button>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden max-w-7xl">

          {/* Card Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Live Evaluation Metrics</h2>

            {/* Dynamic Status Indicator */}
            {isLoading ? (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full shadow-sm border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Fetching...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full shadow-sm border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Connection Error</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full shadow-sm border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Live Sync</span>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-8 text-center text-rose-600 font-medium bg-rose-50 m-6 rounded-2xl border border-rose-100">
              Error loading data: {error}. Please check your backend connection.
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Connecting to database...</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="py-4 px-6 font-bold">Candidate Info</th>
                    <th className="py-4 px-6 font-bold text-center">Practical <span className="font-semibold lowercase text-[10px] text-slate-400">(out of 100)</span></th>
                    <th className="py-4 px-6 font-bold text-center">Theory <span className="font-semibold lowercase text-[10px] text-slate-400">(out of 100)</span></th>
                    <th className="py-4 px-6 font-bold text-center">Overall Score</th>
                    <th className="py-4 px-6 font-bold text-right pr-8">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidateData.map((candidate) => {
                    const practical = Number(candidate.practical) || 0;
                    const theory = Number(candidate.theory) || 0;
                    const total = practical + theory;
                    const percentage = (total / 200) * 100;

                    let statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
                    let statusText = "Excellent";
                    
                    if (percentage < 60) {
                      statusColor = "text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100";
                      statusText = "Needs Review";
                    } else if (percentage < 80) {
                      statusColor = "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100";
                      statusText = "Average";
                    }

                    return (
                      <tr key={candidate.id || candidate._id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                        
                        {/* 1. Candidate Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                              {candidate.name ? candidate.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{candidate.name || "Unknown User"}</div>
                              <div className="text-xs text-slate-400 font-medium">{candidate.email || "No email provided"}</div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Practical Score */}
                        <td className="py-4 px-6 text-center">
                          <span className="font-black text-slate-700 text-lg">{practical}</span>
                        </td>

                        {/* 3. Theory Score */}
                        <td className="py-4 px-6 text-center">
                          <span className="font-black text-slate-700 text-lg">{theory}</span>
                        </td>

                        {/* 4. Total Score & Progress Bar */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-black text-purple-600 text-xl">{total}</span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* 5. Performance Button */}
                        <td className="py-4 px-6 text-right pr-8">
                          <button
                            onClick={() => navigate(`/candidates/${candidate.id || candidate._id}`)} 
                            className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${statusColor}`}
                          >
                            {statusText} <span className="ml-1 opacity-60">→</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {candidateData.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No Candidates Found</h3>
                  <p className="text-slate-500 text-sm font-medium">Database connected, but no evaluations match the criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL (In case you still use this logic elsewhere)       */}
      {/* ======================================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in border border-slate-200">

            {/* Modal Header */}
            <div className="bg-purple-600 p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-black">{selectedCandidate.name}'s Details</h2>
                <p className="text-xs text-purple-200 font-medium mt-1">{selectedCandidate.email}</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {(!selectedCandidate.userAnswers || Object.keys(selectedCandidate.userAnswers).length === 0) ? (
                <div className="text-center text-slate-500 py-10 font-medium">No detailed answers recorded yet.</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(selectedCandidate.userAnswers).map(([questionId, answer], index) => {
                    const scoreDetail = selectedCandidate.rawScores ? selectedCandidate.rawScores[questionId] : null;
                    const points = scoreDetail?.points || 0;

                    return (
                      <div key={questionId} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:border-purple-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full uppercase tracking-widest">
                            Question {index + 1}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${points > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {points} Points
                          </span>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Candidate's Answer
                          </h4>
                          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                            {answer || <span className="text-slate-400 italic">No text provided.</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}