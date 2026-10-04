import { Result, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-96">
      <Result status="success" size="sm" title="已保存" description="改动已经生效。" />
      <Result status="success" title="已保存" description="改动已经生效。" />
      <Result status="success" size="lg" title="已保存" description="改动已经生效。" />
    </Stack>
  )
}
