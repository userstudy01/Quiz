import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import authService from '../features/auth/authService';

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
      
      // Successfully logged in, chalo Dashboard par
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        
        <div className="text-center">
          <div className="mx-auto h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-[#09090b] font-black text-xl">JS</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Welcome back</h2>
          <p className="mt-2 text-sm text-zinc-400">Enter your credentials to access your sandbox</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email address</label>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-800 rounded-md text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-colors"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-zinc-300">Password</label>
                <a href="#" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">Forgot password?</a>
              </div>
              <input
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-800 rounded-md text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#09090b] bg-zinc-100 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 transition-colors mt-6"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-zinc-100 hover:text-white hover:underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}