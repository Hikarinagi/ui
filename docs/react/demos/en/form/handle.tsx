'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Stack, useFormHandle } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('Enter a name'), v.nonEmpty('Enter a name')),
})

function save() {
  return new Promise(resolve => setTimeout(resolve, 1500))
}

export default function Demo() {
  const [values, setValues] = useState({ name: 'Hoshimi Shion' })
  const form = useFormHandle()

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Form form={form} values={values} rules={schema} onSubmit={save}>
        <FormField name="name" label="Name">
          <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
        </FormField>
      </Form>
      <Button loading={form.submitting} className="self-start" onClick={form.submit}>
        Save
      </Button>
    </Stack>
  )
}
