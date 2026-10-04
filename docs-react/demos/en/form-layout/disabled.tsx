'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input, Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  const [values, setValues] = useState({ name: 'Hoshimi Shion', email: 'shion@example.com' })
  const [locked, setLocked] = useState(true)

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Switch checked={locked} onCheckedChange={setLocked}>
        Lock account details
      </Switch>
      <FormLayout legend="Account" disabled={locked}>
        <FormField label="Username">
          <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
        </FormField>
        <FormField label="Email">
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
