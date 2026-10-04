'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, FormLayout, Input, Text } from '@hina-ui/react'

const schema = v.object({
  firstName: v.pipe(v.string('Enter a first name'), v.nonEmpty('Enter a first name')),
  lastName: v.pipe(v.string('Enter a last name'), v.nonEmpty('Enter a last name')),
  email: v.pipe(
    v.string('Enter an email'),
    v.nonEmpty('Enter an email'),
    v.email('The email is not valid'),
  ),
  phone: v.string(),
})

export default function Demo() {
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-full max-w-lg" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormLayout
            legend="Contact"
            description="A name and at least one way to reach you"
            columns={2}
          >
            <FormField name="firstName" label="First name" required>
              <Input
                value={values.firstName}
                onValueChange={firstName => setValues({ ...values, firstName })}
              />
            </FormField>
            <FormField name="lastName" label="Last name" required>
              <Input
                value={values.lastName}
                onValueChange={lastName => setValues({ ...values, lastName })}
              />
            </FormField>
            <FormField name="email" label="Email" required className="sm:col-span-2">
              <Input
                value={values.email}
                onValueChange={email => setValues({ ...values, email })}
                type="email"
              />
            </FormField>
            <FormField name="phone" label="Phone" className="sm:col-span-2">
              <Input
                value={values.phone}
                onValueChange={phone => setValues({ ...values, phone })}
                type="tel"
              />
            </FormField>
          </FormLayout>
          <Button type="submit" loading={submitting} className="self-start">
            Save
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Saved: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
