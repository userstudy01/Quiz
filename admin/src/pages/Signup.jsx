import { useState } from 'react';
import { Link } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Button, Field, inputClass } from '../components/ui';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // { isFirstUser }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      setDone({ isFirstUser: Boolean(data.isFirstUser) });
    } catch (err) {
      setError(apiError(err, 'Could not create the account.'));
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
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-ink-muted">Request access to the portfolio admin.</p>
        </div>

        {done ? (
          <div className="space-y-4">
            <p
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700"
            >
              {done.isFirstUser
                ? 'Account created — you are the super admin. You can sign in now.'
                : 'Request sent. A super admin must approve your account before you can sign in.'}
            </p>
            <Link to="/login">
              <Button className="w-full">Go to sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            {error ? (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Name">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </Field>

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

              <Field label="Password" hint="At least 8 characters.">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating…' : 'Create account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-ink hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
