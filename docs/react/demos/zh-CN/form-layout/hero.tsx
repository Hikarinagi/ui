'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Form, FormField, FormLayout, Input, Text } from '@hina-ui/react'

const schema = v.object({
  lastName: v.pipe(v.string('请输入姓氏'), v.nonEmpty('请输入姓氏')),
  firstName: v.pipe(v.string('请输入名字'), v.nonEmpty('请输入名字')),
  email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
  phone: v.string(),
})

export default function Demo() {
  const [values, setValues] = useState({ lastName: '', firstName: '', email: '', phone: '' })
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved(JSON.stringify(data))
  }

  return (
    <Form values={values} rules={schema} className="w-full max-w-lg" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormLayout legend="联系人" description="姓名与至少一种联系方式" columns={2}>
            <FormField name="lastName" label="姓" required>
              <Input
                value={values.lastName}
                onValueChange={lastName => setValues({ ...values, lastName })}
              />
            </FormField>
            <FormField name="firstName" label="名" required>
              <Input
                value={values.firstName}
                onValueChange={firstName => setValues({ ...values, firstName })}
              />
            </FormField>
            <FormField name="email" label="邮箱" required className="sm:col-span-2">
              <Input
                value={values.email}
                onValueChange={email => setValues({ ...values, email })}
                type="email"
              />
            </FormField>
            <FormField name="phone" label="电话" className="sm:col-span-2">
              <Input
                value={values.phone}
                onValueChange={phone => setValues({ ...values, phone })}
                type="tel"
              />
            </FormField>
          </FormLayout>
          <Button type="submit" loading={submitting} className="self-start">
            保存
          </Button>
          {saved && (
            <Text tone="muted" size="sm">
              已保存：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
