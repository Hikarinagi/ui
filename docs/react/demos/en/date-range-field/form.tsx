'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateRangeField, Form, FormField, Text, type DateRangeValue } from '@hina-ui/react'

const schema = v.object({
  period: v.pipe(
    v.nullable(v.object({ start: v.nullable(v.string()), end: v.nullable(v.string()) })),
    v.check(value => !!value?.start && !!value?.end, 'Fill in the whole event period'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState<{ period: DateRangeValue | null }>({ period: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="period" label="Event period" required>
            <DateRangeField value={values.period} onValueChange={period => setValues({ period })} />
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
