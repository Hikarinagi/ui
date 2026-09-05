import {
  computed,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'
import type { PartialUiMessages, UiMessages } from './types'
import { zhCN } from './zh-CN'

const UI_LOCALE_KEY = Symbol('hn-ui-locale') as InjectionKey<ComputedRef<UiMessages>>

const fallbackLocale = computed(() => zhCN)

function merge(base: UiMessages, patch: PartialUiMessages): UiMessages {
  return {
    tag: patch.tag ?? base.tag,
    common: { ...base.common, ...patch.common },
    pagination: { ...base.pagination, ...patch.pagination },
    table: { ...base.table, ...patch.table },
    select: { ...base.select, ...patch.select },
    upload: { ...base.upload, ...patch.upload },
    time: { ...base.time, ...patch.time },
    scroll: { ...base.scroll, ...patch.scroll },
    toast: { ...base.toast, ...patch.toast },
    spoiler: { ...base.spoiler, ...patch.spoiler },
    codeblock: { ...base.codeblock, ...patch.codeblock },
    splitter: { ...base.splitter, ...patch.splitter },
    sidebar: { ...base.sidebar, ...patch.sidebar },
    anchor: { ...base.anchor, ...patch.anchor },
    breadcrumb: { ...base.breadcrumb, ...patch.breadcrumb },
    lightbox: { ...base.lightbox, ...patch.lightbox },
    chip: { ...base.chip, ...patch.chip },
    numberInput: { ...base.numberInput, ...patch.numberInput },
    passwordInput: { ...base.passwordInput, ...patch.passwordInput },
    combobox: { ...base.combobox, ...patch.combobox },
    slider: { ...base.slider, ...patch.slider },
    pinInput: { ...base.pinInput, ...patch.pinInput },
    dateField: { ...base.dateField, ...patch.dateField },
    dateRangeField: { ...base.dateRangeField, ...patch.dateRangeField },
    calendar: { ...base.calendar, ...patch.calendar },
    datePicker: { ...base.datePicker, ...patch.datePicker },
    dateTimePicker: { ...base.dateTimePicker, ...patch.dateTimePicker },
    rating: { ...base.rating, ...patch.rating },
    form: { ...base.form, ...patch.form },
  }
}

export function provideUiLocale(
  messages: MaybeRefOrGetter<PartialUiMessages>,
): ComputedRef<UiMessages> {
  const resolved = computed(() => merge(zhCN, toValue(messages)))
  provide(UI_LOCALE_KEY, resolved)
  return resolved
}

export function useUiLocale(): ComputedRef<UiMessages> {
  return inject(UI_LOCALE_KEY, fallbackLocale)
}

export { zhCN } from './zh-CN'
export { enUS } from './en-US'
export type { UiMessages, PartialUiMessages } from './types'
