import { CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CopyButton text="ssh://git@example.com/hina.git" label="复制仓库地址" tooltip />
      <CopyButton text="hina-2f9c41" label="复制订单编号" tooltip />
    </Inline>
  )
}
