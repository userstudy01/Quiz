import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice'; // 🔥 Logout action import kiya

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Smart Click Handler for Quiz
  const handleQuizClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Logout Handler
 const handleLogout = () => {
  dispatch(logoutUser()); // This clears Redux AND LocalStorage
  navigate('/login');
}

  // Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Safe Display Name (Agar name nahi hai toh email ka pehla part le lega)
  // Safe Display Name (Nested data ke liye check)
  const actualName = user?.name || user?.user?.name;
  const actualEmail = user?.email || user?.user?.email;
  
  const displayName = actualName || (actualEmail ? actualEmail.split('@')[0] : 'User');
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2533] selection:bg-[#00A896]/10 overflow-x-hidden relative">
      
      {/* 🌟 SMART NAVBAR (Sticky with Blur) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-[#EAEAEA] transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="h-10 w-10 bg-[#E5F1F0] rounded-full flex items-center justify-center shadow-inner">
              <span className="text-[#00A896] font-black text-xl">KH</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#1A2533] hidden sm:block">
              Knowledge <span className="text-[#00A896]">Hub</span>
            </h1>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Direct Redirect to About Page */}
            <Link to="/about" className="text-sm font-bold text-[#888888] hover:text-[#00A896] transition-colors">
              About Us
            </Link>
            
            {/* Ye Home page par hi hai, isliye scroll chalega */}
            <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-[#888888] hover:text-[#00A896] transition-colors">
              Features
            </button>
            
            {/* Direct Redirect to Contact Page */}
            <Link to="/contact" className="text-sm font-bold text-[#888888] hover:text-[#00A896] transition-colors">
              Contact
            </Link>
            
            {/* Smart Quiz Button */}
            <button onClick={handleQuizClick} className="text-sm font-black text-[#1A2533] hover:text-[#00A896] flex items-center gap-1 transition-colors">
              Play Quiz <span>→</span>
            </button>
          </div>

          {/* Right Auth Buttons & Profile Avatar */}
          <div className="flex items-center gap-4">
            {user ? (
              /* 🔥 NEW: Hover Dropdown Profile Menu */
              <div className="relative group">
                
                {/* Visible Profile Pill (Username humesha dikhega) */}
                <div className="flex items-center gap-2.5 p-1.5 pr-4 bg-white border border-[#EAEAEA] rounded-full shadow-sm cursor-pointer transition-all hover:border-[#00A896]">
                  <div className="h-8 w-8 bg-[#00A896] text-white font-black text-sm rounded-full flex items-center justify-center shadow-inner">
                    {userInitial}
                  </div>
                  <span className="text-sm font-bold text-[#1A2533] max-w-[100px] truncate">
                    {displayName}
                  </span>
                  {/* Dropdown Arrow Icon */}
                  <svg className="w-3 h-3 text-[#888888] group-hover:text-[#00A896] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                {/* 🔽 Dropdown Menu (Hover par dikhega) */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EAEAEA] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                  <div className="p-2">
                    {/* <Link to="/dashboard" className="block w-full text-left px-4 py-2.5 text-sm font-bold text-[#1A2533] hover:bg-[#E5F1F0] hover:text-[#00A896] rounded-xl transition-colors">
                      Dashboard
                    </Link> */}
                    <div className="h-[1px] bg-[#EAEAEA] my-1 mx-2"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-[#FF3B30] hover:bg-[#FFF1F0] rounded-xl transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* If User is NOT logged in */
              <>
                <Link to="/login" className="hidden sm:block text-sm font-bold text-[#888888] hover:text-[#1A2533] transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-bold text-white bg-[#1A2533] hover:bg-[#2A3543] px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#00A896]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#30D158]/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

        {/* Left Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EAEAEA] mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#30D158] animate-pulse"></span>
            <span className="text-xs font-bold text-[#888888] uppercase tracking-widest">Public Beta Live</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight text-[#1A2533]">
            Master Your <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] to-[#30D158]">
              Tech Skills
            </span>
          </h2>
          
          <p className="text-lg text-[#666666] mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            The ultimate interactive sandbox for evaluating your theoretical knowledge and practical coding skills. Practice, get instant feedback, and track your progress in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button onClick={handleQuizClick} className="w-full sm:w-auto text-center text-base font-black text-white bg-[#00A896] hover:bg-[#009686] px-8 py-4 rounded-2xl shadow-lg shadow-[#00A896]/20 transition-all active:scale-95">
              Start Quiz Now
            </button>
            <button onClick={() => scrollToSection('about')} className="w-full sm:w-auto text-center text-base font-bold text-[#1A2533] bg-white border-2 border-[#EAEAEA] hover:border-[#00A896] px-8 py-4 rounded-2xl shadow-sm transition-all active:scale-95">
              Learn More ↓
            </button>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="relative w-full max-w-md mx-auto aspect-square">
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl shadow-[#1A2533]/10 border border-[#EAEAEA] transform rotate-3 hover:rotate-0 transition-transform duration-500 p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5F1F0] rounded-bl-full -mr-10 -mt-10"></div>
              <div>
                <div className="w-16 h-16 bg-[#00A896]/10 rounded-2xl mb-6 flex items-center justify-center text-[#00A896]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-[#1A2533] mb-2">JavaScript Mastery</h3>
                <p className="text-sm text-[#888888] font-medium">Complete the theory and practical challenges to earn XP.</p>
              </div>
              <div className="space-y-3 mt-8">
                <div className="h-3 w-full bg-[#F9F9F9] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[#00A896] rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#888888]">
                  <span>Progress</span>
                  <span className="text-[#00A896]">75%</span>
                </div>
              </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -left-8 top-12 bg-white p-4 rounded-2xl shadow-xl shadow-[#1A2533]/5 border border-[#EAEAEA] animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="text-[10px] font-bold text-[#30D158] uppercase tracking-wider mb-1">Passed</div>
              <div className="text-xl font-black text-[#1A2533]">15</div>
            </div>
            <div className="absolute -right-6 bottom-20 bg-[#1A2533] p-4 rounded-2xl shadow-xl shadow-[#00A896]/20 border border-[#2A3543] animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="text-[10px] font-bold text-[#00A896] uppercase tracking-wider mb-1">Total XP</div>
              <div className="text-xl font-black text-white">450</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT US SECTION ================= */}
      <section id="about" className="py-24 bg-[#E5F1F0]/50 relative overflow-hidden border-y border-[#EAEAEA]">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#B18585]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#00A896]/10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/3] bg-white rounded-[2rem] shadow-xl border border-[#EAEAEA] p-8 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00A896] rounded-full opacity-10"></div>
               <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#1A2533] rounded-full opacity-5"></div>
               <h3 className="text-3xl font-black text-[#1A2533] mb-4">Our Vision</h3>
               <p className="text-[#666666] leading-relaxed font-medium">
                 We built Knowledge Hub because traditional learning lacks real-time validation. Our mission is to bridge the gap between reading concepts and actually applying them. By combining AI-driven evaluation with an elegant user interface, we provide a modern sandbox for developers to test their true potential.
               </p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h4 className="text-[#00A896] font-bold tracking-widest uppercase text-sm mb-2">About Us</h4>
            <h2 className="text-4xl font-black text-[#1A2533] mb-6">Elevating the way you learn and test.</h2>
            <p className="text-lg text-[#666666] font-medium mb-8">
              Whether you are preparing for an interview or just brushing up your skills, our platform provides a stress-free, beautiful environment to focus entirely on your growth.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-bold text-[#1A2533]">
                <span className="w-6 h-6 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center text-sm">✓</span> Focus on Practical Skills
              </li>
              <li className="flex items-center gap-3 font-bold text-[#1A2533]">
                <span className="w-6 h-6 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center text-sm">✓</span> Real-time AI Evaluation
              </li>
              <li className="flex items-center gap-3 font-bold text-[#1A2533]">
                <span className="w-6 h-6 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center text-sm">✓</span> Modern & Distraction-free UI
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#1A2533]">Why Choose Knowledge Hub?</h2>
            <p className="mt-4 text-[#888888] font-medium">Designed for modern developers to validate their learning.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#E5F1F0] p-8 rounded-3xl border border-[#D9E9E8] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-white rounded-xl mb-6 shadow-sm flex items-center justify-center text-[#00A896] font-black text-xl">⚡</div>
              <h3 className="text-xl font-bold text-[#1A2533] mb-3">Instant Feedback</h3>
              <p className="text-sm text-[#666666] font-medium leading-relaxed">Our smart evaluation engine checks your theoretical answers and provides immediate results and suggestions.</p>
            </div>
            <div className="bg-[#E5FAF0] p-8 rounded-3xl border border-[#D0F0E0] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-white rounded-xl mb-6 shadow-sm flex items-center justify-center text-[#30D158] font-black text-xl">📊</div>
              <h3 className="text-xl font-bold text-[#1A2533] mb-3">Track Progress</h3>
              <p className="text-sm text-[#666666] font-medium leading-relaxed">View detailed session history. See what you passed, what needs improvement, and watch your total XP grow.</p>
            </div>
            <div className="bg-[#EBF5FF] p-8 rounded-3xl border border-[#D0E5FF] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-white rounded-xl mb-6 shadow-sm flex items-center justify-center text-[#0A84FF] font-black text-xl">🎯</div>
              <h3 className="text-xl font-bold text-[#1A2533] mb-3">Theory & Practical</h3>
              <p className="text-sm text-[#666666] font-medium leading-relaxed">Don't just write code. Explain concepts. Our modules are split into Theory and Practical rounds for complete mastery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-24 bg-[#FDFDFD] border-t border-[#EAEAEA]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E5F1F0] text-[#00A896] mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-4xl font-black text-[#1A2533] mb-4">Get in touch</h2>
          <p className="text-lg text-[#666666] font-medium mb-10">Have questions about our modules or want to report an issue? We'd love to hear from you.</p>
          
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#EAEAEA] max-w-2xl mx-auto text-left">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-1.5 ml-1">Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 outline-none transition-all" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-1.5 ml-1">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 outline-none transition-all" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-1.5 ml-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 outline-none transition-all resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button className="w-full py-3.5 bg-[#1A2533] hover:bg-[#2A3543] text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1A2533] text-white py-12 border-t border-[#2A3543]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-[#00A896] rounded-full flex items-center justify-center">
                <span className="text-white font-black text-sm">KH</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white">
                Knowledge <span className="text-[#00A896]">Hub</span>
              </h1>
            </div>
            <p className="text-[#888888] text-sm font-medium max-w-sm">
              Empowering developers with real-time interactive evaluations. Test your theory, prove your practical skills.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-2 text-[#888888] text-sm font-medium">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-[#00A896] transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-[#00A896] transition-colors">About Us</button></li>
              <li><Link to="/login" className="hover:text-[#00A896] transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-2 text-[#888888] text-sm font-medium">
              <li><a href="#" className="hover:text-[#00A896] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#00A896] transition-colors">Terms of Service</a></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-[#00A896] transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-[#2A3543] text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-[#666666] font-bold">
          <p>© {new Date().getFullYear()} Knowledge Hub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with ❤️ for Developers</p>
        </div>
      </footer>

    </div>
  );
}