'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Select, Text } from '@hina-ui/react'

const categories = [
  { label: 'Game', value: 'game' },
  { label: 'Novel', value: 'novel' },
  { label: 'Manga', value: 'manga' },
]

const schema = v.object({
  category: v.pipe(v.string('Pick a category'), v.nonEmpty('Pick a category')),
})

export default function Demo() {
  const [values, setValues] = useState({ category: null as string | number | null | undefined })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="category" label="Category" required>
            <Select
              value={values.category}
              onValueChange={category => setValues({ ...values, category })}
              options={categories}
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
