import { Card, Container, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="none" className="bg-inset w-full rounded-md py-4">
      <Container>
        <Card className="grid h-16 place-items-center">居中且限宽的内容</Card>
      </Container>
    </Stack>
  )
}
