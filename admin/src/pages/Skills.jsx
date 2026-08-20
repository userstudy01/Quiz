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
  inputClass,
} from '../components/ui';

const EMPTY = { name: '', category: '', level: '', sortOrder: 0, visible: true };

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
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
    setEditing('new');
  };

  const openEdit = (skill) => {
    setForm({ ...EMPTY, ...skill });
    setEditing(skill._id);
  };

  const save = async (event) => {
    event.preventDefault();
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
                    <td className="px-4 py-3 text-ink-muted">{skill.visible ? 'Yes' : 'No'}</td>
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
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
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
        <form id="skill-form" onSubmit={save} className="space-y-4">
          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <input
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
