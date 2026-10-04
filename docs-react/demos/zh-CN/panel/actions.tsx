import { Button, Panel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel
      title="邮件通知"
      className="w-96"
      actions={
        <>
          <Button size="sm" variant="outline" tone="neutral">
            测试发送
          </Button>
          <Button size="sm">保存</Button>
        </>
      }
    >
      <Text>有新的回复、关注与私信时发送邮件。</Text>
    </Panel>
  )
}
