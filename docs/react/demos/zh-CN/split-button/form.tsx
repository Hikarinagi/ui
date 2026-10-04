'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { DropdownMenuItem, Form, FormField, Input, SplitButton, Text } from '@hina-ui/react'

const schema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(2, '标题至少需要 2 个字')),
})

export default function Demo() {
  const [values, setValues] = useState({ title: '' })
  const [result, setResult] = useState('')

  async function publish(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    setResult(`已发布：${(data as { title: string }).title}`)
  }
  function saveDraft() {
    setResult(`已保存草稿：${values.title.trim() || '未命名文章'}`)
  }

  return (
    <Form values={values} rules={schema} className="w-full max-w-sm" onSubmit={publish}>
      {({ submitting }) => (
        <>
          <FormField
            name="title"
            label="文章标题"
            description="发布前校验标题，保存草稿可以保留未完成内容。"
            required
          >
            <Input
              value={values.title}
              onValueChange={title => setValues({ ...values, title })}
              placeholder="填写标题"
            />
          </FormField>
          <SplitButton
            type="submit"
            loading={submitting}
            menuLabel="其他保存方式"
            className="self-start"
            renderContent={() => <DropdownMenuItem onSelect={saveDraft}>保存草稿</DropdownMenuItem>}
          >
            发布文章
          </SplitButton>
          {result && (
            <Text role="status" size="sm" tone="muted">
              {result}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
