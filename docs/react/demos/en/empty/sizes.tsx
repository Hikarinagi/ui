import { Empty, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-96">
      <Empty size="sm" title="No comments" description="Say something." />
      <Empty title="No comments" description="Say something." />
      <Empty size="lg" title="No comments" description="Say something." />
    </Stack>
  )
}
