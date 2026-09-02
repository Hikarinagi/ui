import { tv, type VariantProps } from '../../lib/tv'

export const accordion = tv({
  base: 'divide-line flex flex-col divide-y',
})

export const accordionTrigger = tv({
  base: [
    'group/hn-disclosure hn-interactive hn-state-layer hn-press-none',
    'text-fg -mx-3 flex w-[calc(100%+--spacing(6))] items-center justify-between gap-3 rounded-md px-3 py-3 text-start text-base font-medium',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
  ],
})

export const accordionContent = tv({
  base: 'hn-anim-collapse [--hn-collapse-h:var(--reka-accordion-content-height)]',
})

export type AccordionVariants = VariantProps<typeof accordion>
