'use client'

import { useState } from 'react'
import * as v from 'valibot'
import {
  Button,
  Form,
  FormField,
  Input,
  SegmentedControl,
  Stack,
  type FormValidateOn,
} from '@hina-ui/react'

const modes = [
  { label: '提交时', value: 'submit' },
  { label: '失去焦点', value: 'blur' },
  { label: '值变化', value: 'change' },
]

const schema = v.object({
  name: v.pipe(v.string('请输入昵称'), v.nonEmpty('请输入昵称')),
  email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
})

export default function Demo() {
  const [mode, setMode] = useState<string | number>('submit')
  const [values, setValues] = useState({ name: '', email: '' })

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <SegmentedControl
        value={mode}
        onValueChange={setMode}
        options={modes}
        aria-label="校验时机"
      />
      <Form key={mode} values={values} rules={schema} validateOn={mode as FormValidateOn}>
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
      </Form>
    </Stack>
  )
}
