import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  // 🔥 Mobile Toggle State
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const navClass = (path) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
    location.pathname === path 
      ? 'bg-[#00A896] text-white shadow-md shadow-[#00A896]/20' 
      : 'text-[#888888] hover:bg-[#E5F1F0] hover:text-[#00A896]'
  }`;

  // Link click karne par mobile par sidebar band kar do
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* 🔥 MOBILE HAMBURGER BUTTON (Floating) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 bg-white p-2.5 rounded-xl shadow-md border border-[#EAEAEA] text-[#1A2533] hover:text-[#00A896] transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
        </svg>
      </button>

      {/* 🔥 MOBILE OVERLAY (Dark Blur Background) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#1A2533]/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🌟 SIDEBAR CONTAINER */}
      {/* Mobile pe fixed position aur slide effect, Desktop pe static */}
      <div className={`fixed lg:static top-0 left-0 h-screen w-72 bg-white border-r border-[#EAEAEA] p-8 flex flex-col shadow-[4px_0_24px_rgba(26,37,51,0.02)] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-12 mt-4 lg:mt-0 cursor-pointer" onClick={() => { navigate('/'); handleLinkClick(); }}>
          <div className="w-10 h-10 bg-[#E5F1F0] rounded-full flex items-center justify-center text-[#00A896] font-black text-xl shadow-inner">
            KH
          </div>
          <div className="text-2xl font-black text-[#1A2533] tracking-tight">
            Admin<span className="text-[#00A896]">.</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-3">
          <Link to="/" className={navClass('/')} onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link to="/questions" className={navClass('/questions')} onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span className="text-sm">Question Bank</span>
          </Link>
          <Link to="/candidates" className={navClass('/candidates')} onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <span className="text-sm">Analytics</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <button onClick={handleLogout} className="mt-auto flex items-center justify-center gap-3 w-full px-6 py-3.5 text-[#FF3B30] font-bold hover:bg-[#FFF1F0] rounded-2xl transition-all active:scale-[0.98] border border-transparent hover:border-[#FFD0D0]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </>
  );
}