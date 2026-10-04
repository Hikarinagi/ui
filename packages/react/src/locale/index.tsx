'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  mergeUiMessages,
  zhCN,
  type PartialUiMessages,
  type UiMessages,
} from '../../../shared/src/locale'

const UiLocaleContext = createContext<UiMessages>(zhCN)

export interface UiLocaleProviderProps {
  messages: PartialUiMessages
  children?: ReactNode
}

export function UiLocaleProvider({ messages, children }: UiLocaleProviderProps) {
  const resolved = useMemo(() => mergeUiMessages(zhCN, messages), [messages])
  return <UiLocaleContext value={resolved}>{children}</UiLocaleContext>
}

export function useUiLocale(): UiMessages {
  return useContext(UiLocaleContext)
}

export { zhCN, enUS } from '../../../shared/src/locale'
export type { UiMessages, PartialUiMessages } from '../../../shared/src/locale'
