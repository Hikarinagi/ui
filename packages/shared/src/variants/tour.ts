import { tv } from '../lib/tv'

const layer = 'z-[calc(var(--hn-z-overlay)+1)]'

export const tourMask = tv({ base: 'hn-scrim hn-tour-mask' })

export const tourBlocker = tv({ base: `fixed ${layer}` })

export const tourCard = tv({
  base: `relative ${layer} flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3 overflow-visible p-4 shadow-lg outline-none`,
})

export const tourCentered = tv({
  base: `pointer-events-none fixed inset-0 ${layer} grid place-items-center p-4 [&>*]:pointer-events-auto`,
})

export const tourBeacon = tv({
  base: `hn-focus-ring fixed ${layer} size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full`,
})

export const tourBeaconPulse = tv({
  base: 'hn-ping bg-accent pointer-events-none absolute inset-0 rounded-full',
})

export const tourBeaconDot = tv({
  base: 'bg-accent ring-surface pointer-events-none relative block size-full rounded-full ring-2',
})

export const tourHeader = tv({ base: 'flex items-start gap-2' })

export const tourFooter = tv({ base: 'flex items-center gap-2' })

export const tourPointer = tv({ base: 'hn-tour-pointer' })

export const tourPointerArrow = tv({
  base: 'fill-fg stroke-surface absolute top-0 size-6 -translate-x-1 -translate-y-0.5 drop-shadow-md',
})

export const tourPointerTouch = tv({
  base: 'bg-fg/30 ring-surface absolute top-0 block size-9 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md ring-2',
})

export const tourKey = tv({ base: 'hn-tour-key' })

export const tourKeyCap = tv({
  base: 'border-line bg-surface text-fg block min-w-8 -translate-x-1/2 rounded-md border px-2 py-1 text-center text-sm font-medium whitespace-nowrap shadow-md',
})
