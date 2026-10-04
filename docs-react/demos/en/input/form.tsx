'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Text } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(
    v.string('Enter a nickname'),
    v.nonEmpty('Enter a nickname'),
    v.minLength(2, 'At least 2 characters'),
    v.maxLength(12, 'At most 12 characters'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ name: '' })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="name" label="Nickname" description="2 to 12 characters" required>
            <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
          </FormField>
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
