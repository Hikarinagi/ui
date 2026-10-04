'use client'

import { useState } from 'react'
import { Button, Inline, Stack, Text } from '@hina-ui/react'

const durations = ['fast', 'base', 'slow'] as const

export function DesignMotion({ hint, replay }: { hint: string; replay: string }) {
  const [moved, setMoved] = useState(false)
  return (
    <Stack className="border-line rounded-lg border p-5">
      <Inline justify="between">
        <Text size="sm" tone="muted">
          {hint}
        </Text>
        <Button variant="outline" tone="neutral" size="sm" onClick={() => setMoved(!moved)}>
          {replay}
        </Button>
      </Inline>
      {durations.map(duration => (
        <Stack key={duration} gap="sm">
          <Inline justify="between">
            <Text size="sm" weight="medium">
              {duration}
            </Text>
            <Text size="xs" tone="muted" className="font-mono">{`--hn-duration-${duration}`}</Text>
          </Inline>
          <Stack className="bg-subtle rounded-md p-2">
            <Stack className="relative me-7 h-7">
              <Stack
                className="bg-accent absolute inset-y-0 start-0 size-7 rounded-sm transition-[inset-inline-start]"
                style={{
                  insetInlineStart: moved ? '100%' : '0%',
                  transitionDuration: `var(--hn-duration-${duration})`,
                  transitionTimingFunction: 'var(--hn-ease-move)',
                }}
                aria-hidden="true"
              />
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}
