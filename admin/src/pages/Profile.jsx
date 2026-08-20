import { useEffect, useState } from 'react';
import API, { apiError } from '../utils/api';
import { Button, Field, Loader, PageHeader, Toast, inputClass } from '../components/ui';
import ImageInput from '../components/ImageInput';

const EMPTY = {
  name: '',
  title: '',
  tagline: '',
  bio: '',
  profileImage: '',
  email: '',
  phone: '',
  location: '',
  resumeUrl: '',
  strengths: '',
};

export default function Profile() {
  const [form, setForm] = useState(EMPTY);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;

    API.get('/profile')
      .then(({ data }) => {
        if (!active) return;
        setForm({ ...EMPTY, ...data, strengths: (data.strengths || []).join('\n') });
        setSocialLinks(data.socialLinks || []);
      })
      .catch((err) => setToast({ type: 'error', message: apiError(err, 'Could not load profile.') }))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const updateLink = (index, key, value) =>
    setSocialLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [key]: value } : l)));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await API.put('/profile', {
        ...form,
        socialLinks: socialLinks.filter((l) => l.label?.trim() && l.url?.trim()),
      });
      setToast({ type: 'success', message: 'Profile saved.' });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Save failed.') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile…" />;

  return (
    <>
      <PageHeader title="Profile" description="Shown across the public site: hero, about, footer and contact." />

      <form onSubmit={submit} className="space-y-6 pb-10">
        <section className="rounded-card border border-line bg-surface shadow-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <input value={form.name} onChange={set('name')} className={inputClass} />
            </Field>
            <Field label="Professional title">
              <input value={form.title} onChange={set('title')} className={inputClass} />
            </Field>
            <Field label="Tagline" className="sm:col-span-2">
              <input value={form.tagline} onChange={set('tagline')} className={inputClass} />
            </Field>
            <Field label="Bio" className="sm:col-span-2">
              <textarea rows={7} value={form.bio} onChange={set('bio')} className={inputClass} />
            </Field>
            <Field label="Profile image" hint="Drag & drop or browse — the image is stored with your profile">
              <ImageInput
                value={form.profileImage}
                onChange={(v) => setForm((prev) => ({ ...prev, profileImage: v }))}
                round
                maxW={640}
                maxH={640}
              />
            </Field>
            <Field label="Resume URL">
              <input value={form.resumeUrl} onChange={set('resumeUrl')} className={inputClass} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={set('phone')} className={inputClass} />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={set('location')} className={inputClass} />
            </Field>
            <Field label="Engineering strengths" hint="One per line" className="sm:col-span-2">
              <textarea rows={5} value={form.strengths} onChange={set('strengths')} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="rounded-card border border-line bg-surface shadow-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Social links</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSocialLinks((prev) => [...prev, { label: '', url: '' }])}
            >
              Add link
            </Button>
          </div>

          {socialLinks.length ? (
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                  <Field label="Label">
                    <input
                      value={link.label}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="URL">
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setSocialLinks((prev) => prev.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No social links yet.</p>
          )}
        </section>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </Button>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
