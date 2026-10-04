import { Callout } from '@hina-ui/react'

export default function Demo() {
  return (
    <Callout tone="accent" title="阅读器支持双页" className="max-w-md">
      横屏时会自动切换为双页排版，也可以在阅读设置里固定为单页。
    </Callout>
  )
}
