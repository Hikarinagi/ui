'use client'

import { createElement, type ReactNode } from 'react'
import { Stack, Text, Time, UiLocaleProvider, enUS } from '@hina-ui/react'

const value = '2026-03-14T09:30:00+08:00'

function English({ children }: { children?: ReactNode }) {
  return createElement(
    'span',
    null,
    <UiLocaleProvider messages={enUS}>{children}</UiLocaleProvider>,
  )
}

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        简体中文： <Time value={value} />
      </Text>
      <Text>
        English：{' '}
        <English>
          <Time value={value} />
        </English>
      </Text>
    </Stack>
  )
}
