import { useId } from 'react';
import { projectArt } from '../lib/projectArt';

/* ==========================================================================
   Drawn artwork.

   One visual language for every generated image on the site: a warm ground, a
   single accent wash, and a line drawing rendered in the same weight and the
   same reduced palette everywhere. Everything is inline SVG, so it costs no
   network request, never shifts layout, and re-colours itself with the theme
   because every stroke resolves to a token in index.css.

   These are ILLUSTRATIONS, not screenshots. Nothing here imitates a product
   UI, a photograph or a person, and no artwork is ever labelled as a capture
   of real software. Where the database holds a real screenshot, the screenshot
   wins — see ProjectPlate in ProjectShowcase.jsx.

   Subjects are derived from the project data that already exists (category,
   overview, technologies) by lib/projectArt.js, so a project always draws the
   same picture on every render and every reload.
   ========================================================================== */

/* --- Motifs ---------------------------------------------------------------
 * Drawn on a 640 × 440 stage. Stroke classes carry the colour, so a motif is
 * only geometry — it never picks a palette of its own.                       */

const BAR_HEIGHTS = [34, 58, 26, 72, 44, 88, 52, 30, 64, 40, 76, 48];

function Agriculture() {
  return (
    <g>
      <path
        className="art-line"
        d="M-20 300C120 262 220 300 340 286 460 271 540 300 660 282"
      />
      <path
        className="art-line-soft"
        d="M-20 340C140 302 250 342 380 324 490 309 560 336 660 320"
      />
      <path
        className="art-line-soft"
        d="M-20 380C160 348 260 386 400 366 500 352 570 376 660 362"
      />

      {/* Drip line and droplets — the irrigation read, not a literal machine. */}
      <path className="art-line-soft" strokeDasharray="2 11" d="M40 206H600" />
      {[150, 270, 390, 510].map((x) => (
        <path key={x} className="art-accent" d={`M${x} 214c9 11 9 19 0 19s-9-8 0-19`} />
      ))}

      {/* Sprout */}
      <path className="art-accent" d="M118 300V244" />
      <path className="art-line" d="M118 264c-28-6-36-28-31-43 19-2 32 15 31 43" />
      <path className="art-line" d="M118 276c28-9 36-30 31-45-19-2-32 17-31 45" />
    </g>
  );
}

function Video() {
  return (
    <g>
      <rect className="art-line" x="140" y="92" width="360" height="202" rx="6" />
      <path className="art-line-soft" d="M140 128h360" />
      <path className="art-accent" d="M303 166l58 33-58 33z" />

      {/* Scrubber */}
      <path className="art-line-soft" d="M164 264h312" />
      <path className="art-accent" d="M164 264h118" />
      <circle className="art-dot-accent" cx="282" cy="264" r="4.5" />

      {/* Waveform — a media read without pretending to be a player UI. */}
      {BAR_HEIGHTS.map((h, i) => (
        <path
          key={i}
          className={i % 3 === 1 ? 'art-accent' : 'art-line-soft'}
          d={`M${168 + i * 26} ${372 - h / 2}v${h}`}
        />
      ))}
    </g>
  );
}

function Health() {
  return (
    <g>
      <path className="art-accent" d="M-20 260h180l26-62 33 124 28-88 22 26h431" />

      {/* Capsule */}
      <g transform="rotate(-22 322 132)">
        <rect className="art-line" x="242" y="100" width="160" height="64" rx="32" />
        <path className="art-line-soft" d="M322 100v64" />
        <path className="art-fill-accent" d="M242 132a32 32 0 0132-32h48v64h-48a32 32 0 01-32-32z" />
      </g>

      {/* Care mark */}
      <path className="art-line" d="M470 322v56M442 350h56" />
      <circle className="art-line-soft" cx="470" cy="350" r="46" />
      <path className="art-line-soft" d="M120 330h190M120 358h140" />
    </g>
  );
}

