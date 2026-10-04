import { Alert, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <Alert
      tone="info"
      title="有新的评论"
      className="w-full max-w-xl"
      actions={
        <>
          <Button size="sm" variant="soft" tone="neutral">
            稍后
          </Button>
          <Button size="sm">查看</Button>
        </>
      }
    >
      你的文章收到了 3 条新评论。
    </Alert>
  )
}
