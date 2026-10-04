import { Card, Container, Stack } from '@hina-ui/react'

const sizes = ['sm', 'md', 'lg', 'xl'] as const

export default function Demo() {
  return (
    <Stack className="w-full">
      {sizes.map(size => (
        <Stack key={size} gap="none" className="bg-inset w-full rounded-md py-3">
          <Container size={size}>
            <Card className="grid h-10 place-items-center text-sm" padded={false}>
              {size}
            </Card>
          </Container>
        </Stack>
      ))}
    </Stack>
  )
}
