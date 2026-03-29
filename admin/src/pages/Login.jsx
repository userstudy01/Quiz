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
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="max-w-md w-full p-8 bg-[#18181b] border border-zinc-800 rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-zinc-100 text-[#09090b] font-black rounded-md mb-4">ADMIN</div>
          <h2 className="text-2xl font-bold text-zinc-100">System Access</h2>
        </div>
        {error && <div className="mb-4 p-3 bg-red-950/50 border border-red-900 text-red-400 text-sm rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Admin Email" required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 bg-[#09090b] border border-zinc-800 rounded text-zinc-100 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password" placeholder="Password" required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-2 bg-[#09090b] border border-zinc-800 rounded text-zinc-100 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="w-full py-2 bg-zinc-100 text-[#09090b] font-bold rounded hover:bg-zinc-300 transition">
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}