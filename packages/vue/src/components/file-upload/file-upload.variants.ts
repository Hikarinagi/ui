import { tv, type VariantProps } from '../../lib/tv'

export const fileUploadRoot = tv({
  base: 'flex w-full min-w-0 flex-col gap-2',
})

export const fileUploadArea = tv({
  base: [
    'hn-interactive hn-state-layer text-muted border-line flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center text-sm',
    'hover:border-line-strong data-[dragging]:border-accent data-[dragging]:text-accent-text',
    'data-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50',
  ],
})

export const fileUploadList = tv({
  base: 'flex flex-col gap-1',
})

export const fileUploadItem = tv({
  base: 'bg-subtle flex min-w-0 items-center gap-3 rounded-md px-3 py-2',
})

export const fileUploadThumb = tv({
  base: 'text-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-inset [&>img]:size-full [&>img]:object-cover [&>svg]:size-5',
})

export const fileUploadMeta = tv({
  base: 'flex min-w-0 flex-1 flex-col',
})

export type FileUploadVariants = VariantProps<typeof fileUploadArea>
