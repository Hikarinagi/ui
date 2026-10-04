import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="Total reads" value={1284000} format="compact" />
      </Card>
      <Card className="w-56">
        <Statistic label="Finish rate" value={0.674} format="percent" precision={1} />
      </Card>
      <Card className="w-56">
        <Statistic label="Spent this month" value={128.5} format="currency" currency="USD" />
      </Card>
    </Inline>
  )
}
