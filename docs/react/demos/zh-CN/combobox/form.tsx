'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Combobox, Form, FormField, Text } from '@hina-ui/react'

const cities = [
  { label: '东京', value: 'tokyo' },
  { label: '大阪', value: 'osaka' },
  { label: '京都', value: 'kyoto' },
  { label: '札幌', value: 'sapporo' },
  { label: '福冈', value: 'fukuoka' },
]

const schema = v.object({
  city: v.pipe(v.string('请选择城市'), v.nonEmpty('请选择城市')),
})

export default function Demo() {
  const [values, setValues] = useState({ city: null as string | number | null })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="city" label="所在城市" required>
            <Combobox
              value={values.city}
              onValueChange={city => setValues({ ...values, city: city ?? null })}
              options={cities}
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
