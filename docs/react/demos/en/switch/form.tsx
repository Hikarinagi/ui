'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Switch, Text } from '@hina-ui/react'

const schema = v.pipe(
  v.object({
    isPublic: v.boolean(),
    summary: v.string(),
  }),
  v.forward(
    v.check(
      input => !input.isPublic || input.summary.trim().length > 0,
      'A public work needs a summary',
    ),
    ['summary'],
  ),
)

export default function Demo() {
  const [values, setValues] = useState({ isPublic: true, summary: '' })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="isPublic">
            <Switch
              checked={values.isPublic}
              onCheckedChange={isPublic => setValues({ ...values, isPublic })}
            >
              Public
            </Switch>
          </FormField>
          <FormField name="summary" label="Summary">
            <Input
              value={values.summary}
              onValueChange={summary => setValues({ ...values, summary })}
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
