'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Combobox, Form, FormField, Text } from '@hina-ui/react'

const cities = [
  { label: 'Tokyo', value: 'tokyo' },
  { label: 'Osaka', value: 'osaka' },
  { label: 'Kyoto', value: 'kyoto' },
  { label: 'Sapporo', value: 'sapporo' },
  { label: 'Fukuoka', value: 'fukuoka' },
]

const schema = v.object({
  city: v.pipe(v.string('Pick a city'), v.nonEmpty('Pick a city')),
})

export default function Demo() {
  const [values, setValues] = useState({ city: null as string | number | null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="city" label="City" required>
            <Combobox
              value={values.city}
              onValueChange={city => setValues({ ...values, city: city ?? null })}
              options={cities}
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
