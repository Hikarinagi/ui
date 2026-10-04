'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, MultiSelect, Text } from '@hina-ui/react'

const genres = [
  { label: 'Romance', value: 'romance' },
  { label: 'Mystery', value: 'mystery' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Slice of life', value: 'slice-of-life' },
  { label: 'Science fiction', value: 'sci-fi' },
]

const schema = v.object({
  genres: v.pipe(
    v.array(v.string('Pick genres')),
    v.minLength(1, 'Pick at least one genre'),
    v.maxLength(3, 'Pick at most three genres'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ genres: [] as Array<string | number> })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="genres" label="Genres" description="One to three of them" required>
            <MultiSelect
              value={values.genres}
              onValueChange={next => setValues({ ...values, genres: next })}
              options={genres}
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
