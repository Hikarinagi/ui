'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, Input, Text } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('请输入昵称'), v.nonEmpty('请输入昵称')),
  email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
})

export default function Demo() {
  const [values, setValues] = useState({ name: '', email: '' })
  const [saved, setSaved] = useState('')

  function save(data: unknown) {
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      <FormField name="name" label="昵称" required>
        <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
      </FormField>
      <FormField name="email" label="邮箱" required>
        <Input
          value={values.email}
          onValueChange={email => setValues({ ...values, email })}
          type="email"
        />
      </FormField>
      <Button type="submit" className="self-start">
        提交
      </Button>
      {saved && (
        <Text tone="muted" size="sm">
          已提交：{saved}
        </Text>
      )}
    </Form>
  )
}
