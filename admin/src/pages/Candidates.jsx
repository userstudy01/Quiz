import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Candidates() {
  const navigate = useNavigate();
  const [candidateData, setCandidateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await API.get('/evaluations/admin/all');
        
        // 🔥 Grouping by Email + Module and counting total attempts
        const groupedData = data.reduce((acc, curr) => {
          const email = curr.email || curr.candidateId?.email || 'unknown';
          const moduleName = curr.moduleName || 'Unknown Module';
          const uniqueKey = `${email}_${moduleName}`;

          if (!acc[uniqueKey]) {
            acc[uniqueKey] = {
              ...curr,
              name: curr.name || curr.candidateId?.name,
              email: email,
              moduleName: moduleName,
              
              // 🔥 THE FIX: AGGRESSIVE ID FALLBACK
              // Yeh check karega ki database ne ID kis naam se bheji hai aur usko pakad lega
              idToNavigate: curr._id || curr.id || (curr.candidateId && curr.candidateId._id) || curr.candidateId,
              
              totalTheory: 0,
              totalPractical: 0,
              totalAttempted: 0 
            };
          }

          // Active scores & attempts
          acc[uniqueKey].totalTheory += (Number(curr.scores?.theory) || Number(curr.theory) || 0);
          acc[uniqueKey].totalPractical += (Number(curr.scores?.practical) || Number(curr.practical) || 0);
          if (curr.userAnswers) {
            acc[uniqueKey].totalAttempted += Object.keys(curr.userAnswers).length;
          }

          // History scores & attempts
          if (curr.history && Array.isArray(curr.history)) {
            curr.history.forEach(h => {
              acc[uniqueKey].totalTheory += (Number(h.score) || Number(h.totalScore) || 0);
              if (h.savedAnswers) {
                acc[uniqueKey].totalAttempted += Object.keys(h.savedAnswers).length;
              }
            });
          }

          return acc;
        }, {});

        setCandidateData(Object.values(groupedData)); 
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
    const pollingInterval = setInterval(() => { fetchCandidates(); }, 5000);
    return () => clearInterval(pollingInterval);
  }, []);

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F4F5F9] font-sans text-slate-800 flex flex-col pt-24 lg:pt-0">
      <div className="p-4 sm:p-6 md:p-8 h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Candidate Analytics</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Real-time candidate performance.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden max-w-7xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6 font-bold">Candidate</th>
                  <th className="py-4 px-6 font-bold">Module</th>
                  <th className="py-4 px-6 font-bold text-center">Attempted Qs</th>
                  <th className="py-4 px-6 font-bold text-center">Overall XP</th>
                  <th className="py-4 px-6 font-bold text-right pr-8">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidateData.map((candidate) => {
                  const total = candidate.totalTheory + candidate.totalPractical;
                  const percentage = (total / 200) * 100;
                  return (
                    <tr key={candidate.idToNavigate} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{candidate.name}</div>
                        <div className="text-xs text-slate-400">{candidate.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg text-xs">
                          {candidate.moduleName}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-bold bg-slate-100 px-3 py-1 rounded-full text-xs">
                          {candidate.totalAttempted} Qs
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-black text-purple-600 text-lg">
                        {total}
                      </td>
                      <td className="py-4 px-6 text-right pr-8">
                        <button
                          onClick={() => navigate(`/candidates/${candidate.idToNavigate}`)}
                          className="px-4 py-1.5 text-[11px] font-bold uppercase rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-200"
                        >
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}