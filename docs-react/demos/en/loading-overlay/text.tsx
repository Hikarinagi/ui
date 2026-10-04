import { Card, LoadingOverlay, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="relative h-40 w-96">
      <Text>Syncing the draft to the cloud.</Text>
      <LoadingOverlay visible text="Syncing" size="lg" />
    </Card>
  )
}
