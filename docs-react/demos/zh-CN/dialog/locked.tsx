'use client'

import { useState } from 'react'
import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function submit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="导入书库"
      description="导入过程中请不要关闭这个对话框。"
      locked={submitting}
      renderContent={() => (
        <Text>
          {submitting ? '正在导入，两秒后自动关闭。' : '点击开始导入之后对话框会锁定两秒。'}
        </Text>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" disabled={submitting} onClick={close}>
            取消
          </Button>
          <Button loading={submitting} onClick={submit}>
            开始导入
          </Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        导入
      </Button>
    </Dialog>
  )
}
