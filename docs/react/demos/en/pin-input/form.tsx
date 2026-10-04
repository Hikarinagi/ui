'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, PinInput, Text } from '@hina-ui/react'

const schema = v.object({
  code: v.pipe(v.string('Enter the code'), v.length(6, 'The code is 6 digits')),
})

export default function Demo() {
  const [values, setValues] = useState({ code: '' })
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
            name="code"
            label="Verification code"
            description="Sent to your email"
            required
          >
            <PinInput
              value={values.code}
              onValueChange={code => setValues({ ...values, code })}
              length={6}
              type="number"
              otp
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Verify
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Verified.
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
