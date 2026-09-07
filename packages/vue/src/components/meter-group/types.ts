import type { IndicatorVariants } from '../indicator/indicator.variants'

export type MeterTone = NonNullable<IndicatorVariants['tone']>

export interface MeterItem {
  label: string
  value: number
  tone?: MeterTone
}
