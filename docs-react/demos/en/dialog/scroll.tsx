'use client'

import { Button, Dialog, Stack, Text } from '@hina-ui/react'

const terms = Array.from(
  { length: 30 },
  (_, i) =>
    `Clause ${i + 1}: using the service means you accept this term, which is here only as placeholder text, long enough that the body actually scrolls.`,
)

export default function Demo() {
  return (
    <Dialog
      title="Terms of service"
      description="Please read them before you continue."
      renderContent={() => (
        <Stack gap="sm">
          {terms.map(line => (
            <Text key={line}>{line}</Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            Decline
          </Button>
          <Button onClick={close}>Accept</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Read the terms
      </Button>
    </Dialog>
  )
}
