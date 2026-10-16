import { tv } from '../lib/tv'

export const tourMask = tv({ base: 'hn-scrim hn-tour-mask' })

export const tourBlocker = tv({ base: 'fixed z-(--hn-z-overlay)' })

export const tourCard = tv({
  base: 'relative z-(--hn-z-overlay) flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3 overflow-visible p-4 shadow-lg outline-none',
})

export const tourCentered = tv({
  base: 'pointer-events-none fixed inset-0 z-(--hn-z-overlay) grid place-items-center p-4 [&>*]:pointer-events-auto',
})

export const tourBeacon = tv({
  base: 'hn-focus-ring fixed z-(--hn-z-overlay) size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full',
})

export const tourBeaconPulse = tv({
  base: 'hn-ping bg-accent pointer-events-none absolute inset-0 rounded-full',
})

export const tourBeaconDot = tv({
  base: 'bg-accent ring-surface pointer-events-none relative block size-full rounded-full ring-2',
})

export const tourHeader = tv({ base: 'flex items-start gap-2' })

export const tourFooter = tv({ base: 'flex items-center gap-2' })
