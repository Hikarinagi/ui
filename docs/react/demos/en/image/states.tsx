import { ImageOff } from 'lucide-react'
import { Center, Image, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="start" className="gap-4">
      <Stack gap="xs" className="w-40">
        <Text tone="muted" size="sm">
          Loaded
        </Text>
        <Image
          src="/sample.webp"
          alt="A slope on a summer afternoon"
          ratio={1}
          className="rounded-md"
        />
      </Stack>
      <Stack gap="xs" className="w-40">
        <Text tone="muted" size="sm">
          No source
        </Text>
        <Image
          ratio={1}
          className="bg-inset rounded-md"
          empty={
            <Center className="text-muted size-full">
              <ImageOff className="size-6" />
            </Center>
          }
        />
      </Stack>
      <Stack gap="xs" className="w-40">
        <Text tone="muted" size="sm">
          Failed
        </Text>
        <Image
          src="/missing.webp"
          alt=""
          ratio={1}
          className="bg-inset rounded-md"
          error={
            <Center className="text-muted size-full">
              <Text size="sm">Unavailable</Text>
            </Center>
          }
        />
      </Stack>
    </Inline>
  )
}
