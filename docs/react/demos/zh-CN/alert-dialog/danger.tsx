import { AlertDialog, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <AlertDialog
      title="注销账号？"
      description="账号与所有数据会在 30 天后永久删除，期间登录即可撤销。"
      tone="danger"
      confirmText="注销"
    >
      <Button variant="outline" tone="danger">
        注销账号
      </Button>
    </AlertDialog>
  )
}
