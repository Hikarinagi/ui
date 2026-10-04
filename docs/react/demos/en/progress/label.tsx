import { Progress, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-80">
      <Progress value={25} label="Syncing bookmarks" />
      <Progress value={25} label="Syncing bookmarks" showValue />
      <Progress value={25} showValue />
    </Stack>
  )
}
