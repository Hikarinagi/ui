import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="新增书评" value={86} delta={0.18} deltaLabel="较上周" />
      </Card>
      <Card className="w-56">
        <Statistic label="活跃读者" value={1204} delta={-0.05} deltaLabel="较上周" />
      </Card>
      <Card className="w-56">
        <Statistic label="举报" value={3} delta={-0.4} deltaLabel="较上周" invert />
      </Card>
    </Inline>
  )
}
