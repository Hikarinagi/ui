import { Banner, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner
      tone="warning"
      actions={
        <Button size="sm" tone="neutral">
          延长登录
        </Button>
      }
    >
      登录状态将在 5 分钟后过期。
    </Banner>
  )
}
