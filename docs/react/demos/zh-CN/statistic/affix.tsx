import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="余额" value={2480} prefix="¥" />
      </Card>
      <Card className="w-56">
        <Statistic label="平均时长" value={42} suffix="分钟" />
      </Card>
    </Inline>
  )
}
