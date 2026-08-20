import { useRef, useState } from 'react';
import { isImageSrc } from '../utils/format';

/* ==========================================================================
   Image input — browse or drag & drop, no URL typing.

   The chosen file is resized and compressed in the browser to a JPEG data URL
   which is handed back through onChange. The value is stored as a plain string
   (the same field that used to hold a URL), so nothing downstream changes.
   ========================================================================== */

const MAX_SOURCE_BYTES = 12 * 1024 * 1024; // reject absurdly large originals

function compress(file, maxW, maxH, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width, maxH / img.height);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageInput({
  value,
  onChange,
  onRemove,
  round = false,
  maxW = 1100,
  maxH = 1100,
  quality = 0.7,
  className = '',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError('Image is too large (max 12 MB).');
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compress(file, maxW, maxH, quality);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || 'Could not process the image.');
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const hasImage = isImageSrc(value);

  const clear = (e) => {
    e.stopPropagation();
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    // When a remove handler is given, the × discards the whole entry;
    // otherwise it just clears the current image.
    if (onRemove) onRemove();
    else onChange('');
  };

  return (
    <div className={`max-w-sm ${className}`}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-2.5 transition-colors ${
          dragging ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface hover:border-accent/50'
        }`}
      >
        <div
          className={`relative grid shrink-0 place-items-center overflow-hidden border border-line bg-canvas ${
            round ? 'h-16 w-16 rounded-full' : 'h-16 w-24 rounded-lg'
          }`}
        >
          {hasImage ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-6 w-6 text-ink-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" />
              <circle cx="8.5" cy="9" r="1.5" />
            </svg>
          )}
          {hasImage || onRemove ? (
            <button
              type="button"
              onClick={clear}
              aria-label={onRemove ? 'Remove' : 'Remove image'}
              className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-white transition-colors hover:bg-danger"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {busy ? 'Processing…' : hasImage ? 'Change image' : 'Upload image'}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink-subtle">Drag &amp; drop or browse</p>
          {error ? <p className="mt-1 text-xs font-medium text-danger">{error}</p> : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
