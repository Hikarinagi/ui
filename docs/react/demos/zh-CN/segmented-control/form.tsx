'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateField, Form, FormField, SegmentedControl, Text } from '@hina-ui/react'

const modes = [
  { label: '立即发布', value: 'now' },
  { label: '定时发布', value: 'scheduled' },
]

const schema = v.pipe(
  v.object({
    mode: v.picklist(['now', 'scheduled'], '请选择发布方式'),
    publishAt: v.nullable(v.string()),
  }),
  v.forward(
    v.check(input => input.mode !== 'scheduled' || !!input.publishAt, '请选择发布日期'),
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
          <FormField name="mode" label="发布方式">
            <SegmentedControl
              value={values.mode}
              onValueChange={mode => setValues({ ...values, mode })}
              options={modes}
            />
          </FormField>
          <FormField name="publishAt" label="发布日期" disabled={values.mode !== 'scheduled'}>
            <DateField
              value={values.publishAt}
              onValueChange={publishAt => setValues({ ...values, publishAt })}
            />
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
