import { useState } from 'react';
import { inputClass } from './ui';

/* Chip-style input for short tokens (e.g. technologies). Enter or comma adds. */
export function TagInput({ value = [], onChange, placeholder = 'Add and press Enter', ariaLabel }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="rounded-lg border border-line bg-surface px-2 py-2 focus-within:border-ink/30">
      {value.length ? (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <li
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas px-2 py-0.5 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label={`Remove ${tag}`}
                className="text-ink-muted hover:text-danger"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full bg-transparent px-1 text-sm placeholder:text-ink-muted/70 focus:outline-none"
      />
    </div>
  );
}

/* Repeatable rows for longer list items (features, responsibilities, …). */
export function ListInput({ value = [], onChange, placeholder = 'Add an item', addLabel = 'Add item' }) {
  const update = (i, v) => onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea
            rows={1}
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className={`${inputClass} min-h-[2.5rem] flex-1`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove item"
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-ink-muted hover:border-danger/40 hover:text-danger"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ''])}
        className="rounded-lg border border-dashed border-line px-3 py-1.5 text-sm text-ink-muted hover:border-ink/30 hover:text-ink"
      >
        + {addLabel}
      </button>
    </div>
  );
}
