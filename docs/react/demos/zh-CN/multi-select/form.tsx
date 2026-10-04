'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, MultiSelect, Text } from '@hina-ui/react'

const genres = [
  { label: '恋爱', value: 'romance' },
  { label: '悬疑', value: 'mystery' },
  { label: '奇幻', value: 'fantasy' },
  { label: '日常', value: 'slice-of-life' },
  { label: '科幻', value: 'sci-fi' },
]

const schema = v.object({
  genres: v.pipe(
    v.array(v.string('请选择题材')),
    v.minLength(1, '至少选择一个题材'),
    v.maxLength(3, '最多选择三个题材'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ genres: [] as Array<string | number> })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="genres" label="题材" description="一到三个" required>
            <MultiSelect
              value={values.genres}
              onValueChange={next => setValues({ ...values, genres: next })}
              options={genres}
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
