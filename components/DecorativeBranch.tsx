interface Twig {
  base: [number, number]
  angle: number
  length: number
  needles: number
}

const TWIGS: Twig[] = [
  { base: [48, 52], angle: -25, length: 52, needles: 5 },
  { base: [78, 95], angle: 155, length: 46, needles: 4 },
  { base: [110, 150], angle: -15, length: 58, needles: 5 },
  { base: [140, 205], angle: 165, length: 52, needles: 4 },
  { base: [168, 255], angle: -5, length: 48, needles: 4 },
  { base: [192, 300], angle: 172, length: 40, needles: 3 },
  { base: [208, 340], angle: -18, length: 32, needles: 3 },
]

function polar(x: number, y: number, angleDeg: number, len: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  return [x + Math.cos(rad) * len, y + Math.sin(rad) * len]
}

function twigLines(twig: Twig) {
  const [bx, by] = twig.base
  const [tx, ty] = polar(bx, by, twig.angle, twig.length)
  const needles: { x1: number; y1: number; x2: number; y2: number }[] = []

  for (let i = 0; i < twig.needles; i++) {
    const t = (i + 1) / (twig.needles + 1)
    const px = bx + (tx - bx) * t
    const py = by + (ty - by) * t
    const needleLen = 13 - t * 7
    const side = i % 2 === 0 ? -58 : 58
    const [ex, ey] = polar(px, py, twig.angle + side, needleLen)
    needles.push({ x1: px, y1: py, x2: ex, y2: ey })
  }

  return { stem: { x1: bx, y1: by, x2: tx, y2: ty }, needles }
}

export default function DecorativeBranch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path
        d="M15 15 C 60 60, 100 110, 130 180 C 160 250, 190 310, 215 370"
        strokeWidth="1.4"
      />
      {TWIGS.map((twig, i) => {
        const { stem, needles } = twigLines(twig)
        return (
          <g key={i}>
            <line x1={stem.x1} y1={stem.y1} x2={stem.x2} y2={stem.y2} strokeWidth="0.9" />
            {needles.map((n, j) => (
              <line key={j} x1={n.x1} y1={n.y1} x2={n.x2} y2={n.y2} strokeWidth="0.6" />
            ))}
          </g>
        )
      })}
    </svg>
  )
}
