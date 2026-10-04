'use client'

import { useState } from 'react'
import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setOpen(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title="保存修改"
      description="保存期间面板不能关闭。"
      locked={saving}
      renderContent={() => <Text>点「保存」后一秒半内，拖动、Esc 与遮罩都不会关闭它。</Text>}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" disabled={saving} onClick={close}>
            取消
          </Button>
          <Button loading={saving} onClick={save}>
            保存
          </Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        打开
      </Button>
    </Sheet>
  )
}
