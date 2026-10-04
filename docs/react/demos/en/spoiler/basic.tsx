import { Spoiler, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      Click to reveal <Spoiler>this hidden line</Spoiler> , and click again to hide it.
    </Text>
  )
}
