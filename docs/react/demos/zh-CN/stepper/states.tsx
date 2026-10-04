'use client'

import { useState } from 'react'
import { Stepper, Stack, Switch } from '@hina-ui/react'

const items = [
  { title: '已完成', completed: true },
  { title: '需要检查', description: '此步骤存在错误', error: true },
  { title: '已禁用', disabled: true },
]

export default function Demo() {
  const [disabled, setDisabled] = useState(false)
  return (
    <Stack className="w-full" gap="lg">
      <Switch checked={disabled} onCheckedChange={setDisabled}>
        禁用整个步骤条
      </Switch>
      <Stepper items={items} defaultValue={2} linear={false} disabled={disabled} />
    </Stack>
  )
}
