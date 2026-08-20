import { useState } from 'react';
import API, { apiError, getStoredAuth } from '../utils/api';
import { Button, Field, PageHeader, PasswordInput, Toast } from '../components/ui';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function Account() {
  const auth = getStoredAuth();
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!form.currentPassword) errors.currentPassword = 'Enter your current password.';
    if (form.newPassword.length < 8) errors.newPassword = 'New password must be at least 8 characters.';
    if (form.newPassword && form.newPassword === form.currentPassword)
      errors.newPassword = 'New password must differ from the current one.';
    if (form.confirmPassword !== form.newPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const submit = async (event) => {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      await API.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(EMPTY);
      setToast({ type: 'success', message: 'Password updated.' });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Could not update password.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Account" description="Your admin sign-in details." />

      <section className="mb-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Signed in as</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Name</dt>
            <dd className="font-medium">{auth?.user?.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Email</dt>
            <dd className="font-medium break-all">{auth?.user?.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Role</dt>
            <dd className="font-medium capitalize">{auth?.user?.role || '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-line bg-surface p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Change password</h2>
        <form onSubmit={submit} noValidate className="max-w-sm space-y-4">
          <Field label="Current password" error={fieldErrors.currentPassword}>
            <PasswordInput
              label="current password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={set('currentPassword')}
              aria-invalid={Boolean(fieldErrors.currentPassword)}
            />
          </Field>
          <Field label="New password" hint="At least 8 characters." error={fieldErrors.newPassword}>
            <PasswordInput
              label="new password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={set('newPassword')}
              aria-invalid={Boolean(fieldErrors.newPassword)}
            />
          </Field>
          <Field label="Confirm new password" error={fieldErrors.confirmPassword}>
            <PasswordInput
              label="confirm new password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
          </Field>
          <Button type="submit" disabled={saving}>
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </section>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
