import type { BrandGlyph } from '../../docs/app/components/docs/brands'

export function BrandIcon({ icon, className }: { icon: BrandGlyph; className?: string }) {
  return (
    <svg
      viewBox={icon.viewBox ?? '0 0 24 24'}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}

export function RawIcon({ svg, className }: { svg: string; className?: string }) {
  return (
    <span
      className={className ? `inline-flex shrink-0 ${className}` : 'inline-flex shrink-0'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
