import zhBase from '../../shared/i18n/locales/zh-CN.json'
import enBase from '../../shared/i18n/locales/en.json'
import zhOverrides from '../i18n/zh-CN.json'
import enOverrides from '../i18n/en.json'
import type { Locale } from './routes'

type Messages = { [key: string]: string | Messages }

function merge(base: Messages, patch: Messages): Messages {
  const result: Messages = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    const current = result[key]
    result[key] =
      typeof value === 'object' && typeof current === 'object' ? merge(current, value) : value
  }
  return result
}

const messages: Record<Locale, Messages> = {
  'zh-CN': merge(zhBase as Messages, zhOverrides as Messages),
  en: merge(enBase as Messages, enOverrides as Messages),
}

function lookup(locale: Locale, key: string) {
  let node: string | Messages | undefined = messages[locale]
  for (const part of key.split('.')) {
    if (!node || typeof node === 'string') return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

export function translator(locale: Locale) {
  return (key: string, values: Record<string, string> = {}) =>
    (lookup(locale, key) ?? key).replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? '')
}

export function componentName(locale: Locale, to?: string) {
  if (locale !== 'zh-CN' || !to) return undefined
  return lookup(locale, `names.${to.slice(to.lastIndexOf('/') + 1)}`)
}
