import { Card, Center, Ripple, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="hn-interactive relative isolate w-full max-w-sm cursor-pointer overflow-hidden">
      <Ripple />
      <Center className="h-20">
        <Text size="sm" tone="muted">
          Press and hold this panel
        </Text>
      </Center>
    </Card>
  )
}
