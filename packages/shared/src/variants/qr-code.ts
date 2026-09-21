import { tv } from '../lib/tv'

export const qrCode = tv({
  base: 'relative isolate inline-block aspect-square w-[var(--hn-qr-size)] max-w-full shrink-0 overflow-hidden rounded-xl align-middle bg-[var(--hn-qr-background)]',
  variants: { bordered: { true: 'border-line border', false: '' } },
  defaultVariants: { bordered: true },
})
export const qrCodeSvg = tv({ base: 'block size-full' })
export const qrCodeStatus = tv({
  base: 'bg-subtle text-muted absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-sm',
})
