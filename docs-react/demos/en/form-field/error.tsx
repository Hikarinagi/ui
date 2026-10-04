'use client'

import { useState } from 'react'
import { FormField, Input, Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  const [failed, setFailed] = useState(true)

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Switch checked={failed} onCheckedChange={setFailed}>
        Show the error
      </Switch>
      <FormField label="Email" error={failed ? 'The email is not valid' : undefined}>
        <Input defaultValue="shion@example" type="email" />
      </FormField>
    </Stack>
  )
}
