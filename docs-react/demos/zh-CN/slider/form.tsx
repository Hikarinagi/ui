'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Slider, Text } from '@hina-ui/react'

const schema = v.object({
  quality: v.pipe(v.number(), v.minValue(60, '画质不能低于 60')),
})

export default function Demo() {
  const [values, setValues] = useState({ quality: 40 })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="quality" label="导出画质" description="60 以下的画质会明显失真">
            <Slider
              value={values.quality}
              onValueChange={quality => setValues({ ...values, quality: quality ?? 0 })}
              min={0}
              max={100}
              step={5}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            导出
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已导出：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
