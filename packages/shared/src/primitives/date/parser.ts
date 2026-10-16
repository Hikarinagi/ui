import type { DateValue } from '@internationalized/date'
import { isZonedDateTime, toDate, type Granularity, type HourCycle } from './comparators'
import type { Formatter } from './formatter'
import {
  DATE_SEGMENT_PARTS,
  EDITABLE_SEGMENT_PARTS,
  TIME_SEGMENT_PARTS,
  isDateSegmentPart,
  isSegmentPart,
  type EditableSegmentPart,
} from './parts'
import { getPlaceholder } from './placeholders'
import { getOptsByGranularity, normalizeHourCycle } from './utils'

export interface SegmentValueObj {
  day?: number | null
  month?: number | null
  year?: number | null
  hour?: number | null
  minute?: number | null
  second?: number | null
  dayPeriod?: 'AM' | 'PM' | null
}

export type SegmentContentObj = Partial<Record<EditableSegmentPart, string>>

export interface SegmentContent {
  part: string
  value: string
}

type DateLike = DateValue & {
  hour?: number
  minute?: number
  second?: number
}

const calendarDateTimeGranularities = ['hour', 'minute', 'second']

export function syncTimeSegmentValues(props: {
  value: DateLike
  formatter: Formatter
}): SegmentValueObj {
  return Object.fromEntries(
    TIME_SEGMENT_PARTS.map(part => {
      if (part === 'dayPeriod') return [part, props.formatter.dayPeriod(toDate(props.value))]
      return [part, props.value[part]]
    }),
  )
}

export function syncSegmentValues(props: { value: DateLike; formatter: Formatter }) {
  const { formatter } = props
  const dateValues = DATE_SEGMENT_PARTS.map(part => [part, props.value[part]])
  if ('hour' in props.value) {
    const timeValues = syncTimeSegmentValues({ value: props.value, formatter })
    return { ...Object.fromEntries(dateValues), ...timeValues } as SegmentValueObj
  }
  return Object.fromEntries(dateValues) as SegmentValueObj
}

export function initializeTimeSegmentValues(granularity: Granularity): SegmentValueObj {
  return Object.fromEntries(
    TIME_SEGMENT_PARTS.map(part => {
      if (part === 'dayPeriod') return [part, 'AM']
      return [part, null]
    }).filter(([key]) => {
      if (key === 'literal' || key === null) return false
      if (granularity === 'minute' && key === 'second') return false
      if (granularity === 'hour' && (key === 'second' || key === 'minute')) return false
      return true
    }),
  )
}

export function initializeSegmentValues(granularity: Granularity): SegmentValueObj {
  const initialParts = EDITABLE_SEGMENT_PARTS.map(part => {
    if (part === 'dayPeriod') return [part, 'AM']
    return [part, null]
  }).filter(([key]) => {
    if (key === 'literal' || key === null) return false
    if (granularity === 'minute' && key === 'second') return false
    if (granularity === 'hour' && (key === 'second' || key === 'minute')) return false
    if (granularity === 'day')
      return !calendarDateTimeGranularities.includes(key as string) && key !== 'dayPeriod'
    return true
  })
  return Object.fromEntries(initialParts)
}

interface ContentProps {
  granularity: Granularity
  dateRef: DateValue
  formatter: Formatter
  hideTimeZone?: boolean
  hourCycle: HourCycle
  segmentValues: SegmentValueObj
  locale: string
  isTimeValue?: boolean
}

function createContentObj(props: ContentProps) {
  const { segmentValues, formatter, locale } = props
  const values = segmentValues as Record<string, number | string | null>
  const dateRef = props.dateRef as DateValue & {
    set: (fields: Record<string, unknown>) => DateValue
  }

  function getPartContent(part: EditableSegmentPart) {
    if ('hour' in segmentValues) {
      const value = values[part]
      if (value !== null) {
        if (part === 'day')
          return formatter.part(
            dateRef.set({ [part]: value, month: segmentValues.month ?? 1 }),
            part,
            { hourCycle: normalizeHourCycle(props.hourCycle) },
          )
        return formatter.part(dateRef.set({ [part]: value }), part, {
          hourCycle: normalizeHourCycle(props.hourCycle),
        })
      }
      return getPlaceholder(part, '', locale)
    }
    if (isDateSegmentPart(part)) {
      const value = values[part]
      if (value !== null) {
        if (part === 'day')
          return formatter.part(
            props.dateRef.set({ [part]: value as number, month: segmentValues.month ?? 1 }),
            part,
          )
        return formatter.part(props.dateRef.set({ [part]: value as number }), part)
      }
      return getPlaceholder(part, '', locale)
    }
    return ''
  }

  return Object.keys(segmentValues).reduce<SegmentContentObj>((obj, part) => {
    if (!isSegmentPart(part)) return obj
    if ('hour' in segmentValues && part === 'dayPeriod') {
      const value = values[part]
      if (value !== null) obj[part] = value as string
      else obj[part] = getPlaceholder(part, 'AM', locale)
    } else obj[part] = getPartContent(part)
    return obj
  }, {})
}

function createContentArr(props: ContentProps & { contentObj: SegmentContentObj }) {
  const { granularity, formatter, contentObj, hideTimeZone, hourCycle, isTimeValue } = props
  const parts = formatter.toParts(
    props.dateRef,
    getOptsByGranularity(granularity, hourCycle, isTimeValue),
  )
  return parts
    .map(part => {
      const defaultParts: (string | null)[] = ['literal', 'timeZoneName', null]
      if (defaultParts.includes(part.type) || !isSegmentPart(part.type))
        return { part: part.type as string, value: part.value as string | undefined }
      return { part: part.type as string, value: contentObj[part.type] }
    })
    .filter((segment): segment is SegmentContent => {
      if (segment.part === null || segment.value === null) return false
      if (segment.part === 'timeZoneName' && (!isZonedDateTime(props.dateRef) || hideTimeZone))
        return false
      if (
        (!isZonedDateTime(props.dateRef) || hideTimeZone) &&
        segment.part === 'literal' &&
        ['[', ']'].includes(segment.value!.trim())
      )
        return false
      return true
    })
}

export function createContent(props: ContentProps) {
  const contentObj = createContentObj(props)
  const contentArr = createContentArr({ contentObj, ...props })
  return { obj: contentObj, arr: contentArr }
}
