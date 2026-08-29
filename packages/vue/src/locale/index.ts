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
    common: { ...base.common, ...patch.common },
    pagination: { ...base.pagination, ...patch.pagination },
    table: { ...base.table, ...patch.table },
    select: { ...base.select, ...patch.select },
    upload: { ...base.upload, ...patch.upload },
    time: { ...base.time, ...patch.time },
    scroll: { ...base.scroll, ...patch.scroll },
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