function Mobile() {
  return (
    <g>
      <rect className="art-line" x="248" y="58" width="164" height="316" rx="22" />
      <path className="art-line-soft" d="M300 82h60" />
      <rect className="art-fill-soft" x="272" y="112" width="116" height="62" rx="4" />
      <rect className="art-accent" x="272" y="112" width="116" height="62" rx="4" />
      <path className="art-line-soft" d="M272 200h116M272 224h84M272 248h116M272 272h68" />
      <circle className="art-line-soft" cx="330" cy="340" r="14" />

      {/* Floating panels either side — the multi-surface read. */}
      <rect className="art-line-soft" x="86" y="140" width="122" height="86" rx="4" />
      <path className="art-line-soft" d="M104 170h86M104 192h56" />
      <rect className="art-line-soft" x="452" y="216" width="122" height="86" rx="4" />
      <path className="art-line-soft" d="M470 246h86M470 268h56" />
    </g>
  );
}

function Construction() {
  return (
    <g>
      <path className="art-line" d="M-20 356h680" />

      {/* Elevation blocks */}
      <rect className="art-line" x="96" y="196" width="118" height="160" />
      <rect className="art-line-soft" x="232" y="132" width="96" height="224" />
      <rect className="art-line" x="346" y="238" width="140" height="118" />
      <path
        className="art-line-soft"
        d="M116 226h78M116 258h78M116 290h78M116 322h78M252 162h56M252 194h56M252 226h56M252 258h56M252 290h56M252 322h56M366 268h100M366 300h100M366 332h100"
      />

      {/* Crane */}
      <path className="art-accent" d="M540 356V96M540 118H396M540 118h64M396 118l144-22" />
      <path className="art-line-soft" d="M434 118v46" />
      <path className="art-line" d="M420 164h28v24h-28z" />
    </g>
  );
}

function Commerce() {
  return (
    <g>
      {/* Shelves */}
      <path className="art-line" d="M96 214h448M96 314h448M96 130h448" />

      {[
        [128, 156, 34, 58],
        [180, 168, 26, 46],
        [222, 148, 40, 66],
        [286, 162, 30, 52],
        [334, 150, 36, 64],
        [392, 166, 28, 48],
        [444, 154, 38, 60],
      ].map(([x, y, w, h], i) => (
        <rect
          key={x}
          className={i === 2 ? 'art-accent' : 'art-line-soft'}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="2"
        />
      ))}

      {[
        [140, 254, 44, 60],
        [204, 266, 32, 48],
        [258, 248, 48, 66],
        [330, 262, 36, 52],
        [386, 252, 42, 62],
        [452, 268, 30, 46],
      ].map(([x, y, w, h], i) => (
        <rect
          key={x}
          className={i === 4 ? 'art-accent' : 'art-line-soft'}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="2"
        />
      ))}

      {/* Price tag */}
      <path className="art-line" d="M436 350h108l44 42-44 42H436z" />
      <circle className="art-dot-accent" cx="464" cy="392" r="6" />
    </g>
  );
}

function Publishing() {
  return (
    <g>
      {/* Open spread */}
      <path className="art-line" d="M320 132v220" />
      <path className="art-line" d="M320 132c-52-30-116-38-186-24v220c70-14 134-6 186 24" />
      <path className="art-line" d="M320 132c52-30 116-38 186-24v220c-70-14-134-6-186 24" />
      <path
        className="art-line-soft"
        d="M164 158h116M164 186h116M164 214h94M164 242h116M164 270h78M360 158h116M360 186h116M360 214h94M360 242h116M360 270h78"
      />
      <path className="art-accent" d="M164 300h72M360 300h72" />

      {/* Audio read — the archive holds recordings too. */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path
          key={i}
          className={i % 3 === 0 ? 'art-accent' : 'art-line-soft'}
          d={`M${232 + i * 26} ${396 - (BAR_HEIGHTS[i] % 40) / 2}v${(BAR_HEIGHTS[i] % 40) + 12}`}
        />
      ))}
    </g>
  );
}

function Support() {
  return (
    <g>
      {[52, 96, 140, 184].map((r, i) => (
        <circle
          key={r}
          className={i === 1 ? 'art-accent' : 'art-line-soft'}
          cx="180"
          cy="220"
          r={r}
        />
      ))}
      <circle className="art-dot-accent" cx="180" cy="220" r="7" />

      {/* Queue of handled items */}
      {[112, 172, 232, 292].map((y, i) => (
        <g key={y}>
          <rect className="art-line-soft" x="400" y={y} width="184" height="40" rx="3" />
          <path className="art-line-soft" d={`M420 ${y + 20}h84`} />
          <path
            className={i === 1 ? 'art-accent' : 'art-line'}
            d={`M534 ${y + 20}l10 10 18-20`}
          />
        </g>
      ))}
    </g>
  );
}

