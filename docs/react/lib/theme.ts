'use client'

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'hn-docs-color-mode'
const EVENT = 'hn-docs-color-mode'

export type ThemePreference = 'light' | 'dark' | 'system'

function parse(value: string | null | undefined): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system'
}

function readPreference(): ThemePreference {
  try {
    return parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return 'system'
  }
}

function prefersDark() {
  return matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(preference: ThemePreference) {
  const dark = preference === 'dark' || (preference === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

export function setThemePreference(value: string) {
  const preference = parse(value)
  try {
    localStorage.setItem(STORAGE_KEY, preference)
  } catch {}
  apply(preference)
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(notify: () => void) {
  const media = matchMedia('(prefers-color-scheme: dark)')
  const system = () => {
    if (readPreference() === 'system') apply('system')
    notify()
  }
  const storage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    apply(readPreference())
    notify()
  }
  window.addEventListener(EVENT, notify)
  window.addEventListener('storage', storage)
  media.addEventListener('change', system)
  return () => {
    window.removeEventListener(EVENT, notify)
    window.removeEventListener('storage', storage)
    media.removeEventListener('change', system)
  }
}

const isDark = () => document.documentElement.classList.contains('dark')

export function useThemePreference() {
  const preference = useSyncExternalStore(subscribe, readPreference, () => 'system' as const)
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  return { preference, dark }
}
