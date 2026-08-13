import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Button, Field, inputClass } from '../components/ui';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', form);

      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      localStorage.setItem('adminUser', JSON.stringify(data));
      navigate('/', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <div className="mb-7">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-xs font-semibold text-white">
            PA
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Portfolio Admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to manage your portfolio content.</p>
        </div>

        {error ? (
          <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
