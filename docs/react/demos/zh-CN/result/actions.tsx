import { Button, Result } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      status="error"
      title="支付未完成"
      description="银行没有确认这笔交易，款项不会被扣除。"
      className="w-96"
      actions={
        <>
          <Button size="sm">重新支付</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            联系客服
          </Button>
        </>
      }
    />
  )
}
