import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

export default function About() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const handleLogout = () => {
  dispatch(logoutUser()); // This clears Redux AND LocalStorage
  navigate('/login');
}

  const actualName = user?.name || user?.user?.name;
  const actualEmail = user?.email || user?.user?.email;
  const displayName = actualName || (actualEmail ? actualEmail.split('@')[0] : 'User');
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] selection:bg-[#00A896]/10 overflow-x-hidden">
      
      {/* 🌟 NAVBAR (Same as Home) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="h-10 w-10 bg-[#E5F1F0] rounded-full flex items-center justify-center shadow-inner">
              <span className="text-[#00A896] font-black text-xl">KH</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#1A2533] hidden sm:block">
              Knowledge <span className="text-[#00A896]">Hub</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm font-bold text-[#00A896] transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm font-bold text-[#888888] hover:text-[#00A896] transition-colors">Contact</Link>
            <Link to={user ? "/dashboard" : "/login"} className="text-sm font-black text-[#1A2533] hover:text-[#00A896] flex items-center gap-1 transition-colors">
              Play Quiz <span>→</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-2.5 p-1.5 pr-4 bg-white border border-[#EAEAEA] rounded-full shadow-sm cursor-pointer hover:border-[#00A896]">
                  <div className="h-8 w-8 bg-[#00A896] text-white font-black text-sm rounded-full flex items-center justify-center shadow-inner">
                    {userInitial}
                  </div>
                  <span className="text-sm font-bold text-[#1A2533] max-w-[100px] truncate">{displayName}</span>
                  <svg className="w-3 h-3 text-[#888888] group-hover:text-[#00A896]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EAEAEA] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <Link to="/dashboard" className="block w-full text-left px-4 py-2.5 text-sm font-bold text-[#1A2533] hover:bg-[#E5F1F0] hover:text-[#00A896] rounded-xl">Dashboard</Link>
                    <div className="h-[1px] bg-[#EAEAEA] my-1 mx-2"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-[#FF3B30] hover:bg-[#FFF1F0] rounded-xl">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-bold text-[#888888] hover:text-[#1A2533]">Sign In</Link>
                <Link to="/register" className="text-sm font-bold text-white bg-[#1A2533] hover:bg-[#2A3543] px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-48 lg:pb-32 text-center">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#00A896]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#30D158]/10 rounded-full blur-3xl -z-10"></div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-[#1A2533] mb-6 tracking-tight">
          Bridging the gap between <br className="hidden lg:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] to-[#30D158]">Theory and Mastery.</span>
        </h1>
        <p className="text-xl text-[#666666] max-w-3xl mx-auto font-medium leading-relaxed">
          Knowledge Hub is more than just a quiz platform. It's a modern, AI-powered sandbox designed to help developers validate their skills, build confidence, and prepare for real-world technical challenges.
        </p>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-20 bg-[#E5F1F0]/50 border-y border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-black text-[#1A2533] mb-6">Our Story</h2>
            <p className="text-[#666666] text-lg font-medium leading-relaxed mb-6">
              We noticed a massive problem in tech education: developers were reading countless tutorials but struggling to pass technical interviews. Passive learning wasn't enough.
            </p>
            <p className="text-[#666666] text-lg font-medium leading-relaxed">
              That's why we built Knowledge Hub. We wanted to create a beautiful, distraction-free environment where you are forced to recall concepts, write practical solutions, and get instant feedback just like you would from a senior engineer.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-white rounded-[3rem] shadow-xl border border-[#EAEAEA] p-10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00A896] rounded-full opacity-10"></div>
              <h3 className="text-3xl font-black text-[#1A2533] mb-4 text-center">The Developer's Sandbox</h3>
              <div className="space-y-4 mt-6">
                <div className="h-4 w-full bg-[#E5F1F0] rounded-full"></div>
                <div className="h-4 w-5/6 bg-[#E5F1F0] rounded-full"></div>
                <div className="h-4 w-4/6 bg-[#E5F1F0] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR VALUES ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center text-[#1A2533] mb-16">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-[#EAEAEA] rounded-3xl hover:border-[#00A896] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#E5FAF0] text-[#30D158] rounded-2xl flex items-center justify-center text-2xl mb-6 font-black">1</div>
              <h3 className="text-xl font-bold text-[#1A2533] mb-3">Active Recall</h3>
              <p className="text-[#666666] font-medium leading-relaxed">We believe in testing your memory and understanding, not just giving you multiple-choice questions to guess from.</p>
            </div>
            <div className="p-8 border border-[#EAEAEA] rounded-3xl hover:border-[#00A896] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#EBF5FF] text-[#0A84FF] rounded-2xl flex items-center justify-center text-2xl mb-6 font-black">2</div>
              <h3 className="text-xl font-bold text-[#1A2533] mb-3">Instant Validation</h3>
              <p className="text-[#666666] font-medium leading-relaxed">Waiting for results slows down learning. Our smart evaluation engine gives you immediate feedback on your answers.</p>
            </div>
            <div className="p-8 border border-[#EAEAEA] rounded-3xl hover:border-[#00A896] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#FFF1F0] text-[#FF3B30] rounded-2xl flex items-center justify-center text-2xl mb-6 font-black">3</div>
              <h3 className="text-xl font-bold text-[#1A2533] mb-3">Beautiful Design</h3>
              <p className="text-[#666666] font-medium leading-relaxed">Learning shouldn't be boring. We crafted a premium, clutter-free UI to make your study sessions enjoyable and focused.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1A2533] text-white py-12 border-t border-[#2A3543]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white mb-4">
            Knowledge <span className="text-[#00A896]">Hub</span>
          </h1>
          <p className="text-[#888888] text-sm font-medium mb-8 max-w-md mx-auto">
            Empowering developers with real-time interactive evaluations.
          </p>
          <div className="flex justify-center gap-6 text-sm font-bold text-[#888888]">
            <Link to="/" className="hover:text-[#00A896] transition-colors">Home</Link>
            <Link to="/contact" className="hover:text-[#00A896] transition-colors">Contact</Link>
            <Link to={user ? "/dashboard" : "/login"} className="hover:text-[#00A896] transition-colors">Play Quiz</Link>
          </div>
          <div className="mt-8 border-t border-[#2A3543] pt-8 text-xs text-[#666666] font-bold">
            <p>© {new Date().getFullYear()} Knowledge Hub. Designed with ❤️ for Developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}