'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, SearchInput, Text } from '@hina-ui/react'

const schema = v.object({
  keyword: v.pipe(
    v.string('请输入关键字'),
    v.trim(),
    v.nonEmpty('请输入关键字'),
    v.minLength(2, '关键字至少 2 个字'),
  ),
})

export default function Demo() {
  const [values, setValues] = useState({ keyword: '' })
  const [result, setResult] = useState('')

  async function search(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setResult((data as { keyword: string }).keyword)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={search}>
      {({ submitting }) => (
        <>
          <FormField name="keyword" label="搜索作品">
            <SearchInput
              value={values.keyword}
              onValueChange={keyword => setValues({ ...values, keyword })}
              placeholder="作品名或者别名"
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            搜索
          </Button>
          {result && (
            <Text tone="muted" size="sm">
              正在搜索「{result}」的结果。
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
