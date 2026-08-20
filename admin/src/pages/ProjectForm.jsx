import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API, { apiError } from '../utils/api';
import { Button, Field, Loader, PageHeader, Toast, inputClass } from '../components/ui';
import { ListInput, TagInput } from '../components/fields';
import { isValidUrl, slugify } from '../utils/format';

// Longer list fields get repeatable rows; technologies get a chip input.
const LIST_FIELDS = [
  ['responsibilities', 'Responsibilities'],
  ['features', 'Features'],
  ['technicalWork', 'Technical Work'],
  ['improvements', 'Improvements / Remaining work'],
  ['challenges', 'Challenges'],
  ['solutions', 'Solutions'],
];

const ARRAY_KEYS = ['technologies', ...LIST_FIELDS.map(([k]) => k)];

const EMPTY = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: '',
  role: '',
  result: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  status: 'published',
  sortOrder: 0,
  technologies: [],
  responsibilities: [],
  features: [],
  technicalWork: [],
  improvements: [],
  challenges: [],
  solutions: [],
};

const toForm = (project) => ({
  ...EMPTY,
  ...project,
  sortOrder: project.sortOrder ?? 0,
  ...Object.fromEntries(ARRAY_KEYS.map((key) => [key, Array.isArray(project[key]) ? project[key] : []])),
});

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [screenshots, setScreenshots] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;
    setLoading(true);
    API.get(`/projects/admin/${id}`)
      .then(({ data }) => {
        if (!active) return;
        setForm(toForm(data));
        setScreenshots(data.screenshots || []);
      })
      .catch((err) => active && setLoadError(apiError(err, 'Could not load project.')))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const setArray = (key) => (next) => setForm((prev) => ({ ...prev, [key]: next }));
  const updateShot = (index, key, value) =>
    setScreenshots((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));

  const previewSlug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (form.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugify(form.slug)))
      next.slug = 'Use lowercase letters, numbers and hyphens.';
    if (form.liveUrl.trim() && !isValidUrl(form.liveUrl)) next.liveUrl = 'Enter a valid URL (http/https).';
    if (form.githubUrl.trim() && !isValidUrl(form.githubUrl)) next.githubUrl = 'Enter a valid URL (http/https).';
    screenshots.forEach((s, i) => {
      if (s.url?.trim() && !isValidUrl(s.url)) next[`shot-${i}`] = 'Invalid image URL.';
    });
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      setToast({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      screenshots: screenshots
        .filter((s) => s.url?.trim())
        .map((s) => ({ url: s.url.trim(), caption: s.caption || '' })),
    };

    try {
      if (isEdit) {
        const { data } = await API.put(`/projects/${id}`, payload);
        setForm(toForm(data));
        setScreenshots(data.screenshots || []);
        setToast({ type: 'success', message: 'Project saved.' });
      } else {
        const { data } = await API.post('/projects', payload);
        setToast({ type: 'success', message: 'Project created.' });
        navigate(`/projects/${data._id}`, { replace: true });
      }
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Save failed.') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading project…" />;

  if (loadError) {
    return (
      <>
        <PageHeader title="Edit project" />
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {loadError}
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/projects')}>
          Back to list
        </Button>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit project' : 'New project'}
        description="Only fields with real data need values — empty sections are hidden on the public site."
        action={
          <Button variant="secondary" onClick={() => navigate('/projects')}>
            Back to list
          </Button>
        }
      />

      <form onSubmit={submit} className="space-y-6 pb-10" noValidate>
        {/* Basics */}
        <section className="rounded-card border border-line bg-surface shadow-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Basics</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" error={errors.title}>
              <input value={form.title} onChange={set('title')} className={inputClass} aria-invalid={Boolean(errors.title)} />
            </Field>
            <Field
              label="Slug"
              hint={previewSlug ? `URL: /projects/${previewSlug}` : 'Generated from the title'}
              error={errors.slug}
            >
              <input value={form.slug} onChange={set('slug')} placeholder={slugify(form.title)} className={inputClass} />
            </Field>
            <Field label="Category">
              <input value={form.category} onChange={set('category')} className={inputClass} />
            </Field>
            <Field label="My role">
              <input value={form.role} onChange={set('role')} className={inputClass} />
            </Field>
            <Field label="Short description" className="sm:col-span-2">
              <textarea rows={2} value={form.shortDescription} onChange={set('shortDescription')} className={inputClass} />
            </Field>
            <Field label="Overview" className="sm:col-span-2">
              <textarea rows={6} value={form.description} onChange={set('description')} className={inputClass} />
            </Field>
          </div>
        </section>

        {/* Technologies + detail lists */}
        <section className="rounded-card border border-line bg-surface shadow-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Details</h2>
          <div className="grid gap-5">
            <Field label="Technologies" hint="Type a technology and press Enter or comma.">
              <TagInput
                value={form.technologies}
                onChange={setArray('technologies')}
                ariaLabel="Technologies"
                placeholder="e.g. PHP, Laravel, React"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              {LIST_FIELDS.map(([key, label]) => (
                <Field key={key} label={label}>
                  <ListInput
                    value={form[key]}
                    onChange={setArray(key)}
                    addLabel={label.toLowerCase()}
                    placeholder={`Add ${label.toLowerCase()}`}
                  />
                </Field>
              ))}
            </div>

            <Field label="Results">
              <textarea rows={3} value={form.result} onChange={set('result')} className={inputClass} />
            </Field>
          </div>
        </section>

        {/* Screenshots */}
        <section className="rounded-card border border-line bg-surface shadow-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Screenshots</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setScreenshots((prev) => [...prev, { url: '', caption: '' }])}
            >
              Add screenshot
            </Button>
          </div>

          {screenshots.length ? (
            <div className="space-y-4">
              {screenshots.map((shot, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="grid h-20 w-28 place-items-center overflow-hidden rounded-lg border border-line bg-canvas">
                    {shot.url && isValidUrl(shot.url) ? (
                      <img src={shot.url} alt={shot.caption || 'Screenshot'} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-ink-muted">Preview</span>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
                    <Field label={`Image URL ${index + 1}`} error={errors[`shot-${index}`]}>
                      <input
                        value={shot.url}
                        onChange={(e) => updateShot(index, 'url', e.target.value)}
                        placeholder="https://…"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Caption">
                      <input value={shot.caption || ''} onChange={(e) => updateShot(index, 'caption', e.target.value)} className={inputClass} />
                    </Field>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setScreenshots((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No screenshots yet.</p>
          )}
        </section>

        {/* Links & publishing */}
        <section className="rounded-card border border-line bg-surface shadow-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">Links &amp; publishing</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Live URL" error={errors.liveUrl}>
              <input value={form.liveUrl} onChange={set('liveUrl')} placeholder="https://…" className={inputClass} />
            </Field>
            <Field label="GitHub URL" error={errors.githubUrl}>
              <input value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://…" className={inputClass} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={set('status')} className={inputClass}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <Field label="Sort order">
              <input type="number" value={form.sortOrder} onChange={set('sortOrder')} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4" />
              Featured project
            </label>
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
        </div>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
