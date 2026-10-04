'use client'

import { useRef, useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Text, type FormHandle } from '@hina-ui/react'

const schema = v.object({
  email: v.pipe(
    v.string('Enter an email'),
    v.nonEmpty('Enter an email'),
    v.email('The email is not valid'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ email: 'taken@example.com' })
  const form = useRef<FormHandle>(null)
  const [saved, setSaved] = useState('')

  async function save(data: Record<string, unknown>) {
    await new Promise(resolve => setTimeout(resolve, 600))
    if (data.email === 'taken@example.com') {
      form.current?.setErrors({ email: 'This email is already registered' })
      return
    }
    setSaved(String(data.email))
  }

  return (
    <Form ref={form} values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField
            name="email"
            label="Email"
            description="taken@example.com is rejected by the server"
          >
            <Input
              value={values.email}
              onValueChange={email => setValues({ ...values, email })}
              type="email"
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Sign up
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Signed up: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
