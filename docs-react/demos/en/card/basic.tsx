import { Card, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Text>
        A card brings its own background, a hairline border and a resting shadow. Content goes
        straight into the default slot.
      </Text>
    </Card>
  )
}
