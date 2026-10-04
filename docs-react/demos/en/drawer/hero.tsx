'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Button, Drawer, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="Filters"
      description="Only works matching these conditions are shown."
      renderContent={() => (
        <Stack gap="sm">
          <Stack gap="xs">
            <Text size="sm">Keyword</Text>
            <Input defaultValue="observatory" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">Release year</Text>
            <Input defaultValue="2024" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">Producer</Text>
            <Input defaultValue="ANIPLEX.EXE" />
          </Stack>
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            Reset
          </Button>
          <Button onClick={close}>Apply</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral" icon={<SlidersHorizontal />}>
        Filters
      </Button>
    </Drawer>
  )
}
