import { Result, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg" className="w-96">
      <Result status="success" size="sm" title="Saved" description="Your changes are live." />
      <Result status="success" title="Saved" description="Your changes are live." />
      <Result status="success" size="lg" title="Saved" description="Your changes are live." />
    </Stack>
  )
}
