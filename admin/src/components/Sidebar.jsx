// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // 🔥 Mobile Toggle State
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem('adminUser');
//     navigate('/login');
//   };

//   const navClass = (path) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
//     location.pathname === path 
//       ? 'bg-[#00A896] text-white shadow-md shadow-[#00A896]/20' 
//       : 'text-[#888888] hover:bg-[#E5F1F0] hover:text-[#00A896]'
//   }`;

//   // Link click karne par mobile par sidebar band kar do
//   const handleLinkClick = () => setIsOpen(false);

//   return (
//     <>
//       {/* 🔥 MOBILE HAMBURGER BUTTON (Floating) */}
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="lg:hidden fixed top-5 left-5 z-50 bg-white p-2.5 rounded-xl shadow-md border border-[#EAEAEA] text-[#1A2533] hover:text-[#00A896] transition-colors"
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
//         </svg>
//       </button>

//       {/* 🔥 MOBILE OVERLAY (Dark Blur Background) */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-[#1A2533]/20 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}

//       {/* 🌟 SIDEBAR CONTAINER */}
//       {/* Mobile pe fixed position aur slide effect, Desktop pe static */}
//       <div className={`fixed lg:static top-0 left-0 h-screen w-72 bg-white border-r border-[#EAEAEA] p-8 flex flex-col shadow-[4px_0_24px_rgba(26,37,51,0.02)] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
//         {/* Brand Logo */}
//         <div className="flex items-center gap-3 mb-12 mt-4 lg:mt-0 cursor-pointer" onClick={() => { navigate('/'); handleLinkClick(); }}>
//           <div className="w-10 h-10 bg-[#E5F1F0] rounded-full flex items-center justify-center text-[#00A896] font-black text-xl shadow-inner">
//             KH
//           </div>
//           <div className="text-2xl font-black text-[#1A2533] tracking-tight">
//             Admin<span className="text-[#00A896]">.</span>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 space-y-3">
//           <Link to="/" className={navClass('/')} onClick={handleLinkClick}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
//             <span className="text-sm">Dashboard</span>
//           </Link>
//           <Link to="/questions" className={navClass('/questions')} onClick={handleLinkClick}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
//             <span className="text-sm">Question Bank</span>
//           </Link>
//           <Link to="/candidates" className={navClass('/candidates')} onClick={handleLinkClick}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
//             <span className="text-sm">Analytics</span>
//           </Link>
//         </nav>

//         {/* Logout Button */}
//         <button onClick={handleLogout} className="mt-auto flex items-center justify-center gap-3 w-full px-6 py-3.5 text-[#FF3B30] font-bold hover:bg-[#FFF1F0] rounded-2xl transition-all active:scale-[0.98] border border-transparent hover:border-[#FFD0D0]">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
//           <span className="text-sm">Sign Out</span>
//         </button>
//       </div>
//     </>
//   );
// }

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

  // 🔥 NEW UI: Changed from Teal to the clean White/Purple aesthetic
  const navClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
    location.pathname === path 
      ? 'bg-white text-purple-600 shadow-sm' 
      : 'text-slate-500 hover:text-slate-800'
  }`;

  // Link click karne par mobile par sidebar band kar do
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      {/* 🔥 MOBILE HAMBURGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 text-slate-800 hover:text-purple-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
        </svg>
      </button>

      {/* 🔥 MOBILE OVERLAY (Dark Blur Background) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🌟 SIDEBAR CONTAINER */}
      {/* UI updated: bg-[#F4F5F9] blends seamlessly with the dashboard background */}
      <div className={`fixed lg:static top-0 left-0 h-screen w-72 bg-[#F4F5F9] p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Brand Logo - Updated to new "QuizMaster" logo */}
        <div className="flex items-center gap-3 mb-10 pl-2 mt-4 lg:mt-0 cursor-pointer" onClick={() => { navigate('/'); handleLinkClick(); }}>
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-45">
            <div className="w-3 h-3 bg-white transform -rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold text-slate-800">QuizMaster</h1>
        </div>

        {/* Navigation Links - Updated Icons to match new thin stroke style */}
        <nav className="flex-1 space-y-2">
          <Link to="/" className={navClass('/')} onClick={handleLinkClick}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link to="/questions" className={navClass('/questions')} onClick={handleLinkClick}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span className="text-sm">Question Bank</span>
          </Link>
          <Link to="/candidates" className={navClass('/candidates')} onClick={handleLinkClick}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <span className="text-sm">Analytics</span>
          </Link>
        </nav>

        {/* Premium Banner (Added to match your requested UI) */}
        <div className="bg-purple-100 rounded-3xl p-5 text-center mt-auto mb-4">
           <div className="w-12 h-12 mx-auto bg-white rounded-2xl mb-3 flex items-center justify-center shadow-sm text-xl">👑</div>
           <h4 className="font-bold text-sm text-slate-800 mb-1">Premium Plan</h4>
           <p className="text-[10px] text-slate-500 mb-3 font-medium uppercase tracking-wider">Unlock all features</p>
           <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-purple-600/20 active:scale-95">Upgrade</button>
        </div>

        {/* Logout Button - Updated to match clean UI */}
        <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all active:scale-[0.98]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </>
  );
}