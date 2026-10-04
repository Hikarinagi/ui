'use client'

import { useState } from 'react'
import { Editable, FormField, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('创作者工作台')
  const [fail, setFail] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(value: string) {
    setSaved(false)
    if (!value.trim()) throw new Error('工作区名称不能为空')
    await new Promise(resolve => setTimeout(resolve, 800))
    if (fail) throw new Error('暂时无法保存，请关闭模拟失败后重试')
    setSaved(true)
  }

  return (
    <Stack className="w-full max-w-sm">
      <FormField label="工作区名称" description="保存完成前保留编辑态，失败后可继续修改或重试。">
        <Editable value={name} onValueChange={setName} onSave={save} submitMode="enter" />
      </FormField>
      <FormField label="模拟保存失败" orientation="horizontal">
        <Switch checked={fail} onCheckedChange={setFail} />
      </FormField>
      {saved && (
        <Text role="status" size="sm" tone="muted">
          工作区名称已保存。
        </Text>
      )}
    </Stack>
  )
}
