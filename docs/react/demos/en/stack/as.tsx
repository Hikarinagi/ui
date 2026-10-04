import { Card, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack as="ul" gap="sm" className="w-full max-w-xs">
      <Card as="li">Items render as li</Card>
      <Card as="li">The container renders as ul</Card>
    </Stack>
  )
}
