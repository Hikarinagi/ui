'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Text, TimeField } from '@hina-ui/react'

const schema = v.object({
  opensAt: v.pipe(
    v.string('请填写开门时间'),
    v.check(value => value >= '06:00', '开门不早于 06:00'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState<{ opensAt: string | null }>({ opensAt: null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="opensAt" label="开门时间" required>
            <TimeField value={values.opensAt} onValueChange={opensAt => setValues({ opensAt })} />
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
