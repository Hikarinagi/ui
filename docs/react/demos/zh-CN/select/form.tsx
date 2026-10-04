'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Select, Text } from '@hina-ui/react'

const categories = [
  { label: '游戏', value: 'game' },
  { label: '小说', value: 'novel' },
  { label: '漫画', value: 'manga' },
]

const schema = v.object({
  category: v.pipe(v.string('请选择分类'), v.nonEmpty('请选择分类')),
})

export default function Demo() {
  const [values, setValues] = useState({ category: null as string | number | null | undefined })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="category" label="分类" required>
            <Select
              value={values.category}
              onValueChange={category => setValues({ ...values, category })}
              options={categories}
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
