'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DatePicker, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  released: v.string('请选择发售日期'),
})

export default function Demo() {
  const [values, setValues] = useState<{ released: string | null }>({ released: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="released" label="发售日期" required>
            <DatePicker
              value={values.released}
              onValueChange={released => setValues({ released })}
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
