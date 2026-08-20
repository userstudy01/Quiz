import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Button, Field, PasswordInput, inputClass } from '../components/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null); // { isFirstUser }
  // ADM-003: registration is only available on first run (no account yet).
  // null = still checking, true = open, false = closed.
  const [registrationOpen, setRegistrationOpen] = useState(null);

  useEffect(() => {
    let active = true;
    API.get('/auth/registration-open')
      .then(({ data }) => {
        if (active) setRegistrationOpen(Boolean(data.open));
      })
      .catch(() => {
        // If the check fails, fall back to showing the form; the backend still
        // rejects a second registration, so security does not depend on this.
        if (active) setRegistrationOpen(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address.';
    if (!form.password) errors.password = 'Password is required.';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      // confirmPassword is a client-side check only; never sent to the server.
      const { data } = await API.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setDone({ isFirstUser: Boolean(data.isFirstUser) });
    } catch (err) {
      setError(apiError(err, 'Could not create the account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="animate-rise w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-pop">
        <div className="mb-7">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-sm font-bold text-white shadow-card">
            PA
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">
            {registrationOpen === false ? 'Registration disabled' : 'Create admin account'}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {registrationOpen === false
              ? 'Sign in to manage your portfolio content.'
              : 'The first account created becomes the super admin.'}
          </p>
        </div>

        {registrationOpen === null ? (
          <div className="flex items-center gap-3 py-6 text-sm text-ink-muted" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-ink" />
            Checking…
          </div>
        ) : registrationOpen === false ? (
          <div className="space-y-4">
            <p
              role="status"
              className="rounded-lg border border-line bg-canvas px-3.5 py-3 text-sm text-ink-muted"
            >
              Admin registration is disabled. An administrator account already exists.
            </p>
            <Link to="/login">
              <Button className="w-full">Go to sign in</Button>
            </Link>
          </div>
        ) : done ? (
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

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field label="Name" error={fieldErrors.name}>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={set('name')}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={inputClass}
                />
              </Field>

              <Field label="Email" error={fieldErrors.email}>
                <input
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={set('email')}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={inputClass}
                />
              </Field>

              <Field label="Password" hint="At least 8 characters." error={fieldErrors.password}>
                <PasswordInput
                  label="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set('password')}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
              </Field>

              <Field label="Confirm password" error={fieldErrors.confirmPassword}>
                <PasswordInput
                  label="confirm password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
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
