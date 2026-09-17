import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { TW_MERGE_CONFIG, type HnClassGroupIds } from './tw-merge'

const twMerge = extendTailwindMerge<HnClassGroupIds>(TW_MERGE_CONFIG)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
