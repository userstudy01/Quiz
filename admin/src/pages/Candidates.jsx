// export default function Candidates() {
//   return (
//     <div className="bg-[#18181b] border border-zinc-800 rounded-lg overflow-hidden">
//       <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
//         <h2 className="text-lg font-bold text-zinc-100">Candidate Evaluation Metrics</h2>
//         <span className="text-xs font-mono text-zinc-500">Live Data Sync</span>
//       </div>
//       <div className="p-12 text-center text-zinc-500 font-mono text-sm">
//         // Backend API implementation pending for retrieving full evaluations.
//         <br/>
//         // Connect this to your GET /api/admin/evaluations route.
//       </div>
//     </div>
//   );
// }

export default function Candidates() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300 font-sans">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review candidate performance metrics.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden max-w-4xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Live Evaluation Metrics</h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full">Syncing...</span>
        </div>
        <div className="p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-slate-400">📊</div>
          <h3 className="text-slate-600 dark:text-slate-300 font-medium mb-2">Backend API Connection Pending</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-md mx-auto">
            Connect this component to your GET /api/admin/evaluations route to display real-time candidate scores.
          </p>
        </div>
      </div>
    </div>
  );
}