'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DatePicker, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  released: v.string('Pick a release date'),
})

export default function Demo() {
  const [values, setValues] = useState<{ released: string | null }>({ released: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="released" label="Release date" required>
            <DatePicker
              value={values.released}
              onValueChange={released => setValues({ released })}
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
