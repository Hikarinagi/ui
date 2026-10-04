'use client'

import { useState } from 'react'
import * as v from 'valibot'
import { Button, Editable, Form, FormField, Text } from '@hina-ui/react'

const schema = v.object({
  displayName: v.pipe(v.string(), v.trim(), v.minLength(2, '显示名称至少需要 2 个字')),
})

export default function Demo() {
  const [values, setValues] = useState({ displayName: '' })
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState('')

  async function save(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 600))
    setSaved((data as { displayName: string }).displayName)
  }

  return (
    <Form values={values} rules={schema} className="w-full max-w-sm" onSubmit={save}>
      {({ submitting }) => (
        <>
          <FormField
            name="displayName"
            label="显示名称"
            description="先确认字段修改，再保存整份资料。"
            required
          >
            <Editable
              value={values.displayName}
              onValueChange={displayName => setValues({ ...values, displayName })}
              editing={editing}
              onEditingChange={setEditing}
              name="displayName"
              placeholder="填写显示名称"
            />
          </FormField>
          <Button type="submit" loading={submitting} disabled={editing} className="self-start">
            保存资料
          </Button>
          {saved && (
            <Text role="status" size="sm" tone="muted">
              已保存：{saved}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
