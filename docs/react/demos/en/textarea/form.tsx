'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Text, Textarea } from '@hina-ui/react'

const schema = v.object({
  review: v.pipe(
    v.string('Write a review'),
    v.trim(),
    v.minLength(20, 'At least 20 characters'),
    v.maxLength(500, 'At most 500 characters'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ review: '' })
  const [saved, setSaved] = useState(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(true)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="review" label="Review" description="20 to 500 characters" required>
            <Textarea
              value={values.review}
              onValueChange={review => setValues({ ...values, review })}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Post
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Review posted.
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
