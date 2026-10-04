import { Card, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack as="ul" gap="sm" className="w-full max-w-xs">
      <Card as="li">列表项渲染为 li</Card>
      <Card as="li">容器渲染为 ul</Card>
    </Stack>
  )
}
