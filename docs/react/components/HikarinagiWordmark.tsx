import { hikarinagiSvg } from './wordmark-svg'

export function HikarinagiWordmark() {
  return (
    <span
      role="img"
      aria-label="Hikarinagi"
      className="inline-block h-[0.95em] align-[-0.17em] [&>svg]:h-full [&>svg]:w-auto"
      dangerouslySetInnerHTML={{ __html: hikarinagiSvg }}
    />
  )
}
