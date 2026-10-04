'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, MultiCombobox, Text } from '@hina-ui/react'

const tags = [
  { label: 'Romance', value: 'romance' },
  { label: 'Romantic comedy', value: 'rom-com' },
  { label: 'School', value: 'school' },
  { label: 'Isekai', value: 'isekai' },
  { label: 'Healing', value: 'healing' },
  { label: 'Mystery', value: 'mystery' },
]

const schema = v.object({
  tags: v.pipe(
    v.array(v.string('Pick tags')),
    v.minLength(1, 'Pick at least one tag'),
    v.maxLength(3, 'Pick at most three tags'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ tags: [] as Array<string | number> })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="tags" label="Tags" description="One to three of them" required>
            <MultiCombobox
              value={values.tags}
              onValueChange={next => setValues({ ...values, tags: next })}
              options={tags}
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
