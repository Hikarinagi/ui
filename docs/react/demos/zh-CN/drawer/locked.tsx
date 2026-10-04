'use client'

import { useState } from 'react'
import { Button, Drawer, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      title="编辑标签"
      description="保存过程中请不要关闭这个抽屉。"
      locked={saving}
      renderContent={() => (
        <Text>{saving ? '正在保存，两秒后自动关闭。' : '点击保存之后抽屉会锁定两秒。'}</Text>
      )}
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
        编辑标签
      </Button>
    </Drawer>
  )
}
