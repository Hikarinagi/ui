import { Button, Empty, Panel } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel
      title="最近活动"
      count={0}
      className="w-96"
      actions={
        <Button size="sm" variant="ghost" tone="neutral">
          全部
        </Button>
      }
    >
      <Empty size="sm" title="过去七天没有动态" description="关注一些人，这里就会热闹起来。" />
    </Panel>
  )
}
