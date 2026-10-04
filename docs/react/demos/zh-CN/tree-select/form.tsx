'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Text, TreeSelect, type TreeSelectValue } from '@hina-ui/react'
import { regions } from './data'

const schema = v.object({
  department: v.string('请选择地区'),
})

export default function Demo() {
  const [values, setValues] = useState({ department: null as TreeSelectValue })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="department" label="所在地区" required>
            <TreeSelect
              value={values.department}
              onValueChange={department => setValues({ ...values, department })}
              items={regions}
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
