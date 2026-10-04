import { Spoiler, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      Move the pointer in to see <Spoiler revealOn="hover">the hidden content</Spoiler> , and it
      hides again as the pointer leaves.
    </Text>
  )
}
