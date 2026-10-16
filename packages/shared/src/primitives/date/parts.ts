export const DATE_SEGMENT_PARTS = ['day', 'month', 'year'] as const
export const TIME_SEGMENT_PARTS = ['hour', 'minute', 'second', 'dayPeriod'] as const
export const EDITABLE_SEGMENT_PARTS = [...DATE_SEGMENT_PARTS, ...TIME_SEGMENT_PARTS] as const

export type DateSegmentPart = (typeof DATE_SEGMENT_PARTS)[number]
export type TimeSegmentPart = (typeof TIME_SEGMENT_PARTS)[number]
export type EditableSegmentPart = (typeof EDITABLE_SEGMENT_PARTS)[number]
export type SegmentPart = EditableSegmentPart | 'literal' | 'timeZoneName' | 'era'

export function isDateSegmentPart(part: string): part is DateSegmentPart {
  return (DATE_SEGMENT_PARTS as readonly string[]).includes(part)
}

export function isSegmentPart(part: string): part is EditableSegmentPart {
  return (EDITABLE_SEGMENT_PARTS as readonly string[]).includes(part)
}
