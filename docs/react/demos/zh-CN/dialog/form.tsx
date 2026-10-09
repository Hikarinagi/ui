'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Dialog, Form, FormField, Input } from '@hina-ui/react'

const schema = v.object({
  name: v.pipe(v.string('请输入名称'), v.nonEmpty('请输入名称')),
  email: v.pipe(v.string('请输入邮箱'), v.nonEmpty('请输入邮箱'), v.email('邮箱格式不正确')),
})

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({ name: '星见书音', email: 'shion@example.com' })

  async function save() {
    await new Promise(resolve => setTimeout(resolve, 1500))
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="编辑资料"
      description="保存期间对话框锁定，完成后关闭。"
      renderContent={() => (
        <Form id="profile-form" values={values} rules={schema} onSubmit={save}>
          <FormField name="name" label="名称">
            <Input value={values.name} onValueChange={name => setValues({ ...values, name })} />
          </FormField>
          <FormField name="email" label="邮箱">
            <Input
              value={values.email}
              onValueChange={email => setValues({ ...values, email })}
              type="email"
            />
          </FormField>
        </Form>
      )}
      renderFooter={({ close, submitting }) => (
        <>
          <Button variant="soft" tone="neutral" disabled={submitting} onClick={close}>
            取消
          </Button>
          <Button type="submit" form="profile-form" loading={submitting}>
            保存
          </Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        编辑资料
      </Button>
    </Dialog>
  )
}
