// import React, { useState, useEffect } from 'react';
// // Assuming you are using react-router-dom for navigation
// import { useParams, useNavigate } from 'react-router-dom'; 
// import API from '../utils/api';

// export default function CandidateReview() {
//   const { id } = useParams(); // Gets the candidate ID from the URL
//   const navigate = useNavigate();
  
//   const [candidate, setCandidate] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch the specific candidate's full data
//     const fetchCandidateData = async () => {
//       try {
//         // Replace this endpoint with your actual single-candidate fetch route
//         const { data } = await API.get(`/evaluations/admin/candidate/${id}`);
//         setCandidate(data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch candidate details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchCandidateData();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-[#EAEAEA] border-t-[#00A896] rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error || !candidate) {
//     return (
//       <div className="min-h-screen bg-[#FDFDFD] p-10 flex flex-col items-center justify-center text-center">
//         <div className="text-[#FF3B30] bg-[#FFF0F0] p-6 rounded-2xl border border-[#FFD9D9] mb-4">
//           <h2 className="font-black text-xl mb-2">Oops! Something went wrong.</h2>
//           <p>{error || "Candidate not found."}</p>
//         </div>
//         <button onClick={() => navigate(-1)} className="text-[#00A896] font-bold underline">Go Back</button>
//       </div>
//     );
//   }

//   // Calculate stats safely
//   const attemptedCount = candidate.userAnswers ? Object.keys(candidate.userAnswers).length : 0;
//   const theoryCount = candidate.theoryCount || 0; 
//   const practicalCount = candidate.practicalCount || 0;

//   return (
//     <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] p-6 md:p-8 lg:p-10">
      
//       {/* Top Navigation & Header */}
//       <div className="max-w-5xl mx-auto mb-10">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-[#888888] hover:text-[#1A2533] font-bold text-sm mb-6 transition-colors"
//         >
//           <span>←</span> Back to Candidates
//         </button>

//         <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-[#EAEAEA] shadow-sm">
//           <div className="w-16 h-16 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center font-black text-2xl border border-[#D9E9E8] uppercase">
//             {candidate.name ? candidate.name.charAt(0) : '?'}
//           </div>
//           <div>
//             <h1 className="text-3xl font-black tracking-tight text-[#1A2533]">{candidate.name}'s Full Review</h1>
//             <p className="text-[#888888] font-medium mt-1">{candidate.email}</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* --- STATS CARDS --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-3xl border border-[#EAEAEA] shadow-soft flex flex-col justify-center items-center text-center hover:border-[#1A2533] transition-colors">
//             <span className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-2">Total Attempted</span>
//             <span className="text-5xl font-black text-[#1A2533]">{attemptedCount}</span>
//           </div>
          
//           <div className="bg-[#F4FBFB] p-6 rounded-3xl border border-[#D9E9E8] shadow-soft flex flex-col justify-center items-center text-center hover:border-[#00A896] transition-colors">
//             <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest mb-2">Theory Questions</span>
//             <span className="text-5xl font-black text-[#00A896]">{theoryCount}</span>
//           </div>

//           <div className="bg-[#F0FAF4] p-6 rounded-3xl border border-[#D0F0E0] shadow-soft flex flex-col justify-center items-center text-center hover:border-[#30D158] transition-colors">
//             <span className="text-xs font-bold text-[#30D158] uppercase tracking-widest mb-2">Practical Questions</span>
//             <span className="text-5xl font-black text-[#30D158]">{practicalCount}</span>
//           </div>
//         </div>

//         {/* --- OVERALL REVIEWS --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden flex flex-col">
//             <div className="bg-[#F9F9F9] px-6 py-4 border-b border-[#EAEAEA]">
//               <h3 className="text-sm font-black text-[#1A2533] uppercase tracking-widest flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-[#00A896]"></span> Theory Review
//               </h3>
//             </div>
//             <div className="p-6 text-base text-[#555555] leading-relaxed flex-1">
//               {candidate.overallTheoryReview || "No overall theory feedback has been written yet."}
//             </div>
//           </div>

//           <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden flex flex-col">
//             <div className="bg-[#F9F9F9] px-6 py-4 border-b border-[#EAEAEA]">
//               <h3 className="text-sm font-black text-[#1A2533] uppercase tracking-widest flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-[#30D158]"></span> Practical Review
//               </h3>
//             </div>
//             <div className="p-6 text-base text-[#555555] leading-relaxed flex-1">
//               {candidate.overallPracticalReview || "No overall practical feedback has been written yet."}
//             </div>
//           </div>
//         </div>

//         {/* --- DETAILED ANSWERS --- */}
//         <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
//           <div className="bg-[#1A2533] px-6 py-5">
//              <h3 className="text-sm font-black text-white uppercase tracking-widest">Question Breakdown</h3>
//           </div>
          
