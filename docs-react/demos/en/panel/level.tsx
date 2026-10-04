import { Heading, Panel, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="md" className="w-96">
      <Heading level={2} size="lg">
        Settings
      </Heading>
      <Panel title="Notifications" level={3}>
        <Text>This panel sits under "Settings", so its title steps down to level three.</Text>
      </Panel>
      <Panel title="Privacy" level={3}>
        <Text>Panels on the same level share the same heading level.</Text>
      </Panel>
    </Stack>
  )
}
