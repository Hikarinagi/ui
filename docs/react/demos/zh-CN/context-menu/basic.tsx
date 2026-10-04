import { Center, ContextMenu, ContextMenuItem, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <ContextMenu
      label="图片操作"
      content={
        <>
          <ContextMenuItem>在新标签页打开</ContextMenuItem>
          <ContextMenuItem>复制图片地址</ContextMenuItem>
          <ContextMenuItem>保存图片</ContextMenuItem>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          在这里点击右键
        </Text>
      </Center>
    </ContextMenu>
  )
}
