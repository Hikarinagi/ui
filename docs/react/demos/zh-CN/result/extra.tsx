import { Button, Code, Result, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      status="success"
      title="订单已提交"
      description="我们会在发货后通知你。"
      className="w-96"
      actions={
        <Button size="sm" variant="soft" tone="neutral">
          查看订单
        </Button>
      }
    >
      <Text size="sm" tone="muted">
        订单号 <Code>HN-20260907-0412</Code>
      </Text>
    </Result>
  )
}
