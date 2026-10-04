import { Alert } from '@hina-ui/react'

export default function Demo() {
  return (
    <Alert tone="warning" title="登录状态即将过期" className="w-full max-w-xl">
      请在五分钟内保存正在编辑的内容，否则需要重新登录。
    </Alert>
  )
}
