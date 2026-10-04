import { createElement, type ReactNode } from 'react'
import { NumberFormat, Stack, Text, UiLocaleProvider, enUS } from '@hina-ui/react'

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
        Simplified Chinese: <NumberFormat value={1234567} format="compact" />
      </Text>
      <Text>
        English：{' '}
        <English>
          <NumberFormat value={1234567} format="compact" />
        </English>
      </Text>
    </Stack>
  )
}
