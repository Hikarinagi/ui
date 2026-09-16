import type { TimelineVariants, TimelineMarkerVariants } from './timeline.variants'

export type TimelineTone = NonNullable<TimelineMarkerVariants['tone']>
export type TimelineSize = NonNullable<TimelineVariants['size']>
export type TimelineOrientation = 'vertical' | 'horizontal'
export type TimelineAlign = 'start' | 'end' | 'alternate'

export interface TimelineItem {
  id?: string | number
  title?: string
  description?: string
  time?: string
  dateTime?: string
  tone?: TimelineTone
}

export interface TimelineSlotProps<T extends TimelineItem = TimelineItem> {
  item: T
  index: number
}
