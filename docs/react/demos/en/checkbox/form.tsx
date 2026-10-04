'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Checkbox, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  agreed: v.literal(true, 'Please read and accept the terms first'),
})

export default function Demo() {
  const [values, setValues] = useState({ agreed: false as boolean | 'indeterminate' })
  const [saved, setSaved] = useState(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(true)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="agreed">
            <Checkbox
              checked={values.agreed}
              onCheckedChange={agreed => setValues({ ...values, agreed })}
            >
              I have read and accept the terms of service
            </Checkbox>
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Sign up
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Signed up.
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