function Dashboard() {
  return (
    <g>
      <rect className="art-line" x="86" y="80" width="468" height="280" rx="5" />
      <path className="art-line-soft" d="M86 118h468M214 118v242" />
      <path className="art-line-soft" d="M108 146h72M108 174h72M108 202h60M108 230h72M108 258h48" />

      {/* Bars */}
      {BAR_HEIGHTS.slice(0, 9).map((h, i) => (
        <rect
          key={i}
          className={i === 5 ? 'art-accent' : 'art-line-soft'}
          x={246 + i * 32}
          y={300 - h}
          width="18"
          height={h}
          rx="2"
        />
      ))}
      <path className="art-line" d="M240 300h296" />

      {/* Trend */}
      <path className="art-accent" d="M246 176l58-30 46 22 62-46 66 18" />
      <circle className="art-dot-accent" cx="478" cy="140" r="4.5" />
    </g>
  );
}

function Corporate() {
  return (
    <g>
      <circle className="art-fill-accent" cx="470" cy="140" r="68" />
      <circle className="art-accent" cx="470" cy="140" r="68" />
      <path className="art-line" d="M-20 348h680" />

      <rect className="art-line" x="110" y="150" width="104" height="198" />
      <rect className="art-line-soft" x="234" y="206" width="86" height="142" />
      <rect className="art-line" x="340" y="118" width="118" height="230" />
      <path
        className="art-line-soft"
        d="M130 180h64M130 212h64M130 244h64M130 276h64M130 308h64M252 236h50M252 268h50M252 300h50M360 148h78M360 180h78M360 212h78M360 244h78M360 276h78M360 308h78"
      />
    </g>
  );
}

function Web() {
  return (
    <g>
      <rect className="art-line" x="96" y="88" width="448" height="272" rx="5" />
      <path className="art-line-soft" d="M96 128h448" />
      <circle className="art-dot-soft" cx="122" cy="108" r="5" />
      <circle className="art-dot-soft" cx="142" cy="108" r="5" />
      <circle className="art-dot-accent" cx="162" cy="108" r="5" />

      <rect className="art-fill-soft" x="124" y="158" width="180" height="106" rx="3" />
      <path className="art-accent" d="M124 158h180v106H124z" />
      <path
        className="art-line-soft"
        d="M124 292h180M124 316h124M336 158h180M336 186h180M336 214h140M336 250h180M336 278h180M336 306h124"
      />
    </g>
  );
}

const SUBJECTS = {
  agriculture: Agriculture,
  video: Video,
  health: Health,
  mobile: Mobile,
  construction: Construction,
  commerce: Commerce,
  publishing: Publishing,
  support: Support,
  dashboard: Dashboard,
  corporate: Corporate,
  web: Web,
};

/* --- Standalone scenes ---------------------------------------------------- *
 * Used on the pages that are about the practice rather than a project. They
 * are deliberately abstract: no faces, no invented people, no product mocks. */

function Studio() {
  return (
    <g>
      {/* Light falling from the left */}
      <path className="art-line-soft" d="M40 40l150 400M110 40l150 400M180 40l150 400" />

      <path className="art-line" d="M-20 348h680" />
      <rect className="art-line" x="150" y="150" width="250" height="152" rx="5" />
      <path className="art-line-soft" d="M150 182h250" />
      <path className="art-accent" d="M176 216h96M176 240h150M176 264h64" />
      <path className="art-line" d="M275 302v30M215 332h120" />

      <rect className="art-line-soft" x="430" y="196" width="112" height="106" rx="4" />
      <path className="art-line-soft" d="M452 226h68M452 250h44" />

      <path className="art-accent" d="M482 150c0-30 24-54 54-54" />
      <circle className="art-dot-accent" cx="536" cy="96" r="6" />

      <rect className="art-line-soft" x="150" y="326" width="118" height="10" rx="3" />
    </g>
  );
}

