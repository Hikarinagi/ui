'use client'

import { useState } from 'react'
import { Center, ContextMenu, ContextMenuCheckboxItem, Text } from '@hina-ui/react'

export default function Demo() {
  const [grid, setGrid] = useState(true)
  const [ruler, setRuler] = useState(false)

  return (
    <ContextMenu
      label="视图"
      content={
        <>
          <ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            显示网格
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={ruler} onCheckedChange={setRuler}>
            显示标尺
          </ContextMenuCheckboxItem>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          {`网格${grid ? '开' : '关'}，标尺${ruler ? '开' : '关'}`}
        </Text>
      </Center>
    </ContextMenu>
  )
}
