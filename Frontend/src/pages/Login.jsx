import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import authService from '../features/auth/authService';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux state update karne ke liye

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Backend se token aur user data laao
      const data = await authService.login(formData);
      
      // Redux aur LocalStorage main save karo
      dispatch(loginSuccess(data));

      if (data && data.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      
      // Successfully logged in, chalo Dashboard par
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E5F1F0] px-4 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00A896]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#30D158]/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-[#1A2533]/5 relative z-10 border border-[#EAEAEA]/50">
        
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-[#E5F1F0] rounded-full flex items-center justify-center mb-4 shadow-inner">
            <span className="text-[#00A896] font-black text-2xl">KH</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#1A2533]">
            Welcome <span className="text-[#00A896]">back</span>
          </h2>
          <p className="mt-2 text-sm text-[#888888] font-medium">Enter your credentials to access your sandbox</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 text-sm font-bold text-[#FF3B30] bg-[#FFF1F0] border border-[#FFD0D0] rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base text-[#1A2533] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-xs font-bold text-[#1A2533] uppercase tracking-wider">Password</label>
                {/* Forgot Password link updated to match theme */}
                <a href="#" className="text-xs font-bold text-[#00A896] hover:text-[#009686] transition-colors">Forgot password?</a>
              </div>
              <input
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-[#EAEAEA] rounded-xl text-base text-[#1A2533] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#00A896]/50 focus:bg-white transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-black tracking-wide text-white bg-[#00A896] hover:bg-[#009686] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A896] disabled:opacity-50 transition-all active:scale-[0.98] mt-8"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#888888] mt-8 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#00A896] hover:text-[#009686] hover:underline underline-offset-4 transition-colors">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}