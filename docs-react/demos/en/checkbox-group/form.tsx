'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, CheckboxGroup, Form, FormField, Text } from '@hina-ui/react'

const options = [
  { label: 'Games', value: 'game' },
  { label: 'Novels', value: 'novel' },
  { label: 'Manga', value: 'manga' },
  { label: 'Anime', value: 'anime' },
]

const schema = v.object({
  interests: v.pipe(
    v.array(v.string('Pick your interests')),
    v.minLength(1, 'Pick at least one'),
    v.maxLength(2, 'Pick at most two'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ interests: [] as Array<string | number> })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="interests" label="Interests" description="One or two of them" required>
            <CheckboxGroup
              value={values.interests}
              onValueChange={interests => setValues({ ...values, interests })}
              options={options}
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
