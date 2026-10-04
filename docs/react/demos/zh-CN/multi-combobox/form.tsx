'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, MultiCombobox, Text } from '@hina-ui/react'

const tags = [
  { label: '恋爱', value: 'romance' },
  { label: '恋爱喜剧', value: 'rom-com' },
  { label: '校园', value: 'school' },
  { label: '异世界', value: 'isekai' },
  { label: '治愈', value: 'healing' },
  { label: '悬疑', value: 'mystery' },
]

const schema = v.object({
  tags: v.pipe(
    v.array(v.string('请选择标签')),
    v.minLength(1, '至少选择一个标签'),
    v.maxLength(3, '最多选择三个标签'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ tags: [] as Array<string | number> })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="tags" label="标签" description="一到三个" required>
            <MultiCombobox
              value={values.tags}
              onValueChange={next => setValues({ ...values, tags: next })}
              options={tags}
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
