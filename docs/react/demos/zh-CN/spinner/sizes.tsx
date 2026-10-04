import { Inline, Spinner } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  )
}
