'use client'

import { useState } from 'react'
import * as v from 'valibot'
import {
  Button,
  Form,
  FormField,
  Input,
  SegmentedControl,
  Stack,
  type FormValidateOn,
} from '@hina-ui/react'

const modes = [
  { label: 'On submit', value: 'submit' },
  { label: 'On blur', value: 'blur' },
  { label: 'On change', value: 'change' },
]

const schema = v.object({
  name: v.pipe(v.string('Enter a nickname'), v.nonEmpty('Enter a nickname')),
  email: v.pipe(
    v.string('Enter an email'),
    v.nonEmpty('Enter an email'),
    v.email('The email is not valid'),
  ),
})

export default function Demo() {
  const [mode, setMode] = useState<string | number>('submit')
  const [values, setValues] = useState({ name: '', email: '' })

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <SegmentedControl
        value={mode}
        onValueChange={setMode}
        options={modes}
        aria-label="Validation timing"
      />
      <Form key={mode} values={values} rules={schema} validateOn={mode as FormValidateOn}>
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
      </Form>
    </Stack>
  )
}
