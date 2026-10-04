'use client'

import { useRef, useState } from 'react'
import * as v from 'valibot'
import { Autocomplete, Button, Form, FormField, Text, type FormHandle } from '@hina-ui/react'

const candidates = ['Vue', 'React', 'Svelte', 'Solid', 'Angular']

const schema = v.object({
  framework: v.pipe(v.string(), v.trim(), v.nonEmpty('请输入框架名称')),
})

export default function Demo() {
  const form = useRef<FormHandle>(null)
  const [values, setValues] = useState({ framework: '' })
  const [saved, setSaved] = useState('')
  const options = candidates
    .filter(label => label.toLowerCase().includes(values.framework.toLowerCase()))
    .map(label => ({ value: label, label }))

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved((data as { framework: string }).framework)
  }

  return (
    <Form ref={form} values={values} rules={schema} className="w-full max-w-sm" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField
            name="framework"
            label="主要框架"
            description="选择建议，也可以填写其他框架。"
            required
          >
            <Autocomplete
              value={values.framework}
              onValueChange={framework => setValues({ ...values, framework })}
              options={options}
              name="framework"
              placeholder="选择或输入框架名称"
              onSubmit={() => void form.current?.submit()}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            保存
          </Button>
          {saved && (
            <Text role="status" tone="muted" size="sm">
              已保存：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
