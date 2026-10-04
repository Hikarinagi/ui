'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input } from '@hina-ui/react'

export default function Demo() {
  const [values, setValues] = useState({ province: '', city: '', district: '', street: '' })

  return (
    <FormLayout legend="收货地址" columns={3} className="w-full max-w-lg">
      <FormField label="省">
        <Input
          value={values.province}
          onValueChange={province => setValues({ ...values, province })}
        />
      </FormField>
      <FormField label="市">
        <Input value={values.city} onValueChange={city => setValues({ ...values, city })} />
      </FormField>
      <FormField label="区">
        <Input
          value={values.district}
          onValueChange={district => setValues({ ...values, district })}
        />
      </FormField>
      <FormField label="详细地址" className="sm:col-span-3">
        <Input value={values.street} onValueChange={street => setValues({ ...values, street })} />
      </FormField>
    </FormLayout>
  )
}
