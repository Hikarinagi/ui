'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Listbox, Text, type ListboxValue } from '@hina-ui/react'

const plans = [
  { label: '免费版', value: 'free' },
  { label: '标准版', value: 'standard' },
  { label: '专业版', value: 'pro' },
]

const schema = v.object({
  plan: v.string('请选择套餐'),
})

export default function Demo() {
  const [values, setValues] = useState({ plan: null as ListboxValue })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="plan" label="套餐" required>
            <Listbox
              value={values.plan}
              onValueChange={plan => setValues({ ...values, plan })}
              options={plans}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            订阅
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已订阅：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
