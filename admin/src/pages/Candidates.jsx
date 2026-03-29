export default function Candidates() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] p-6 md:p-8 lg:p-10 selection:bg-[#00A896]/10">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-[#1A2533]">Candidate Analytics</h1>
        <p className="text-[#888888] text-sm font-medium mt-1">Review and monitor real-time candidate performance metrics.</p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-[2rem] shadow-soft overflow-hidden max-w-5xl">
        
        {/* Card Header */}
        <div className="p-6 border-b border-[#EAEAEA] flex justify-between items-center bg-[#F9F9F9]">
          <h2 className="text-lg font-black text-[#1A2533]">Live Evaluation Metrics</h2>
          <div className="flex items-center gap-2 bg-[#E5FAF0] text-[#30D158] px-4 py-1.5 rounded-full shadow-sm border border-[#D0F0E0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Sync</span>
          </div>
        </div>

        {/* Empty State / Pending Content */}
        <div className="p-16 md:p-24 text-center relative overflow-hidden">
          {/* Decorative background blur blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#00A896]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-[#30D158]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-20 h-20 bg-[#E5F1F0] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#D9E9E8] rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg className="w-10 h-10 text-[#00A896]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            
            <h3 className="text-2xl font-black text-[#1A2533] mb-3">API Connection Pending</h3>
            <p className="text-[#888888] font-medium text-base max-w-lg mx-auto leading-relaxed mb-8">
              The dashboard is ready, but the data stream is not connected yet. Link this component to your backend to start receiving real-time candidate scores.
            </p>

            {/* Developer Hint Snippet */}
            <div className="inline-block bg-[#1A2533] p-5 rounded-2xl shadow-xl shadow-[#1A2533]/10 border border-[#2A3543] text-left hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF9500]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#30D158]"></div>
                <span className="ml-2 text-[10px] font-bold text-[#888888] uppercase tracking-widest">Route Setup Hint</span>
              </div>
              <code className="text-sm font-mono text-[#00A896]">
                <span className="text-[#0A84FF] font-bold">GET</span> /api/admin/evaluations
              </code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}