//           <div className="p-6 bg-[#FDFDFD]">
//             {(!candidate.userAnswers || attemptedCount === 0) ? (
//               <div className="text-center text-[#888888] py-10 font-medium">
//                 This candidate hasn't submitted any answers yet.
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {Object.entries(candidate.userAnswers).map(([questionId, answer], index) => {
//                   const scoreDetail = candidate.rawScores ? candidate.rawScores[questionId] : null;
//                   const points = scoreDetail?.points || 0;
                  
//                   return (
//                     <div key={questionId} className="border border-[#EAEAEA] rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
//                       <div className="flex justify-between items-center mb-5 border-b border-[#EAEAEA] pb-4">
//                         <span className="text-xs font-black bg-[#F4FBFB] text-[#00A896] px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#D9E9E8]">
//                           Question {index + 1}
//                         </span>
//                         <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${points > 0 ? 'bg-[#F0FAF4] text-[#30D158] border-[#D0F0E0]' : 'bg-[#FFF0F0] text-[#FF3B30] border-[#FFD9D9]'}`}>
//                           {points} Points
//                         </span>
//                       </div>
                      
//                       <div>
//                         <h4 className="text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-3">
//                           Candidate's Answer:
//                         </h4>
//                         <div className="text-sm text-[#1A2533] bg-[#F9F9F9] p-5 rounded-xl border border-[#EAEAEA] whitespace-pre-wrap leading-relaxed font-mono">
//                           {answer || <span className="text-[#888888] italic font-sans">No text provided.</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; 
// import API from '../utils/api';

// export default function CandidateReview() {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
  
//   const [candidate, setCandidate] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCandidateData = async () => {
//       try {
//         const { data } = await API.get(`/evaluations/admin/candidate/${id}`);
//         setCandidate(data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch candidate details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchCandidateData();
//   }, [id]);

//   // Loading State UI
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#F4F5F9] flex flex-col items-center justify-center">
//         <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
//         <p className="text-slate-500 font-semibold animate-pulse">Loading candidate profile...</p>
//       </div>
//     );
//   }

//   // Error State UI
//   if (error || !candidate) {
//     return (
//       <div className="min-h-screen bg-[#F4F5F9] p-10 flex flex-col items-center justify-center text-center">
//         <div className="text-rose-600 bg-rose-50 p-8 rounded-[24px] border border-rose-100 mb-6 max-w-md shadow-sm">
//           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">⚠️</div>
//           <h2 className="font-extrabold text-xl mb-2 text-slate-800">Oops! Something went wrong.</h2>
//           <p className="font-medium text-rose-500">{error || "Candidate not found."}</p>
//         </div>
//         <button 
//           onClick={() => navigate(-1)} 
//           className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold shadow-sm hover:text-purple-600 hover:border-purple-200 transition-all flex items-center gap-2"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   // Calculate stats safely
//   const attemptedCount = candidate.userAnswers ? Object.keys(candidate.userAnswers).length : 0;
//   const theoryCount = candidate.theoryCount || 0; 
//   const practicalCount = candidate.practicalCount || 0;

//   return (
//     <div className="min-h-screen bg-[#F4F5F9] font-sans text-slate-800 p-4 sm:p-6 md:p-8 lg:p-10 pt-24 lg:pt-10">
      
//       <div className="max-w-5xl mx-auto space-y-8">
        
//         {/* Top Navigation & Header */}
//         <div>
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold text-sm mb-6 transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-purple-100 shadow-none hover:shadow-sm"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
//             Back to Candidates
//           </button>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
//             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center font-black text-3xl border border-white shadow-md uppercase relative z-10">
//               {candidate.name ? candidate.name.charAt(0) : '?'}
//             </div>
//             <div className="relative z-10">
//               <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{candidate.name}'s Full Review</h1>
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
//                 <p className="text-slate-500 font-semibold">{candidate.email}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* --- STATS CARDS --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
//             <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
//               <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
//             </div>
//             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Attempted</span>
//             <span className="text-4xl font-black text-slate-800">{attemptedCount}</span>
//           </div>
          
//           <div className="bg-indigo-50 p-6 rounded-[24px] border border-indigo-100 shadow-sm flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
//             <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center mb-3 text-indigo-500 font-black">T</div>
//             <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Theory Questions</span>
//             <span className="text-4xl font-black text-indigo-600">{theoryCount}</span>
//           </div>

//           <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100 shadow-sm flex flex-col justify-center items-center text-center hover:-translate-y-1 transition-transform">
//             <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center mb-3 text-emerald-500 font-black">P</div>
//             <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Practical Questions</span>
//             <span className="text-4xl font-black text-emerald-600">{practicalCount}</span>
//           </div>
//         </div>

//         {/* --- OVERALL REVIEWS --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
//             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
//               <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Theory Feedback
//               </h3>
//             </div>
//             <div className="p-6 text-sm text-slate-600 font-medium leading-relaxed flex-1">
//               {candidate.overallTheoryReview || <span className="italic text-slate-400">No overall theory feedback has been written yet.</span>}
//             </div>
//           </div>

//           <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
//             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
//               <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Practical Feedback
//               </h3>
//             </div>
//             <div className="p-6 text-sm text-slate-600 font-medium leading-relaxed flex-1">
//               {candidate.overallPracticalReview || <span className="italic text-slate-400">No overall practical feedback has been written yet.</span>}
//             </div>
//           </div>
//         </div>

//         {/* --- DETAILED ANSWERS --- */}
//         <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mt-8">
//           <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
//              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
//                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
//                Detailed Question Breakdown
//              </h3>
//              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
//                {attemptedCount} Responses
//              </span>
//           </div>
          
//           <div className="p-4 sm:p-8 bg-slate-50/50">
//             {(!candidate.userAnswers || attemptedCount === 0) ? (
//               <div className="text-center text-slate-500 py-12 font-medium bg-white rounded-2xl border border-slate-200 border-dashed">
//                 <div className="text-4xl mb-3">📝</div>
//                 This candidate hasn't submitted any detailed answers yet.
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {Object.entries(candidate.userAnswers).map(([questionId, answer], index) => {
//                   const scoreDetail = candidate.rawScores ? candidate.rawScores[questionId] : null;
//                   const points = scoreDetail?.points || 0;
                  
//                   return (
//                     <div key={questionId} className="border border-slate-200 rounded-[24px] p-6 sm:p-8 bg-white hover:shadow-md hover:border-purple-200 transition-all group">
//                       <div className="flex flex-wrap justify-between items-center mb-6 border-b border-slate-100 pb-5 gap-4">
//                         <span className="text-xs font-bold bg-purple-50 text-purple-600 px-4 py-2 rounded-full uppercase tracking-widest border border-purple-100 shadow-sm flex items-center gap-2">
//                           <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
//                           Question {index + 1}
//                         </span>
//                         <span className={`text-[11px] font-black uppercase px-4 py-2 rounded-full border shadow-sm ${points > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
//                           {points} Points
//                         </span>
//                       </div>
                      
//                       <div>
//                         <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
//                           <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
//                           Candidate's Answer:
//                         </h4>
//                         <div className="text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200 whitespace-pre-wrap leading-relaxed font-mono shadow-inner">
//                           {answer || <span className="text-slate-400 italic font-sans">No text provided.</span>}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import API from '../utils/api';

export default function CandidateReview() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    if (id) fetchCandidateData();
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

  // Calculate stats safely
  const attemptedCount = candidate.userAnswers ? Object.keys(candidate.userAnswers).length : 0;
  const theoryCount = candidate.theoryCount || 0; 
  const practicalCount = candidate.practicalCount || 0;
  
  const practicalScore = Number(candidate.practical) || 0;
  const theoryScore = Number(candidate.theory) || 0;
  const totalScore = practicalScore + theoryScore;
  const percentage = (totalScore / 200) * 100; // Assuming 200 is max total score

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800 p-4 sm:p-6 md:p-10 pt-24 lg:pt-10 flex justify-center">
      
      {/* Main White Canvas Card (Matching the Reference Image) */}
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

          <div className="flex items-center gap-3 w-full md:w-auto">
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
            
            {/* Progress Bar Container */}
            <div className="max-w-xl">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</span>
                 <span className="text-[10px] font-bold text-slate-300">{totalScore} / 200 XP</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-orange-400 relative"
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- THREE MAIN METRICS (Matching the Image Style) --- */}
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

        {/* --- EVALUATION PANELS (Achievements / Inventory equivalent) --- */}
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

        {/* --- DETAILED ANSWERS --- */}
        <div className="pt-4">
          <h3 className="font-extrabold text-xl text-slate-900 mb-6">Detailed Answer Breakdown</h3>
          
          <div className="bg-slate-50/50 rounded-[32px] p-6 sm:p-8 border border-slate-100">
            {(!candidate.userAnswers || attemptedCount === 0) ? (
              <div className="text-center text-slate-400 py-10 font-medium">
                This candidate hasn't submitted any detailed answers yet.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(candidate.userAnswers).map(([questionId, answer], index) => {
                  const scoreDetail = candidate.rawScores ? candidate.rawScores[questionId] : null;
                  const points = scoreDetail?.points || 0;
                  
                  return (
                    <div key={questionId} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-50">
                        <span className="text-xs font-black bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full uppercase tracking-widest">
                          Question {index + 1}
                        </span>
                        <span className={`text-[11px] font-black uppercase px-4 py-1.5 rounded-full ${points > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {points} Points
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">
                          Candidate's Answer:
                        </h4>
                        <div className="text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed font-mono">
                          {answer || <span className="text-slate-400 italic font-sans">No text provided.</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}