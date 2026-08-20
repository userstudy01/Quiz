import { useCallback, useEffect } from 'react';

/* ==========================================================================
   Screenshot lightbox.

   A full-screen viewer for a project's screenshots. Opened by clicking any
   image on the case study; the caller controls which image is shown through
   the `index` prop (null = closed). Navigation wraps, and the whole thing is
   keyboard-driven: Escape closes, Left/Right move between shots.
   ========================================================================== */

export default function Lightbox({ images = [], index, onClose, onIndex, title = '' }) {
  const open = index !== null && index >= 0 && index < images.length;
  const count = images.length;

  const go = useCallback(
    (delta) => {
      if (!count) return;
      onIndex((index + delta + count) % count);
    },
    [count, index, onIndex]
  );

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, go]);

  if (!open) return null;

  const current = images[index];
  const many = count > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      className="lightbox fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar: counter + close */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white/80 sm:px-6">
        <span className="index-mono text-xs tracking-wider">
          {many ? `${index + 1} / ${count}` : title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        {many ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}

        <figure className="flex max-h-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
          <img
            src={current.url}
            alt={current.caption || `${title} — screenshot ${index + 1}`}
            className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
          />
          {current.caption ? (
            <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">
              {current.caption}
            </figcaption>
          ) : null}
        </figure>

        {many ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Thumbnail strip */}
      {many ? (
        <div className="shrink-0 overflow-x-auto px-4 pb-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto flex w-max gap-2">
            {images.map((shot, i) => (
              <button
                key={`${shot.url}-${i}`}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`View screenshot ${i + 1}`}
                aria-current={i === index}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-opacity ${
                  i === index ? 'border-white opacity-100' : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                <img src={shot.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
