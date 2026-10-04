'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Text, Textarea } from '@hina-ui/react'

const schema = v.object({
  review: v.pipe(
    v.string('请写下评价'),
    v.trim(),
    v.minLength(20, '评价至少 20 个字'),
    v.maxLength(500, '评价不超过 500 个字'),
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
          <FormField name="review" label="评价" description="20 到 500 个字" required>
            <Textarea
              value={values.review}
              onValueChange={review => setValues({ ...values, review })}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            发表
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              评价已发表。
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
