'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, PasswordInput, Text } from '@hina-ui/react'

const schema = v.pipe(
  v.object({
    password: v.pipe(
      v.string('Enter a password'),
      v.minLength(8, 'At least 8 characters'),
      v.regex(/[0-9]/, 'Include at least one digit'),
    ),
    confirm: v.string('Enter the password again'),
  }),
  v.forward(
    v.check(input => input.password === input.confirm, 'The passwords do not match'),
    ['confirm'],
  ),
)

export default function Demo() {
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [saved, setSaved] = useState(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(true)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField
            name="password"
            label="New password"
            description="At least 8 characters with a digit"
            required
          >
            <PasswordInput
              value={values.password}
              onValueChange={password => setValues({ ...values, password })}
            />
          </FormField>
          <FormField name="confirm" label="Confirm password" required>
            <PasswordInput
              value={values.confirm}
              onValueChange={confirm => setValues({ ...values, confirm })}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Change password
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Password changed.
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
