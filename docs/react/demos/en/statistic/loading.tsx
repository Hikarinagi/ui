'use client'

import { useState } from 'react'
import { Card, Inline, Statistic, Switch } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(true)

  return (
    <Inline gap="md" align="center">
      <Card className="w-56">
        <Statistic label="Pages this month" value={12480} delta={0.124} loading={loading} />
      </Card>
      <Switch checked={loading} onCheckedChange={setLoading}>
        Loading
      </Switch>
    </Inline>
  )
}
