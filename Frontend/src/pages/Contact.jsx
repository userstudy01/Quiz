import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

export default function Contact() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you shortly.");
  };

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
            <Link to="/about" className="text-sm font-bold text-[#888888] hover:text-[#00A896] transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm font-bold text-[#00A896] transition-colors">Contact</Link>
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

      {/* ================= CONTACT CONTENT ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00A896]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1A2533] mb-4 tracking-tight">
            Let's <span className="text-[#00A896]">Connect</span>
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto font-medium">
            Have a question about our modules, facing a technical issue, or just want to say hi? Fill out the form below and our team will get back to you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          {/* Info Cards */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-[#E5F1F0] p-8 rounded-3xl border border-[#D9E9E8]">
              <div className="w-12 h-12 bg-white rounded-full mb-4 flex items-center justify-center text-[#00A896]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-[#1A2533] mb-1">Email Us</h3>
              <p className="text-[#666666] text-sm font-medium mb-3">We usually reply within 24 hours.</p>
              <a href="mailto:support@knowledgehub.com" className="text-[#00A896] font-bold text-sm hover:underline">support@knowledgehub.com</a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#EAEAEA] shadow-sm">
              <div className="w-12 h-12 bg-[#F9F9F9] rounded-full mb-4 flex items-center justify-center text-[#1A2533]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-[#1A2533] mb-1">Our Location</h3>
              <p className="text-[#666666] text-sm font-medium">123 Tech Avenue, Silicon Valley<br/>San Francisco, CA 94107</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3 bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl border border-[#EAEAEA]">
            <h3 className="text-2xl font-black text-[#1A2533] mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-2 ml-1">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-2 ml-1">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-2 ml-1">Subject</label>
                <input type="text" required className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white outline-none transition-all" placeholder="How can we help you?" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-2 ml-1">Your Message</label>
                <textarea required rows="5" className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white outline-none transition-all resize-none" placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-[#00A896] hover:bg-[#009686] text-white font-black text-lg rounded-xl shadow-md shadow-[#00A896]/20 transition-all active:scale-[0.98]">
                Send Message
              </button>
            </form>
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
            <Link to="/about" className="hover:text-[#00A896] transition-colors">About Us</Link>
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