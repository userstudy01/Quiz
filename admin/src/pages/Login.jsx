import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      if (data.user.role !== 'admin') {
        return setError('Access Denied. Admin privileges required.');
      }
      localStorage.setItem('adminUser', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E5F1F0] px-4 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#1A2533]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#00A896]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-[#1A2533]/10 relative z-10 border border-[#EAEAEA]/50">
        
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-[#1A2533] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#1A2533]/20">
            {/* Secure Shield Icon */}
            <svg className="w-6 h-6 text-[#00A896]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F1F0] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A896] animate-pulse"></span>
            <span className="text-[10px] font-black text-[#00A896] uppercase tracking-widest">Admin Portal</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#1A2533]">
            System <span className="text-[#00A896]">Access</span>
          </h2>
          <p className="mt-2 text-sm text-[#888888] font-medium">Authenticate to manage Knowledge Hub</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm font-bold text-[#FF3B30] bg-[#FFF1F0] border border-[#FFD0D0] rounded-xl flex items-center gap-3 shadow-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-1.5 ml-1">Admin Email</label>
              <input
                type="email" required placeholder="admin@knowledgehub.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base text-[#1A2533] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1A2533]/30 focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-1.5 ml-1">Security Key (Password)</label>
              <input
                type="password" required placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base text-[#1A2533] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#1A2533]/30 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-[#1A2533]/20 text-sm font-black tracking-wide text-white bg-[#1A2533] hover:bg-[#2A3543] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2533] transition-all active:scale-[0.98] mt-8"
          >
            Authenticate Session
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>

      </div>
    </div>
  );
}