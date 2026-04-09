export default function StatsPanel({ stats, activeTab, questions, activeScores, scrollToQuestion, onForceSubmit }) {
  return (
    <aside className="hidden xl:flex w-80 bg-[#EAEFF0] border-l border-[#D9E9E8] flex-col h-full">
      <div className="p-6 border-b border-[#D9E9E8] bg-white">
        <h3 className="text-sm font-black text-[#1A2533] uppercase tracking-wide mb-4">
          {activeTab} Score
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#E5FAF0] p-3 rounded-xl border border-[#D0F0E0]">
            <div className="text-[10px] font-bold text-[#30D158] uppercase">Passed</div>
            <div className="text-lg font-black text-[#30D158]">{stats.passed}</div>
          </div>
          <div className="bg-[#00A896] p-3 rounded-xl shadow-md">
            <div className="text-[10px] font-bold text-white/80 uppercase">Total XP</div>
            <div className="text-lg font-black text-white">{stats.totalScore}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h4 className="text-[10px] font-bold text-[#1A2533] uppercase tracking-widest mb-4">Progress Map</h4>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, i) => {
            const evalData = activeScores[q._id];
            let btnClass = "bg-white border-[#EAEAEA] text-[#888888]";
            if (evalData?.isLocked) {
              btnClass = evalData.points === 1 ? "bg-[#30D158] text-white" : "bg-[#FF3B30] text-white";
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

        <div className="mt-10">
          <button
            onClick={onForceSubmit}
            className="w-full bg-[#00A896] hover:bg-[#008c7d] text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Submit to Database
          </button>
        </div>
      </div>
    </aside>
  );
}