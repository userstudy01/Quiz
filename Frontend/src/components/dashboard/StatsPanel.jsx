export default function StatsPanel({ 
  isHistoryMode, 
  activeTab, 
  stats, 
  currentTabQuestions, 
  activeScores, 
  handleForceSubmit 
}) {
  const scrollToQuestion = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <aside className="hidden xl:flex w-80 bg-[#EAEFF0] border-l border-[#D9E9E8] flex-col h-full">
      <div className="p-6 border-b border-[#D9E9E8] bg-white">
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
          <div className="bg-[#00A896] p-3 rounded-xl border border-[#009686] text-white shadow-md">
            <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider mb-1">Total XP</div>
            <div className="text-lg font-black">{stats.totalScore}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A2533]">Progress Map</h4>
          <span className="text-[10px] font-bold text-white bg-[#00A896] px-2 py-0.5 rounded-full">{activeTab}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {currentTabQuestions.map((q, i) => {
            const eD = activeScores[q._id];
            let cl = "bg-white border-[#EAEAEA] text-[#888888]";
            if (eD?.isLocked) {
              cl = eD.points === 1 ? "bg-[#30D158] border-[#30D158] text-white" : 
                   eD.points === 0.5 ? "bg-[#0A84FF] border-[#0A84FF] text-white" : 
                   "bg-[#FF3B30] border-[#FF3B30] text-white";
            }
            return (
              <button 
                key={q._id} 
                onClick={() => scrollToQuestion(q._id)} 
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${cl}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-10 mb-20">
          <button onClick={handleForceSubmit} className="bg-[#00A896] hover:bg-[#008c7d] text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-all w-full flex items-center justify-center gap-2">
            Submit to Database
          </button>
        </div>
      </div>
    </aside>
  );
}