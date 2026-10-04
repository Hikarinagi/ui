import { Empty, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-96">
      <Empty size="sm" title="没有评论" description="来说点什么。" />
      <Empty title="没有评论" description="来说点什么。" />
      <Empty size="lg" title="没有评论" description="来说点什么。" />
    </Stack>
  )
}
