import { Card, LoadingOverlay, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="relative h-40 w-96">
      <Text>正在把草稿同步到云端。</Text>
      <LoadingOverlay visible text="正在同步" size="lg" />
    </Card>
  )
}
