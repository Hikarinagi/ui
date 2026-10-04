import { Card, Center, Ripple, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="hn-interactive relative isolate w-full max-w-sm cursor-pointer overflow-hidden">
      <Ripple />
      <Center className="h-20">
        <Text size="sm" tone="muted">
          按住这块面板
        </Text>
      </Center>
    </Card>
  )
}
