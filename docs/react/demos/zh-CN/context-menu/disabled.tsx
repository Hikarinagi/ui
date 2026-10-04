'use client'

import { useState } from 'react'
import { Center, ContextMenu, ContextMenuItem, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [locked, setLocked] = useState(false)

  return (
    <Stack gap="md" align="start">
      <Switch checked={locked} onCheckedChange={setLocked}>
        锁定区域
      </Switch>
      <ContextMenu
        label="条目操作"
        disabled={locked}
        content={
          <>
            <ContextMenuItem>编辑</ContextMenuItem>
            <ContextMenuItem disabled>移动</ContextMenuItem>
            <ContextMenuItem tone="danger">删除</ContextMenuItem>
          </>
        }
      >
        <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
          <Text tone="muted" size="sm">
            {locked ? '已锁定，右键是浏览器自己的菜单' : '在这里点击右键'}
          </Text>
        </Center>
      </ContextMenu>
    </Stack>
  )
}
