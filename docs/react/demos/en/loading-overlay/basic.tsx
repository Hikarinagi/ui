'use client'

import { useState } from 'react'
import { Card, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(true)

  return (
    <Stack gap="md" align="start">
      <Switch checked={loading} onCheckedChange={setLoading}>
        Show the overlay
      </Switch>
      <Card className="relative w-96">
        <Text>This content is dimmed and cannot be clicked while loading.</Text>
        <LoadingOverlay visible={loading} />
      </Card>
    </Stack>
  )
}
