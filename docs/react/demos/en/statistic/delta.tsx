import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="New reviews" value={86} delta={0.18} deltaLabel="vs last week" />
      </Card>
      <Card className="w-56">
        <Statistic label="Active readers" value={1204} delta={-0.05} deltaLabel="vs last week" />
      </Card>
      <Card className="w-56">
        <Statistic label="Reports" value={3} delta={-0.4} deltaLabel="vs last week" invert />
      </Card>
    </Inline>
  )
}
