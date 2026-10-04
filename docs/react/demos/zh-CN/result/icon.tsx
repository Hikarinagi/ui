import { Button, Image, Result } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      title="今天的目标完成了"
      description="连续第七天读满三十分钟。"
      className="w-96"
      icon={<Image src="/avatars/hug.webp" ratio={1} className="size-24 rounded-full" />}
      actions={<Button size="sm">继续阅读</Button>}
    />
  )
}
