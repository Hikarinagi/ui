'use client'

import { Button, Sheet, Stack, Text } from '@hina-ui/react'

const clauses = Array.from({ length: 24 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <Sheet
      title="Terms of service"
      description="Read to the end before agreeing."
      renderContent={() => (
        <Stack gap="md">
          {clauses.map(n => (
            <Text key={n}>
              Clause {n}: this clause exists to show scrolling inside the sheet; the title and
              footer stay put while the body scrolls in between.
            </Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => <Button onClick={close}>Agree</Button>}
    >
      <Button variant="outline" tone="neutral">
        View terms
      </Button>
    </Sheet>
  )
}
