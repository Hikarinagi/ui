'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, RadioGroup, Text } from '@hina-ui/react'

const options = [
  { label: '公开', value: 'public', description: '所有人可见' },
  { label: '仅关注者', value: 'followers', description: '关注你的人可见' },
  { label: '私密', value: 'private', description: '只有自己可见' },
]

const schema = v.object({
  visibility: v.string('请选择可见范围'),
})

export default function Demo() {
  const [values, setValues] = useState({ visibility: null as string | number | null | undefined })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="visibility" label="可见范围" required>
            <RadioGroup
              value={values.visibility}
              onValueChange={visibility => setValues({ ...values, visibility })}
              options={options}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            发布
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已发布：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
