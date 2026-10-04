'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, RadioGroup, Text } from '@hina-ui/react'

const options = [
  { label: 'Public', value: 'public', description: 'Visible to everyone' },
  { label: 'Followers', value: 'followers', description: 'Visible to people who follow you' },
  { label: 'Private', value: 'private', description: 'Visible only to you' },
]

const schema = v.object({
  visibility: v.string('Pick who can see it'),
})

export default function Demo() {
  const [values, setValues] = useState({ visibility: null as string | number | null | undefined })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="visibility" label="Visibility" required>
            <RadioGroup
              value={values.visibility}
              onValueChange={visibility => setValues({ ...values, visibility })}
              options={options}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Publish
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Published: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
