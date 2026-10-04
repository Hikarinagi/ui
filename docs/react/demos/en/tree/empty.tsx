import { Stack, Text, Tree } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80 max-w-full">
      <Tree items={[]} aria-label="Default empty state" />
      <Tree
        items={[]}
        aria-label="Custom empty state"
        empty={
          <Text size="sm" tone="muted">
            No nodes yet
          </Text>
        }
      />
    </Stack>
  )
}
