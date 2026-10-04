import { Calendar, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <Calendar defaultValue="2026-09-04" readonly />
      <Calendar defaultValue="2026-09-04" disabled />
    </Inline>
  )
}
