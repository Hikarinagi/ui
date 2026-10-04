import type { IndicatorVariants } from '../variants/indicator'

export type MeterTone = NonNullable<IndicatorVariants['tone']>

export const METER_TONES: MeterTone[] = [
  'accent',
  'info',
  'success',
  'warning',
  'danger',
  'neutral',
]

export function toneAt(index: number): MeterTone {
  return METER_TONES[index % METER_TONES.length]!
}
