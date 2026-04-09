import { Link } from 'react-router-dom';

export default function ModuleGrid({ user, questions, onModuleSelect, onLogout }) {
  const availableRounds = [...new Set([...questions].reverse().map(q => q.title))];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A2533] selection:bg-[#00A896]/10 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex justify-between items-center pb-6 mb-10 border-b-2 border-[#EAEAEA]">
          <div>
            <Link to="/" className="cursor-pointer">
              <h1 className="text-4xl font-black tracking-tight text-[#1A2533] hover:opacity-80 transition-opacity">
                Knowledge <span className="text-[#00A896]">Hub</span>
              </h1>
            </Link>
            <p className="text-sm text-[#888888] mt-2 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A896]"></span>
              Welcome back, {user?.name}
            </p>
          </div>
          <button onClick={onLogout} className="text-sm font-bold text-[#1A2533] bg-white hover:bg-[#F9F9F9] border border-[#EAEAEA] px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95">
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRounds.length === 0 ? (
            <div className="col-span-full text-center text-[#888888] mt-10 border-2 border-dashed border-[#EAEAEA] p-10 rounded-[1.5rem] bg-[#F9F9F9]">No modules available.</div>
          ) : (
            availableRounds.map((roundName, index) => {
              const qCount = questions.filter(q => q.title === roundName).length;
              const cardColors = ['bg-[#00A896] text-white', 'bg-[#FFFFFF] text-[#1A2533] border border-[#EAEAEA]', 'bg-[#1A2533] text-white'];
              const colorTheme = cardColors[index % 3];

              return (
                <div key={index} onClick={() => onModuleSelect(roundName)} className={`${colorTheme} p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-soft flex flex-col min-h-[180px]`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index % 3 === 1 ? 'bg-[#E5F1F0] text-[#00A896]' : 'bg-white/10 text-white backdrop-blur-sm'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight">{roundName}</h3>
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <p className={`text-xs font-bold ${index % 3 === 1 ? 'text-[#888888]' : 'text-white/80'}`}>{qCount} Challenges</p>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${index % 3 === 1 ? 'bg-[#00A896] text-white' : 'bg-white text-black'}`}>→</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}