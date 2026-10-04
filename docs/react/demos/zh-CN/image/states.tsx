import { ImageOff } from 'lucide-react'
import { Center, Image, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="start" className="gap-4">
      <Stack gap="xs" className="w-40">
        <Text tone="muted" size="sm">
          加载完成
        </Text>
        <Image src="/sample.webp" alt="夏日午后的坡道" ratio={1} className="rounded-md" />
      </Stack>
      <Stack gap="xs" className="w-40">
        <Text tone="muted" size="sm">
          没有图片
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
          加载失败
        </Text>
        <Image
          src="/missing.webp"
          alt=""
          ratio={1}
          className="bg-inset rounded-md"
          error={
            <Center className="text-muted size-full">
              <Text size="sm">图片不可用</Text>
            </Center>
          }
        />
      </Stack>
    </Inline>
  )
}
