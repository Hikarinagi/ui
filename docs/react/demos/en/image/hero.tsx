import { Card, Image, Stack, Tag, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-xs" padded={false}>
      <Image
        src="/sample.webp"
        alt="A slope on a summer afternoon"
        ratio={4 / 3}
        lazy={false}
        eager
        className="rounded-t-lg"
      />
      <Stack gap="xs" align="start" className="p-4">
        <Text className="font-medium">ATRI</Text>
        <Tag>Sci-fi</Tag>
      </Stack>
    </Card>
  )
}
