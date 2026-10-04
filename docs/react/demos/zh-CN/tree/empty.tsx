import { Stack, Text, Tree } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80 max-w-full">
      <Tree items={[]} aria-label="默认空状态" />
      <Tree
        items={[]}
        aria-label="自定义空状态"
        empty={
          <Text size="sm" tone="muted">
            还没有节点
          </Text>
        }
      />
    </Stack>
  )
}
