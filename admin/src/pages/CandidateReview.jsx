import React, { useState, useEffect } from 'react';
// Assuming you are using react-router-dom for navigation
import { useParams, useNavigate } from 'react-router-dom'; 
import API from '../utils/api';

export default function CandidateReview() {
  const { id } = useParams(); // Gets the candidate ID from the URL
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the specific candidate's full data
    const fetchCandidateData = async () => {
      try {
        // Replace this endpoint with your actual single-candidate fetch route
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#EAEAEA] border-t-[#00A896] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] p-10 flex flex-col items-center justify-center text-center">
        <div className="text-[#FF3B30] bg-[#FFF0F0] p-6 rounded-2xl border border-[#FFD9D9] mb-4">
          <h2 className="font-black text-xl mb-2">Oops! Something went wrong.</h2>
          <p>{error || "Candidate not found."}</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-[#00A896] font-bold underline">Go Back</button>
      </div>
    );
  }

  // Calculate stats safely
  const attemptedCount = candidate.userAnswers ? Object.keys(candidate.userAnswers).length : 0;
  const theoryCount = candidate.theoryCount || 0; 
  const practicalCount = candidate.practicalCount || 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] p-6 md:p-8 lg:p-10">
      
      {/* Top Navigation & Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#888888] hover:text-[#1A2533] font-bold text-sm mb-6 transition-colors"
        >
          <span>←</span> Back to Candidates
        </button>

        <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] border border-[#EAEAEA] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#E5F1F0] text-[#00A896] flex items-center justify-center font-black text-2xl border border-[#D9E9E8] uppercase">
            {candidate.name ? candidate.name.charAt(0) : '?'}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1A2533]">{candidate.name}'s Full Review</h1>
            <p className="text-[#888888] font-medium mt-1">{candidate.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EAEAEA] shadow-soft flex flex-col justify-center items-center text-center hover:border-[#1A2533] transition-colors">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-2">Total Attempted</span>
            <span className="text-5xl font-black text-[#1A2533]">{attemptedCount}</span>
          </div>
          
          <div className="bg-[#F4FBFB] p-6 rounded-3xl border border-[#D9E9E8] shadow-soft flex flex-col justify-center items-center text-center hover:border-[#00A896] transition-colors">
            <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest mb-2">Theory Questions</span>
            <span className="text-5xl font-black text-[#00A896]">{theoryCount}</span>
          </div>

          <div className="bg-[#F0FAF4] p-6 rounded-3xl border border-[#D0F0E0] shadow-soft flex flex-col justify-center items-center text-center hover:border-[#30D158] transition-colors">
            <span className="text-xs font-bold text-[#30D158] uppercase tracking-widest mb-2">Practical Questions</span>
            <span className="text-5xl font-black text-[#30D158]">{practicalCount}</span>
          </div>
        </div>

        {/* --- OVERALL REVIEWS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden flex flex-col">
            <div className="bg-[#F9F9F9] px-6 py-4 border-b border-[#EAEAEA]">
              <h3 className="text-sm font-black text-[#1A2533] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00A896]"></span> Theory Review
              </h3>
            </div>
            <div className="p-6 text-base text-[#555555] leading-relaxed flex-1">
              {candidate.overallTheoryReview || "No overall theory feedback has been written yet."}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden flex flex-col">
            <div className="bg-[#F9F9F9] px-6 py-4 border-b border-[#EAEAEA]">
              <h3 className="text-sm font-black text-[#1A2533] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#30D158]"></span> Practical Review
              </h3>
            </div>
            <div className="p-6 text-base text-[#555555] leading-relaxed flex-1">
              {candidate.overallPracticalReview || "No overall practical feedback has been written yet."}
            </div>
          </div>
        </div>

        {/* --- DETAILED ANSWERS --- */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-soft overflow-hidden">
          <div className="bg-[#1A2533] px-6 py-5">
             <h3 className="text-sm font-black text-white uppercase tracking-widest">Question Breakdown</h3>
          </div>
          
          <div className="p-6 bg-[#FDFDFD]">
            {(!candidate.userAnswers || attemptedCount === 0) ? (
              <div className="text-center text-[#888888] py-10 font-medium">
                This candidate hasn't submitted any answers yet.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(candidate.userAnswers).map(([questionId, answer], index) => {
                  const scoreDetail = candidate.rawScores ? candidate.rawScores[questionId] : null;
                  const points = scoreDetail?.points || 0;
                  
                  return (
                    <div key={questionId} className="border border-[#EAEAEA] rounded-2xl p-6 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-5 border-b border-[#EAEAEA] pb-4">
                        <span className="text-xs font-black bg-[#F4FBFB] text-[#00A896] px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#D9E9E8]">
                          Question {index + 1}
                        </span>
                        <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${points > 0 ? 'bg-[#F0FAF4] text-[#30D158] border-[#D0F0E0]' : 'bg-[#FFF0F0] text-[#FF3B30] border-[#FFD9D9]'}`}>
                          {points} Points
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-[11px] font-bold text-[#888888] uppercase tracking-widest mb-3">
                          Candidate's Answer:
                        </h4>
                        <div className="text-sm text-[#1A2533] bg-[#F9F9F9] p-5 rounded-xl border border-[#EAEAEA] whitespace-pre-wrap leading-relaxed font-mono">
                          {answer || <span className="text-[#888888] italic font-sans">No text provided.</span>}
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