import { useRef, useState } from 'react';
import { isImageSrc, isPublicImagePath } from '../utils/format';

/* ==========================================================================
   Image input — browse or drag & drop, plus a public-path escape hatch.

   An uploaded file is resized and compressed in the browser to a JPEG data URL
   which is handed back through onChange. That path caps at maxW/maxH because
   the result is stored inline in the project document.

   For assets that must stay full resolution (4K screenshots), drop the file
   into Frontend/public/images/... and type its path here instead. The value is
   still a plain string, so nothing downstream changes.
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
  round = false,
  maxW = 1400,
  maxH = 1400,
  quality = 0.82,
  className = '',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // A public path points at the frontend's origin, not the admin's, so its
  // preview cannot load here. Track that so we explain it instead of showing
  // a broken thumbnail.
  // Holds the exact src that failed, not a flag, so a later value clears it
  // on its own instead of staying stuck when the project reloads.
  const [failedSrc, setFailedSrc] = useState('');

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
  const previewFailed = hasImage && failedSrc === value;
  const isPath = isPublicImagePath(value || '');

  return (
    <div className={className}>
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
        className={`flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-3 transition-colors ${
          dragging ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface hover:border-accent/50'
        }`}
      >
        <div
          className={`grid shrink-0 place-items-center overflow-hidden border border-line bg-canvas ${
            round ? 'h-20 w-20 rounded-full' : 'h-20 w-28 rounded-lg'
          }`}
        >
          {hasImage && !previewFailed ? (
            <img
              src={value}
              alt="Preview"
              onError={() => setFailedSrc(value)}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg className="h-7 w-7 text-ink-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" />
              <circle cx="8.5" cy="9" r="1.5" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">
            {busy ? 'Processing…' : hasImage ? 'Change image' : 'Upload an image'}
          </p>
          <p className="mt-0.5 text-xs text-ink-subtle">
            Drag &amp; drop, or click to browse — resized to {maxW}×{maxH}
          </p>
          {error ? <p className="mt-1 text-xs font-medium text-danger">{error}</p> : null}
        </div>

        {hasImage ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setError('');
              setFailedSrc('');
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="shrink-0 rounded-lg border border-line-strong px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-danger/40 hover:text-danger"
          >
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Full-resolution route: the file lives in Frontend/public and only its
          path is stored, so a 4K asset costs the document nothing. Anything
          that is not an uploaded data URL is shown here verbatim, so a
          half-typed path is not wiped before it becomes valid. */}
      <label className="mt-2 block">
        <span className="text-xs text-ink-subtle">
          Or, for a full-resolution file already in <code>Frontend/public/</code>, its path:
        </span>
        <input
          type="text"
          value={/^data:/i.test(value || '') ? '' : value || ''}
          onChange={(e) => {
            setError('');
            setFailedSrc('');
            onChange(e.target.value.trim());
          }}
          placeholder="/images/momentum/hero.jpg"
          className="mt-1 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 font-mono text-xs text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none"
        />
      </label>
      {isPath ? (
        <p className="mt-1 text-xs text-ink-subtle">
          {previewFailed
            ? 'Stored as a path. The preview cannot load here because the file is served by the frontend, not the admin — check it on the site.'
            : 'Stored as a path — the file is served at full resolution.'}
        </p>
      ) : null}
    </div>
  );
}
