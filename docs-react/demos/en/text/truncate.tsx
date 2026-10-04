import { Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text truncate className="max-w-xs">
      A very long line of text truncated at the container edge with an ellipsis
    </Text>
  )
}
