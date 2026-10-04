import { Inline, Spinner, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm" align="center">
      <Spinner size="sm" label="正在提交评价" />
      <Text size="sm" tone="muted">
        正在提交评价……
      </Text>
    </Inline>
  )
}
