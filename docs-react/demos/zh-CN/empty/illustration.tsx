import { Button, Empty, Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <Empty
      title="收件箱空空如也"
      description="新的通知会第一时间送到这里。"
      className="w-96"
      icon={<Image src="/avatars/peek.webp" ratio={1} className="size-24 rounded-full" />}
      actions={
        <Button size="sm" variant="soft" tone="neutral">
          通知设置
        </Button>
      }
    />
  )
}
