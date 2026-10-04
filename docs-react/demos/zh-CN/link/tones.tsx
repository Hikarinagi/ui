import { Inline, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Link href="#tones">强调色链接</Link>
      <Link href="#tones" tone="neutral">
        中性色链接
      </Link>
    </Inline>
  )
}
