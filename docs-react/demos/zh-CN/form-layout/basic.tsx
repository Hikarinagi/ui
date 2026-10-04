'use client'

import { useState } from 'react'
import { FormField, FormLayout, Input } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <FormLayout legend="账号" description="登录时使用" className="w-80">
      <FormField label="用户名">
        <Input value={name} onValueChange={setName} />
      </FormField>
      <FormField label="邮箱">
        <Input value={email} onValueChange={setEmail} type="email" />
      </FormField>
    </FormLayout>
  )
}
