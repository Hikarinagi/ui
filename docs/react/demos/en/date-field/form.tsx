'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateField, Form, FormField, Text } from '@hina-ui/react'

const today = new Date().toISOString().slice(0, 10)

const schema = v.object({
  birthday: v.pipe(
    v.string('Enter your date of birth'),
    v.check(value => value <= today, 'The date of birth cannot be in the future'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState<{ birthday: string | null }>({ birthday: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="birthday" label="Date of birth" required>
            <DateField
              value={values.birthday}
              onValueChange={birthday => setValues({ birthday })}
            />
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
