'use client'

import { useState } from 'react'
import { Center, ContextMenu, ContextMenuCheckboxItem, Text } from '@hina-ui/react'

export default function Demo() {
  const [grid, setGrid] = useState(true)
  const [ruler, setRuler] = useState(false)

  return (
    <ContextMenu
      label="View"
      content={
        <>
          <ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Show grid
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={ruler} onCheckedChange={setRuler}>
            Show ruler
          </ContextMenuCheckboxItem>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          {`Grid ${grid ? 'on' : 'off'}, ruler ${ruler ? 'on' : 'off'}`}
        </Text>
      </Center>
    </ContextMenu>
  )
}
