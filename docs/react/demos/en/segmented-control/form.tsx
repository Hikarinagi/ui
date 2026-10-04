'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateField, Form, FormField, SegmentedControl, Text } from '@hina-ui/react'

const modes = [
  { label: 'Publish now', value: 'now' },
  { label: 'Schedule', value: 'scheduled' },
]

const schema = v.pipe(
  v.object({
    mode: v.picklist(['now', 'scheduled'], 'Pick how to publish'),
    publishAt: v.nullable(v.string()),
  }),
  v.forward(
    v.check(input => input.mode !== 'scheduled' || !!input.publishAt, 'Pick a publish date'),
    ['publishAt'],
  ),
)

export default function Demo() {
  const [values, setValues] = useState({
    mode: 'now' as string | number,
    publishAt: null as string | null,
  })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="mode" label="Publishing">
            <SegmentedControl
              value={values.mode}
              onValueChange={mode => setValues({ ...values, mode })}
              options={modes}
            />
          </FormField>
          <FormField name="publishAt" label="Publish date" disabled={values.mode !== 'scheduled'}>
            <DateField
              value={values.publishAt}
              onValueChange={publishAt => setValues({ ...values, publishAt })}
            />
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
