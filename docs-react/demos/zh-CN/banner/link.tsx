import { Banner, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner tone="info">
      当前浏览的是 1.x 版本的文档。
      <Link href="#" underline>
        前往最新版本
      </Link>
    </Banner>
  )
}
