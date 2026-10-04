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
    v.check(input => !input.pinned || input.title.trim().length > 0, '置顶的公告需要标题'),
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
          <FormField name="title" label="标题">
            <Input value={values.title} onValueChange={title => setValues({ ...values, title })} />
          </FormField>
          <FormField name="pinned">
            <Toggle
              value={values.pinned}
              onValueChange={pinned => setValues({ ...values, pinned })}
              variant="outline"
            >
              置顶
            </Toggle>
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            发布
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已发布：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
