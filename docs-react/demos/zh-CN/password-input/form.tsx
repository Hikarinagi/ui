'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, PasswordInput, Text } from '@hina-ui/react'

const schema = v.pipe(
  v.object({
    password: v.pipe(
      v.string('请输入密码'),
      v.minLength(8, '密码至少 8 位'),
      v.regex(/[0-9]/, '密码需要包含数字'),
    ),
    confirm: v.string('请再次输入密码'),
  }),
  v.forward(
    v.check(input => input.password === input.confirm, '两次输入的密码不一致'),
    ['confirm'],
  ),
)

export default function Demo() {
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [saved, setSaved] = useState(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(true)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="password" label="新密码" description="至少 8 位，包含数字" required>
            <PasswordInput
              value={values.password}
              onValueChange={password => setValues({ ...values, password })}
            />
          </FormField>
          <FormField name="confirm" label="确认密码" required>
            <PasswordInput
              value={values.confirm}
              onValueChange={confirm => setValues({ ...values, confirm })}
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            修改密码
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              密码已修改。
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
