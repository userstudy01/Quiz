import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const navClass = (path) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${
    location.pathname === path 
      ? 'bg-emerald-900 text-white shadow-xl shadow-emerald-900/20' 
      : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-900'
  }`;

  return (
    <div className="w-72 bg-white border-r border-slate-100 h-screen p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-emerald-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner italic">D</div>
        <div className="text-2xl font-black text-slate-900 tracking-tighter">Quiz<span className="text-emerald-800">.</span></div>
      </div>

      <nav className="flex-1 space-y-3">
        <Link to="/" className={navClass('/')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
          <span className="text-sm">Dashboard</span>
        </Link>
        <Link to="/questions" className={navClass('/questions')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span className="text-sm">Question Bank</span>
        </Link>
        <Link to="/candidates" className={navClass('/candidates')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="text-sm">Analytics</span>
        </Link>
      </nav>

      <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-6 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        <span>Logout</span>
      </button>
    </div>
  );
}