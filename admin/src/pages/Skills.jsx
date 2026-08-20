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

const EMPTY = { name: '', category: '', level: '', sortOrder: 0, visible: true };

export default function Skills() {
  const [skills, setSkills] = useState([]);
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
      const { data } = await API.get('/skills/admin/all');
      setSkills(data);
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Could not load skills.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm({ ...EMPTY, sortOrder: skills.length });
    setFieldErrors({});
    setEditing('new');
  };

  const openEdit = (skill) => {
    setForm({ ...EMPTY, ...skill });
    setFieldErrors({});
    setEditing(skill._id);
  };

  const save = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.category.trim()) errors.category = 'Category is required.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      if (editing === 'new') await API.post('/skills', form);
      else await API.put(`/skills/${editing}`, form);
      setEditing(null);
      setToast({ type: 'success', message: 'Skill saved.' });
      load();
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Save failed.') });
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (skill) => {
    try {
      const { data } = await API.put(`/skills/${skill._id}`, { ...skill, visible: !skill.visible });
      setSkills((prev) => prev.map((s) => (s._id === data._id ? data : s)));
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Update failed.') });
    }
  };

  const move = async (index, direction) => {
    const next = [...skills];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSkills(next);

    try {
      await API.put('/skills/reorder', {
        order: next.map((skill, i) => ({ id: skill._id, sortOrder: i })),
      });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Reorder failed.') });
      load();
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/skills/${pendingDelete._id}`);
      setSkills((prev) => prev.filter((s) => s._id !== pendingDelete._id));
      setPendingDelete(null);
      setToast({ type: 'success', message: 'Skill deleted.' });
    } catch (err) {
      setToast({ type: 'error', message: apiError(err, 'Delete failed.') });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Skills"
        description="Grouped by category on the public site."
        action={<Button onClick={openNew}>Add skill</Button>}
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line bg-canvas/70 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Visible</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {skills.length ? (
                skills.map((skill, index) => (
                  <tr key={skill._id}>
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
                    <td className="px-4 py-3 font-medium">{skill.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{skill.category}</td>
                    <td className="px-4 py-3 text-ink-muted">{skill.level || '—'}</td>
                    <td className="px-4 py-3">
                      <Toggle
                        checked={skill.visible}
                        onChange={() => toggleVisible(skill)}
                        label={`Show ${skill.name} on the site`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(skill)}
                          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-ink/30"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(skill)}
                          className="rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs text-danger hover:bg-danger-soft"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={6} message="No skills yet." />
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        title={editing === 'new' ? 'Add skill' : 'Edit skill'}
        onClose={() => setEditing(null)}
      >
        <form id="skill-form" onSubmit={save} noValidate className="space-y-4">
          <Field label="Name" error={fieldErrors.name}>
            <input
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              className={inputClass}
            />
          </Field>
          <Field label="Category" error={fieldErrors.category}>
            <input
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value });
                if (fieldErrors.category) setFieldErrors((p) => ({ ...p, category: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.category)}
              className={inputClass}
            />
          </Field>
          <Field label="Level" hint="Optional — leave empty if you do not want to show one">
            <input
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="h-4 w-4"
            />
            Visible on the public site
          </label>

          <div className="flex justify-end gap-3 pt-2">
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
        title="Delete skill"
        message={`Delete "${pendingDelete?.name}"?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
