'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input, Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  const [values, setValues] = useState({ name: '星见书音', email: 'shion@example.com' })
  const [locked, setLocked] = useState(true)

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Switch checked={locked} onCheckedChange={setLocked}>
        锁定账号信息
      </Switch>
      <FormLayout legend="账号" disabled={locked}>
        <FormField label="用户名">
          <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
        </FormField>
        <FormField label="邮箱">
          <Input
            value={values.email}
            onValueChange={email => setValues({ ...values, email })}
            type="email"
          />
        </FormField>
      </FormLayout>
    </Stack>
  )
}
