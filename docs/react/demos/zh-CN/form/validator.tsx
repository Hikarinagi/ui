'use client'

import { useState } from 'react'
import {
  Button,
  Form,
  FormField,
  Input,
  PasswordInput,
  Text,
  type FormValidator,
} from '@hina-ui/react'

const rules: FormValidator = data => {
  const errors: Record<string, string> = {}
  const username = String(data.username ?? '')
  if (!username) errors.username = '请输入用户名'
  else if (!/^[a-z0-9_]{3,16}$/.test(username)) {
    errors.username = '3 到 16 位小写字母、数字或者下划线'
  }
  if (!data.password) errors.password = '请输入密码'
  if (data.confirm !== data.password) errors.confirm = '两次输入的密码不一致'
  return errors
}

export default function Demo() {
  const [values, setValues] = useState({ username: '', password: '', confirm: '' })
  const [saved, setSaved] = useState('')

  function save() {
    setSaved(values.username)
  }

  return (
    <Form values={values} rules={rules} className="w-80" onSubmit={save}>
      <FormField name="username" label="用户名" required>
        <Input
          value={values.username}
          onValueChange={username => setValues({ ...values, username })}
        />
      </FormField>
      <FormField name="password" label="密码" required>
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
      <Button type="submit" className="self-start">
        注册
      </Button>
      {saved && (
        <Text tone="muted" size="sm">
          已注册：{saved}
        </Text>
      )}
    </Form>
  )
}
