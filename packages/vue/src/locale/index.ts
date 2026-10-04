import {
  computed,
  inject,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'
import {
  mergeUiMessages,
  zhCN,
  type PartialUiMessages,
  type UiMessages,
} from '../../../shared/src/locale'

const UI_LOCALE_KEY = Symbol('hn-ui-locale') as InjectionKey<ComputedRef<UiMessages>>

const fallbackLocale = computed(() => zhCN)

export function provideUiLocale(
  messages: MaybeRefOrGetter<PartialUiMessages>,
): ComputedRef<UiMessages> {
  const resolved = computed(() => mergeUiMessages(zhCN, toValue(messages)))
  provide(UI_LOCALE_KEY, resolved)
  return resolved
}

export function useUiLocale(): ComputedRef<UiMessages> {
  return inject(UI_LOCALE_KEY, fallbackLocale)
}

export { zhCN, enUS } from '../../../shared/src/locale'
export type { UiMessages, PartialUiMessages } from '../../../shared/src/locale'
