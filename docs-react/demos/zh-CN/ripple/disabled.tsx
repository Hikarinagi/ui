import { Card, Center, Inline, Ripple, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch" className="w-full">
      <Card className="hn-interactive relative isolate flex-1 cursor-pointer overflow-hidden">
        <Ripple />
        <Center className="h-20">
          <Text size="sm" tone="muted">
            可按压
          </Text>
        </Center>
      </Card>

      <Card className="relative isolate flex-1 overflow-hidden">
        <Ripple disabled />
        <Center className="h-20">
          <Text size="sm" tone="faint">
            disabled，无涟漪
          </Text>
        </Center>
      </Card>
    </Inline>
  )
}
