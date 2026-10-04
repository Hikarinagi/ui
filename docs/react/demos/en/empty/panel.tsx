import { Button, Empty, Panel } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel
      title="Recent activity"
      count={0}
      className="w-96"
      actions={
        <Button size="sm" variant="ghost" tone="neutral">
          All
        </Button>
      }
    >
      <Empty
        size="sm"
        title="Nothing happened in the last seven days"
        description="Follow a few people and this will fill up."
      />
    </Panel>
  )
}
