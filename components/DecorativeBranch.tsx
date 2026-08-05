export default function DecorativeBranch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M10 10 C 60 50, 90 90, 120 150 C 150 210, 170 260, 190 330" />
      <path d="M55 45 C 75 55, 95 60, 115 55" />
      <path d="M75 70 C 95 78, 112 76, 128 65" />
      <path d="M95 100 C 118 105, 135 98, 148 82" />
      <path d="M118 140 C 142 148, 162 142, 178 122" />
      <path d="M140 175 C 118 185, 100 182, 85 168" />
      <path d="M160 215 C 185 222, 205 214, 220 195" />
      <path d="M175 255 C 152 265, 132 260, 118 245" />
      <ellipse cx="128" cy="60" rx="9" ry="4" transform="rotate(35 128 60)" />
      <ellipse cx="150" cy="80" rx="8" ry="3.5" transform="rotate(20 150 80)" />
      <ellipse cx="180" cy="120" rx="9" ry="4" transform="rotate(30 180 120)" />
      <ellipse cx="222" cy="193" rx="9" ry="4" transform="rotate(25 222 193)" />
      <ellipse cx="82" cy="167" rx="8" ry="3.5" transform="rotate(-30 82 167)" />
      <ellipse cx="115" cy="244" rx="8" ry="3.5" transform="rotate(-25 115 244)" />
    </svg>
  )
}
