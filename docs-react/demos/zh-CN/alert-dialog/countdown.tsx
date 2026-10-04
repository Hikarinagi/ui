import { AlertDialog, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <AlertDialog
      title="确认操作？"
      description="倒计时结束后，确认按钮可以点击。"
      tone="danger"
      confirmText="确认"
      confirmDelay={3}
    >
      <Button variant="outline" tone="neutral">
        确认倒计时
      </Button>
    </AlertDialog>
  )
}
