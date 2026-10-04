import { Inline, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline as="nav" gap="lg" aria-label="页脚导航">
      <Link href="#">关于</Link>
      <Link href="#">帮助</Link>
      <Link href="#">条款</Link>
    </Inline>
  )
}
