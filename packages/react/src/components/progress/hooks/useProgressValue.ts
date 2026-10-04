'use client'

import { useUiLocale } from '../../../locale'

export type ProgressFormat = (value: number, max: number) => string

interface Options {
  value: number | null | undefined
  max: number
  label: string | undefined
  format: ProgressFormat | undefined
}

export function useProgressValue({ value, max, label, format }: Options) {
  const t = useUiLocale()

  const current = typeof value !== 'number' ? null : Math.min(Math.max(value, 0), max)
  const ratio = current === null || max <= 0 ? 0 : current / max
  const text =
    current === null
      ? undefined
      : format
        ? format(current, max)
        : new Intl.NumberFormat(t.tag, { style: 'percent', maximumFractionDigits: 0 }).format(ratio)
  const name = label ?? text ?? t.common.loading

  return { current, ratio, text, name }
}
