import { Progress, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-80">
      <Progress value={25} label="正在同步收藏" />
      <Progress value={25} label="正在同步收藏" showValue />
      <Progress value={25} showValue />
    </Stack>
  )
}
