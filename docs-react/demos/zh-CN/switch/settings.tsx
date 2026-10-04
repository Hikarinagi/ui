'use client'

import { useState } from 'react'
import { Switch } from '@hina-ui/react'

export default function Demo() {
  const [sync, setSync] = useState(true)

  return (
    <Switch
      checked={sync}
      onCheckedChange={setSync}
      controlPlacement="end"
      block
      description="在其他设备上打开同一部作品时，从上次的位置继续。"
    >
      同步阅读进度
    </Switch>
  )
}
