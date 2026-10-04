'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateRangePicker, Form, FormField, Text, type DateRangeValue } from '@hina-ui/react'

const schema = v.object({
  trip: v.pipe(
    v.nullable(v.object({ start: v.nullable(v.string()), end: v.nullable(v.string()) })),
    v.check(value => !!value?.start && !!value?.end, '请选择完整的出行日期'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState<{ trip: DateRangeValue | null }>({ trip: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="trip" label="出行日期" required>
            <DateRangePicker value={values.trip} onValueChange={trip => setValues({ trip })} />
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
