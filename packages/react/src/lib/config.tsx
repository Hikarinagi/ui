'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Direction } from 'radix-ui'

export interface ScrollBodyOption {
  padding?: boolean | number | string
  margin?: boolean | number | string
}

export interface ConfigProviderProps {
  dir?: 'ltr' | 'rtl'
  locale?: string
  scrollBody?: boolean | ScrollBodyOption
  nonce?: string
  teleportTo?: string | HTMLElement
  children?: ReactNode
}

interface Config {
  dir: 'ltr' | 'rtl'
  locale: string
  scrollBody: boolean | ScrollBodyOption
  nonce?: string
  teleportTo?: string | HTMLElement
}

const ConfigContext = createContext<Config | null>(null)

export function ConfigProvider({
  dir = 'ltr',
  locale = 'en',
  scrollBody = true,
  nonce,
  teleportTo,
  children,
}: ConfigProviderProps) {
  const value = useMemo(
    () => ({ dir, locale, scrollBody, nonce, teleportTo }),
    [dir, locale, scrollBody, nonce, teleportTo],
  )
  return (
    <ConfigContext value={value}>
      <Direction.Provider dir={dir}>{children}</Direction.Provider>
    </ConfigContext>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}

export function usePortalContainer() {
  const target = useConfig()?.teleportTo
  const [container, setContainer] = useState<HTMLElement | null | undefined>(
    typeof target === 'object' ? target : undefined,
  )
  useEffect(() => {
    if (!target) setContainer(undefined)
    else if (typeof target === 'string') setContainer(document.querySelector<HTMLElement>(target))
    else setContainer(target)
  }, [target])
  return container
}
