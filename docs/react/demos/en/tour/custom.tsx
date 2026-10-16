'use client'

import { useState } from 'react'
import { Button, Indicator, Inline, Kbd, Text, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  {
    target: '#tour-custom-command',
    title: 'Command palette',
    description: 'Open the command palette any time.',
  },
  { target: '#tour-custom-theme', title: 'Theme', description: 'Switch between light and dark.' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button id="tour-custom-command" variant="outline" tone="neutral">
          Commands
        </Button>
        <Button id="tour-custom-theme" variant="outline" tone="neutral">
          Theme
        </Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          Start tour
        </Button>
      </Inline>
      <Tour
        steps={steps}
        open={open}
        onOpenChange={setOpen}
        locked
        renderContent={({ step, current }) => (
          <>
            <Text tone="muted" size="sm">
              {step.description}
            </Text>
            {current === 1 ? (
              <Text size="sm" className="mt-2">
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open it.
              </Text>
            ) : null}
          </>
        )}
        renderFooter={({ current, total, next, prev }) => (
          <Inline gap="sm" align="center" justify="between">
            <Inline gap="xs" aria-hidden="true">
              {Array.from({ length: total }, (_, index) => (
                <Indicator
                  key={index}
                  size="sm"
                  tone={index + 1 === current ? 'accent' : 'neutral'}
                  className={index + 1 === current ? undefined : 'opacity-25'}
                />
              ))}
            </Inline>
            <Inline gap="sm">
              {current > 1 ? (
                <Button size="sm" variant="ghost" tone="neutral" onClick={prev}>
                  Back
                </Button>
              ) : null}
              <Button size="sm" onClick={next}>
                {current === total ? 'Got it' : 'Continue'}
              </Button>
            </Inline>
          </Inline>
        )}
      />
    </>
  )
}
