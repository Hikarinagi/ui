'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <FormLayout legend="Account" description="Used to sign in" className="w-80">
      <FormField label="Username">
        <Input value={name} onValueChange={setName} />
      </FormField>
      <FormField label="Email">
        <Input value={email} onValueChange={setEmail} type="email" />
      </FormField>
    </FormLayout>
  )
}
