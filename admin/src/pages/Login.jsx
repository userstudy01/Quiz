import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { apiError, ADMIN_ROLES } from '../utils/api';
import { Button, Field, PasswordInput, Toast, inputClass } from '../components/ui';
import { setFlash } from '../utils/flash';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  // ADM-003: only surface the first-run sign-up link while registration is open.
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    API.get('/auth/registration-open')
      .then(({ data }) => active && setRegistrationOpen(Boolean(data.open)))
      .catch(() => active && setRegistrationOpen(false));
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', form);

      if (!ADMIN_ROLES.includes(data.user?.role)) {
        setToast({ type: 'error', message: 'Access denied. Admin privileges required.' });
        return;
      }

      localStorage.setItem('adminUser', JSON.stringify(data));
      // Flash shows on the dashboard after the redirect.
      setFlash('success', 'Login successful');
      navigate('/', { replace: true });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Invalid credentials') });
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
            <PasswordInput
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {registrationOpen ? (
          <p className="mt-6 text-center text-sm text-ink-muted">
            First time here?{' '}
            <Link to="/signup" className="font-medium text-ink hover:underline">
              Create the admin account
            </Link>
          </p>
        ) : null}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
