import { Button, Result } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      status="success"
      title="书评已发布"
      description="其他读者现在可以看到它了。"
      className="w-96"
      actions={
        <>
          <Button size="sm">查看书评</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            回到书架
          </Button>
        </>
      }
    />
  )
}
