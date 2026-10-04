'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Rating, Text } from '@hina-ui/react'

const schema = v.object({
  score: v.pipe(v.number(), v.minValue(1, 'Give it a rating first')),
})

export default function Demo() {
  const [values, setValues] = useState({ score: 0 })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="score" label="Rating" required>
            <Rating value={values.score} onValueChange={score => setValues({ ...values, score })} />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Submit review
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Submitted: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
