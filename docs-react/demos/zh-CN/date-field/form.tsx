'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, DateField, Form, FormField, Text } from '@hina-ui/react'

const today = new Date().toISOString().slice(0, 10)

const schema = v.object({
  birthday: v.pipe(
    v.string('请输入出生日期'),
    v.check(value => value <= today, '出生日期不能晚于今天'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState<{ birthday: string | null }>({ birthday: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="birthday" label="出生日期" required>
            <DateField
              value={values.birthday}
              onValueChange={birthday => setValues({ birthday })}
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
