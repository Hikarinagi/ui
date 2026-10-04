'use client'

import { useState } from 'react'
import {
  Button,
  Form,
  FormField,
  Input,
  PasswordInput,
  Text,
  type FormValidator,
} from '@hina-ui/react'

const rules: FormValidator = data => {
  const errors: Record<string, string> = {}
  const username = String(data.username ?? '')
  if (!username) errors.username = 'Enter a username'
  else if (!/^[a-z0-9_]{3,16}$/.test(username)) {
    errors.username = '3 to 16 lowercase letters, digits or underscores'
  }
  if (!data.password) errors.password = 'Enter a password'
  if (data.confirm !== data.password) errors.confirm = 'The passwords do not match'
  return errors
}

export default function Demo() {
  const [values, setValues] = useState({ username: '', password: '', confirm: '' })
  const [saved, setSaved] = useState('')

  function save() {
    setSaved(values.username)
  }

  return (
    <Form values={values} rules={rules} className="w-80" onSubmit={save}>
      <FormField name="username" label="Username" required>
        <Input
          value={values.username}
          onValueChange={username => setValues({ ...values, username })}
        />
      </FormField>
      <FormField name="password" label="Password" required>
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
      <Button type="submit" className="self-start">
        Sign up
      </Button>
      {saved && (
        <Text tone="muted" size="sm">
          Signed up: {saved}
        </Text>
      )}
    </Form>
  )
}
