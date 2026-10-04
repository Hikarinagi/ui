'use client'

import { useState } from 'react'
import { Button, Inline, Switch, Tooltip } from '@hina-ui/react'

export default function Demo() {
  const [shown, setShown] = useState(true)
  return (
    <Inline gap="lg" align="center">
      <Tooltip content="由右边的开关控制" open={shown}>
        <Button variant="outline" tone="neutral">
          提示的触发器
        </Button>
      </Tooltip>
      <Switch checked={shown} onCheckedChange={setShown}>
        显示提示
      </Switch>
    </Inline>
  )
}
