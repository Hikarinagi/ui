import { createTV } from 'tailwind-variants'
import { TW_MERGE_CONFIG } from './tw-merge'

export const tv = createTV({ twMergeConfig: TW_MERGE_CONFIG })

export type { VariantProps } from 'tailwind-variants'