function Network() {
  const nodes = [
    [140, 120],
    [320, 84],
    [500, 148],
    [96, 292],
    [300, 250],
    [520, 320],
    [212, 372],
    [404, 388],
  ];
  const links = [
    [0, 1],
    [1, 2],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 5],
    [3, 6],
    [4, 6],
    [4, 7],
    [5, 7],
  ];

  return (
    <g>
      {links.map(([a, b], i) => (
        <path
          key={i}
          className={i % 4 === 0 ? 'art-accent' : 'art-line-soft'}
          d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          className={i === 4 ? 'art-dot-accent' : 'art-dot-soft'}
          cx={x}
          cy={y}
          r={i === 4 ? 10 : 6}
        />
      ))}
      <circle className="art-line-soft" cx="300" cy="250" r="58" />
      <circle className="art-line-soft" cx="300" cy="250" r="104" />
    </g>
  );
}

function Signature() {
  return (
    <g>
      <circle className="art-fill-accent" cx="320" cy="220" r="120" />
      <circle className="art-accent" cx="320" cy="220" r="120" />
      <circle className="art-line-soft" cx="320" cy="220" r="168" />
      <path className="art-line" d="M-20 220h680M320 -20v480" />
      <path className="art-line-soft" d="M152 52l336 336M488 52L152 388" />
    </g>
  );
}

function Timeline() {
  return (
    <g>
      <path className="art-line" d="M96 220h448" />
      {[96, 208, 320, 432, 544].map((x, i) => (
        <g key={x}>
          <circle className={i === 2 ? 'art-dot-accent' : 'art-dot-soft'} cx={x} cy="220" r={i === 2 ? 9 : 6} />
          <path
            className="art-line-soft"
            d={i % 2 === 0 ? `M${x} 220v-64` : `M${x} 220v64`}
          />
          <rect
            className="art-line-soft"
            x={x - 44}
            y={i % 2 === 0 ? 108 : 284}
            width="88"
            height="48"
            rx="3"
          />
        </g>
      ))}
    </g>
  );
}

const SCENES = {
  studio: Studio,
  network: Network,
  signature: Signature,
  timeline: Timeline,
};

/* --- Stage ---------------------------------------------------------------- *
 * The shared ground every drawing sits on: a soft diagonal ink wash and one
 * accent bloom, positioned by `variant` so adjacent plates do not repeat.    */

/* Bloom centres in stage units, so the wash stays put whatever the frame's
   aspect ratio does to the drawing. */
const BLOOMS = [
  { cx: 500, cy: 80 },
  { cx: 115, cy: 335 },
  { cx: 550, cy: 352 },
  { cx: 140, cy: 70 },
];

function Stage({ children, variant = 0, className = '', fit = 'slice' }) {
  const id = useId();
  const wash = `${id}-wash`;
  const bloom = `${id}-bloom`;
  const spot = BLOOMS[variant % BLOOMS.length];

  return (
    <svg
      className={`artwork ${className}`}
      viewBox="0 0 640 440"
      /* `slice` fills a card crop; `meet` keeps the whole drawing visible in a
         very wide frame, where slicing would cut the motif in half. The ground
         rects below are oversized so either mode still paints edge to edge. */
      preserveAspectRatio={`xMidYMid ${fit}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={wash}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="640"
          y2="440"
        >
          <stop offset="0%" style={{ stopColor: 'var(--color-ink)', stopOpacity: 0.06 }} />
          <stop offset="55%" style={{ stopColor: 'var(--color-ink)', stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-ink)', stopOpacity: 0.1 }} />
        </linearGradient>
        <radialGradient
          id={bloom}
          gradientUnits="userSpaceOnUse"
          cx={spot.cx}
          cy={spot.cy}
          r="380"
        >
          <stop offset="0%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.26 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect x="-640" y="-440" width="1920" height="1320" fill={`url(#${wash})`} />
      <rect x="-640" y="-440" width="1920" height="1320" fill={`url(#${bloom})`} />

      <g className="art-motif">{children}</g>
    </svg>
  );
}

/**
 * Generated cover artwork for a project. Always the same picture for the same
 * project, drawn from the subject its own data implies.
 */
export function ProjectArtwork({ project, className = '', fit = 'slice' }) {
  const { subject, variant } = projectArt(project);
  const Motif = SUBJECTS[subject] || Web;

  return (
    <Stage variant={variant} className={className} fit={fit}>
      <Motif />
    </Stage>
  );
}

/** A named scene for the pages that are not about one project. */
export function SceneArtwork({ scene = 'studio', variant = 0, className = '', fit = 'slice' }) {
  const Motif = SCENES[scene] || Studio;

  return (
    <Stage variant={variant} className={className} fit={fit}>
      <Motif />
    </Stage>
  );
}
