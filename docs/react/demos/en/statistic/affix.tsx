import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="Balance" value={2480} prefix="$" />
      </Card>
      <Card className="w-56">
        <Statistic label="Average session" value={42} suffix="min" />
      </Card>
    </Inline>
  )
}
