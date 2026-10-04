'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Text, Toggle } from '@hina-ui/react'

const schema = v.pipe(
  v.object({
    pinned: v.boolean(),
    title: v.string(),
  }),
  v.forward(
    v.check(
      input => !input.pinned || input.title.trim().length > 0,
      'A pinned announcement needs a title',
    ),
    ['title'],
  ),
)

export default function Demo() {
  const [values, setValues] = useState({ pinned: true, title: '' })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="title" label="Title">
            <Input value={values.title} onValueChange={title => setValues({ ...values, title })} />
          </FormField>
          <FormField name="pinned">
            <Toggle
              value={values.pinned}
              onValueChange={pinned => setValues({ ...values, pinned })}
              variant="outline"
            >
              Pin
            </Toggle>
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            Publish
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              Published: {saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
