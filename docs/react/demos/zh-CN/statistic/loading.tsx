'use client'

import { useState } from 'react'
import { Card, Inline, Statistic, Switch } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(true)

  return (
    <Inline gap="md" align="center">
      <Card className="w-56">
        <Statistic label="本月阅读" value={12480} suffix="页" delta={0.124} loading={loading} />
      </Card>
      <Switch checked={loading} onCheckedChange={setLoading}>
        加载中
      </Switch>
    </Inline>
  )
}
