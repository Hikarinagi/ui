import { Mark, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      Searching for “ <Mark>spice</Mark> ” found 3 results; volume three of Spice and Wolf mentions
      the <Mark>spice</Mark> most often.
    </Text>
  )
}
