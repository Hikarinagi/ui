'use client'

import { useState } from 'react'
import { Center, ContextMenu, ContextMenuItem, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [locked, setLocked] = useState(false)

  return (
    <Stack gap="md" align="start">
      <Switch checked={locked} onCheckedChange={setLocked}>
        Lock the area
      </Switch>
      <ContextMenu
        label="Item actions"
        disabled={locked}
        content={
          <>
            <ContextMenuItem>Edit</ContextMenuItem>
            <ContextMenuItem disabled>Move</ContextMenuItem>
            <ContextMenuItem tone="danger">Delete</ContextMenuItem>
          </>
        }
      >
        <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
          <Text tone="muted" size="sm">
            {locked ? "Locked; right-click shows the browser's own menu" : 'Right-click here'}
          </Text>
        </Center>
      </ContextMenu>
    </Stack>
  )
}
