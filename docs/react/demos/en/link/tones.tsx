import { Inline, Link } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Link href="#tones">Accent link</Link>
      <Link href="#tones" tone="neutral">
        Neutral link
      </Link>
    </Inline>
  )
}
