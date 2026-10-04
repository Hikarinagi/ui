'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input, Switch } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('Hina')
  const [email, setEmail] = useState('hello@example.com')
  const [sync, setSync] = useState(true)

  return (
    <FormLayout
      legend="Profile settings"
      orientation="responsive"
      labelWidth="9rem"
      descriptionPlacement="label"
      className="w-full"
    >
      <FormField label="Display name" description="Shown on your public profile.">
        <Input value={name} onValueChange={setName} />
      </FormField>
      <FormField
        label="Email address"
        description="Use an address that can receive notifications."
        descriptionPlacement="control"
      >
        <Input value={email} onValueChange={setEmail} type="email" />
      </FormField>
      <FormField>
        <Switch
          checked={sync}
          onCheckedChange={setSync}
          controlPlacement="end"
          block
          description="Continue where you left off on another device."
        >
          Sync reading progress
        </Switch>
      </FormField>
    </FormLayout>
  )
}
