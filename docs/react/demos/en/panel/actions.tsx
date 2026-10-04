import { Button, Panel, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel
      title="Email notifications"
      className="w-96"
      actions={
        <>
          <Button size="sm" variant="outline" tone="neutral">
            Send a test
          </Button>
          <Button size="sm">Save</Button>
        </>
      }
    >
      <Text>Send an email for new replies, followers and direct messages.</Text>
    </Panel>
  )
}
