'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Text } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('Enter a nickname'), v.nonEmpty('Enter a nickname')),
  email: v.pipe(
    v.string('Enter an email'),
    v.nonEmpty('Enter an email'),
    v.email('The email is not valid'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ name: '', email: '' })
  const [saved, setSaved] = useState('')

  function save(data: unknown) {
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      <FormField name="name" label="Nickname" required>
        <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
      </FormField>
      <FormField name="email" label="Email" required>
        <Input
          value={values.email}
          onValueChange={email => setValues({ ...values, email })}
          type="email"
        />
      </FormField>
      <Button type="submit" className="self-start">
        Submit
      </Button>
      {saved && (
        <Text tone="muted" size="sm">
          Submitted: {saved}
        </Text>
      )}
    </Form>
  )
}
