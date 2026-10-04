'use client'

import { useRef, useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Text, type FormHandle } from '@hina-ui/react'

const schema = v.object({
  email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
})

export default function Demo() {
  const [values, setValues] = useState({ email: 'taken@example.com' })
  const form = useRef<FormHandle>(null)
  const [saved, setSaved] = useState('')

  async function save(data: Record<string, unknown>) {
    await new Promise(resolve => setTimeout(resolve, 600))
    if (data.email === 'taken@example.com') {
      form.current?.setErrors({ email: '该邮箱已被注册' })
      return
    }
    setSaved(String(data.email))
  }

  return (
    <Form ref={form} values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="email" label="邮箱" description="taken@example.com 会被服务端拒绝">
            <Input
              value={values.email}
              onValueChange={email => setValues({ ...values, email })}
              type="email"
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            注册
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已注册：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
