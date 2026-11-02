// 디자인 시안의 스트로크 아이콘

type IconProps = { size?: number; color?: string }

const stroke = (size: number, color: string, width = 2.2) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function ChevronLeft({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg {...stroke(size, color)}>
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

export function ChevronRight({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...stroke(size, color)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function CheckIcon({ size = 16 }: IconProps) {
  return (
    <svg {...stroke(size, '#FFFFFF', 3)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function AlertIcon() {
  return (
    <svg {...stroke(18, '#FFCB47')}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5v.01" />
    </svg>
  )
}

export function QuestionIcon() {
  return (
    <svg {...stroke(28, 'currentColor', 2)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.6 2.6 0 1 1 3.6 2.4c-.7.3-1.1 1-1.1 1.7v.6" />
      <path d="M12 17v.01" />
    </svg>
  )
}

export function VoteIcon() {
  return (
    <svg {...stroke(28, 'currentColor', 2)}>
      <path d="M5 11.5 9.5 16 19 6.5" />
      <path d="M4 20h16" />
    </svg>
  )
}

export function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.7 4.7 4.2 5.9l-.9 3.4c-.1.4.3.7.6.5l4-2.7c.4 0 .7.1 1.1.1 5 0 9-3.1 9-7s-4-7.2-9-7.2z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Sparkle({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M12 1.5c.6 5.4 3.6 8.4 9 9-5.4.6-8.4 3.6-9 9-.6-5.4-3.6-8.4-9-9 5.4-.6 8.4-3.6 9-9z" fill={color} />
    </svg>
  )
}
