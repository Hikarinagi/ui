'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, PinInput, Text } from '@hina-ui/react'

const schema = v.object({
  code: v.pipe(v.string('请输入验证码'), v.length(6, '验证码是 6 位数字')),
})

export default function Demo() {
  const [values, setValues] = useState({ code: '' })
  const [saved, setSaved] = useState(false)

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(true)
  }

  return (
    <Form values={values} rules={schema} className="w-80" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField name="code" label="验证码" description="已发送到你的邮箱" required>
            <PinInput
              value={values.code}
              onValueChange={code => setValues({ ...values, code })}
              length={6}
              type="number"
              otp
            />
          </FormField>
          <Button type="submit" loading={submitting} className="self-start">
            验证
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              验证通过。
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
