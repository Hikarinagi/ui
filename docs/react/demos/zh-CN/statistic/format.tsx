import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="总阅读量" value={1284000} format="compact" />
      </Card>
      <Card className="w-56">
        <Statistic label="完读率" value={0.674} format="percent" precision={1} />
      </Card>
      <Card className="w-56">
        <Statistic label="本月支出" value={128.5} format="currency" currency="CNY" />
      </Card>
    </Inline>
  )
}
