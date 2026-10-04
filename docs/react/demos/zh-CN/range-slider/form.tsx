'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, RangeSlider, Text } from '@hina-ui/react'

const schema = v.object({
  budget: v.pipe(
    v.tuple([v.number(), v.number()]),
    v.check(([low, high]) => high - low >= 200, '预算区间至少相差 200 元'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ budget: [300, 400] as [number, number] })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="budget" label="预算" description="拖动两端设定区间">
            <RangeSlider
              value={values.budget}
              onValueChange={budget => setValues({ ...values, budget })}
              min={0}
              max={1000}
              step={50}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            保存
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已保存：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
