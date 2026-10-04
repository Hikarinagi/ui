import type { MeterTone } from '../../../../shared/src/lib/meter-group'

export type { MeterTone }

export interface MeterItem {
  label: string
  value: number
  tone?: MeterTone
}
