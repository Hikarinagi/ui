import { Banner, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner closable>
      Hina UI 1.2 已发布。
      <Link href="#" underline>
        查看更新说明
      </Link>
    </Banner>
  )
}
