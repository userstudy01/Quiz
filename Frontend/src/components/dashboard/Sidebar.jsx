export default function Sidebar({ history, viewingHistoryIndex, setViewingHistoryIndex, onExit, onRestart, isHistoryMode, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#1A2533]/20 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-80 bg-[#1A2533] border-r border-[#1A2533] z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex justify-between items-center p-6 border-b border-[#2A3543]">
          <h3 className="text-sm font-black text-white uppercase tracking-wide">Workspace</h3>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white">✖</button>
        </div>

        <div className="p-6 space-y-4">
          <button onClick={onExit} className="w-full bg-[#2A3543] hover:bg-[#3A4553] text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
            ← Exit Module
          </button>

          {isHistoryMode ? (
            <button onClick={() => setViewingHistoryIndex(null)} className="w-full bg-[#00A896] text-white font-bold py-3 rounded-xl text-sm">
              ← Resume Current
            </button>
          ) : (
            <button onClick={onRestart} className="w-full bg-[#00A896] hover:bg-[#009686] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm">
              ⟳ Restart Session
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 border-t border-[#2A3543]/50">
          <h4 className="text-[10px] font-bold text-[#E5F1F0] uppercase tracking-widest mb-4">Past Sessions</h4>
          {history.length === 0 ? (
            <p className="text-white/40 text-xs text-center">No history yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((record, i) => (
                <div
                  key={i}
                  onClick={() => setViewingHistoryIndex(i)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    viewingHistoryIndex === i ? 'bg-[#2A3543] border-[#00A896]' : 'bg-[#2A3543] border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white">{record.date.split(',')[0]}</span>
                    <span className="text-[10px] bg-[#00A896] text-white px-2 rounded-full">XP: {record.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}