'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateTimePicker, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  startsAt: v.string('请选择开始时间'),
})

export default function Demo() {
  const [values, setValues] = useState<{ startsAt: string | null }>({ startsAt: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="startsAt" label="开始时间" required>
            <DateTimePicker
              value={values.startsAt}
              onValueChange={startsAt => setValues({ startsAt })}
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
