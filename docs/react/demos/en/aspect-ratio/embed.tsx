import { AspectRatio, Center, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <AspectRatio className="bg-inset w-full max-w-md overflow-hidden rounded-md">
      <Center className="size-full">
        <Text tone="muted" size="sm">
          An iframe or video goes here and fills the whole frame
        </Text>
      </Center>
    </AspectRatio>
  )
}
