import { useCallback, useEffect, useState } from 'react';
import API, { apiError } from '../utils/api';
import {
  Button,
  ConfirmDialog,
  EmptyRow,
  Field,
  Loader,
  Modal,
  PageHeader,
  Toast,
  Toggle,
  inputClass,
} from '../components/ui';
import { formatDateForInput, isIsoDate } from '../utils/format';

const EMPTY = {
  company: '',
  role: '',
  location: '',
  employmentType: '',
  startDate: '',
  endDate: '',
  current: false,
  summary: '',
  highlights: '',
  technologies: '',
  sortOrder: 0,
  visible: true,
};

const toForm = (item) => ({
  ...EMPTY,
  ...item,
  // Normalise stored dates to YYYY-MM-DD so the native date picker shows them.
  startDate: formatDateForInput(item.startDate),
  endDate: formatDateForInput(item.endDate),
  highlights: (item.highlights || []).join('\n'),
  technologies: (item.technologies || []).join('\n'),
});

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/experience/admin/all');
      setItems(data);
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Could not load experience.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!form.role.trim()) errors.role = 'Role is required.';
    if (!form.company.trim()) errors.company = 'Company is required.';
    // End date, when set, must not precede the start date. YYYY-MM-DD strings
    // compare chronologically, so a plain string compare is correct here.
    if (
      !form.current &&
      isIsoDate(form.startDate) &&
      isIsoDate(form.endDate) &&
      form.endDate < form.startDate
    ) {
      errors.endDate = 'End date cannot be earlier than the start date.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      if (editing === 'new') await API.post('/experience', form);
      else await API.put(`/experience/${editing}`, form);
      setEditing(null);
      setToast({ type: 'success', message: 'Experience saved.' });
      load();
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Save failed.') });
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (item) => {
    try {
      const { data } = await API.put(`/experience/${item._id}`, { ...item, visible: !item.visible });
      setItems((prev) => prev.map((i) => (i._id === data._id ? data : i)));
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Update failed.') });
    }
  };

  const move = async (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    try {
      await API.put('/experience/reorder', {
        order: next.map((item, i) => ({ id: item._id, sortOrder: i })),
      });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Reorder failed.') });
      load();
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/experience/${pendingDelete._id}`);
      setItems((prev) => prev.filter((i) => i._id !== pendingDelete._id));
      setPendingDelete(null);
      setToast({ type: 'success', message: 'Entry deleted.' });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Delete failed.') });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Experience"
        description="Timeline shown on the About and Experience pages."
        action={
          <Button
            onClick={() => {
              setForm({ ...EMPTY, sortOrder: items.length });
              setFieldErrors({});
              setEditing('new');
            }}
          >
            Add entry
          </Button>
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line bg-canvas/70 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Visible</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.length ? (
                items.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          aria-label="Move up"
                          className="rounded border border-line px-2 py-0.5 text-xs"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          aria-label="Move down"
                          className="rounded border border-line px-2 py-0.5 text-xs"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.role}</td>
                    <td className="px-4 py-3 text-ink-muted">{item.company}</td>
                    <td className="px-4 py-3 text-ink-muted">
                      {[item.startDate, item.current ? 'Present' : item.endDate]
                        .filter(Boolean)
                        .join(' — ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Toggle
                        checked={item.visible}
                        onChange={() => toggleVisible(item)}
                        label={`Show ${item.role} on the site`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForm(toForm(item));
                            setFieldErrors({});
                            setEditing(item._id);
                          }}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-ink/30"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(item)}
                          className="rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs text-danger hover:bg-danger-soft"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={6} message="No experience entries yet." />
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        wide
        title={editing === 'new' ? 'Add experience' : 'Edit experience'}
        onClose={() => setEditing(null)}
      >
        <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label="Role" error={fieldErrors.role}>
            <input
              value={form.role}
              onChange={(e) => {
                setForm({ ...form, role: e.target.value });
                if (fieldErrors.role) setFieldErrors((p) => ({ ...p, role: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.role)}
              className={inputClass}
            />
          </Field>
          <Field label="Company" error={fieldErrors.company}>
            <input
              value={form.company}
              onChange={(e) => {
                setForm({ ...form, company: e.target.value });
                if (fieldErrors.company) setFieldErrors((p) => ({ ...p, company: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.company)}
              className={inputClass}
            />
          </Field>
          <Field label="Location">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Employment type">
            <input
              value={form.employmentType}
              onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Start date">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field
            label="End date"
            hint={form.current ? 'Not needed for a current role.' : 'Leave empty if ongoing.'}
            error={fieldErrors.endDate}
          >
            <input
              type="date"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(e) => {
                setForm({ ...form, endDate: e.target.value });
                if (fieldErrors.endDate) setFieldErrors((p) => ({ ...p, endDate: undefined }));
              }}
              disabled={form.current}
              aria-invalid={Boolean(fieldErrors.endDate)}
              className={`${inputClass} disabled:opacity-50`}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => {
                setForm({
                  ...form,
                  current: e.target.checked,
                  // A current role has no end date — clear it when toggled on.
                  endDate: e.target.checked ? '' : form.endDate,
                });
                if (e.target.checked && fieldErrors.endDate) {
                  setFieldErrors((p) => ({ ...p, endDate: undefined }));
                }
              }}
              className="h-4 w-4"
            />
            Current role
          </label>
          <Field label="Summary" className="sm:col-span-2">
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Highlights" hint="One per line">
            <textarea
              rows={4}
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Technologies" hint="One per line">
            <textarea
              rows={4}
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="h-4 w-4"
            />
            Visible on the public site
          </label>

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete experience entry"
        message={`Delete "${pendingDelete?.role} · ${pendingDelete?.company}"?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
