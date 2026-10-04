import { AspectRatio, Center, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <AspectRatio className="bg-inset w-full max-w-md overflow-hidden rounded-md">
      <Center className="size-full">
        <Text tone="muted" size="sm">
          此处可放置 iframe 或 video，它会占满整个框
        </Text>
      </Center>
    </AspectRatio>
  )
}
