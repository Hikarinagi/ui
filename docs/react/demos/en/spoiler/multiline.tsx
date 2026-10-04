import { Spoiler, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-sm">
      <Spoiler>
        A spoiler spanning several lines can be hidden as a whole; revealing it starts where the
        pointer lands and fills the passage line by line.
      </Spoiler>
    </Text>
  )
}
