'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input } from '@hina-ui/react'

export default function Demo() {
  const [values, setValues] = useState({ city: '', state: '', zip: '', street: '' })

  return (
    <FormLayout legend="Shipping address" columns={3} className="w-full max-w-lg">
      <FormField label="City">
        <Input value={values.city} onValueChange={city => setValues({ ...values, city })} />
      </FormField>
      <FormField label="State">
        <Input value={values.state} onValueChange={state => setValues({ ...values, state })} />
      </FormField>
      <FormField label="ZIP">
        <Input value={values.zip} onValueChange={zip => setValues({ ...values, zip })} />
      </FormField>
      <FormField label="Street address" className="sm:col-span-3">
        <Input value={values.street} onValueChange={street => setValues({ ...values, street })} />
      </FormField>
    </FormLayout>
  )
}
