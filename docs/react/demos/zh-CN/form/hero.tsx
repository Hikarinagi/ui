'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Select, Switch, Text, Textarea } from '@hina-ui/react'

const schema = v.object({
  title: v.pipe(
    v.string('请输入标题'),
    v.nonEmpty('请输入标题'),
    v.maxLength(20, '标题不超过 20 个字'),
  ),
  category: v.pipe(v.string('请选择分类'), v.nonEmpty('请选择分类')),
  summary: v.pipe(v.string('请输入简介'), v.maxLength(80, '简介不超过 80 个字')),
  published: v.boolean('请选择是否公开'),
})

const categories = [
  { label: '游戏', value: 'game' },
  { label: '小说', value: 'novel' },
  { label: '漫画', value: 'manga' },
]

export default function Demo() {
  const [values, setValues] = useState({
    title: '',
    category: null as string | number | null | undefined,
    summary: '',
    published: true,
  })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="title" label="标题" required>
            <Input
              value={values.title}
              onValueChange={title => setValues({ ...values, title })}
              placeholder="作品名称"
            />
          </FormField>
          <FormField name="category" label="分类" required>
            <Select
              value={values.category}
              onValueChange={category => setValues({ ...values, category })}
              options={categories}
            />
          </FormField>
          <FormField name="summary" label="简介" description="不超过 80 个字">
            <Textarea
              value={values.summary}
              onValueChange={summary => setValues({ ...values, summary })}
            />
          </FormField>
          <FormField name="published">
            <Switch
              checked={values.published}
              onCheckedChange={published => setValues({ ...values, published })}
            >
              公开显示
            </Switch>
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            提交
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已提交：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
