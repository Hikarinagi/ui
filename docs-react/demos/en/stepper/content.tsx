'use client'

import { Stepper, Button, Card, Inline, Stack, Text } from '@hina-ui/react'

const items = [
  { title: 'Step A', description: 'The first description' },
  { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
  { title: 'Step C', description: 'The final description' },
]

export default function Demo() {
  return (
    <Stepper items={items}>
      {({ item, step, next, prev, canNext, canPrev }) => (
        <Card>
          <Stack gap="lg">
            <Text weight="medium">{item?.title}</Text>
            <Text tone="muted">Content for step {step} .</Text>
            <Inline justify="between">
              <Button variant="outline" tone="neutral" disabled={!canPrev} onClick={prev}>
                Previous
              </Button>
              <Button disabled={!canNext} onClick={next}>
                Next
              </Button>
            </Inline>
          </Stack>
        </Card>
      )}
    </Stepper>
  )
}
