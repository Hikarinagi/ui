'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input, Switch } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('Hina')
  const [email, setEmail] = useState('hello@example.com')
  const [sync, setSync] = useState(true)

  return (
    <FormLayout
      legend="个人资料设置"
      orientation="responsive"
      labelWidth="9rem"
      descriptionPlacement="label"
      className="w-full"
    >
      <FormField label="显示名称" description="显示在你的公开个人资料中。">
        <Input value={name} onValueChange={setName} />
      </FormField>
      <FormField
        label="邮箱地址"
        description="使用可以接收通知的邮箱地址。"
        descriptionPlacement="control"
      >
        <Input value={email} onValueChange={setEmail} type="email" />
      </FormField>
      <FormField>
        <Switch
          checked={sync}
          onCheckedChange={setSync}
          controlPlacement="end"
          block
          description="在其他设备上继续上次的阅读进度。"
        >
          同步阅读进度
        </Switch>
      </FormField>
    </FormLayout>
  )
}
