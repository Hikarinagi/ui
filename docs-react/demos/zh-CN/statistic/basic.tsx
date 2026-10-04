import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-56">
        <Statistic label="在读" value={12480} />
      </Card>
      <Card className="w-56">
        <Statistic label="状态" value="正常" />
      </Card>
    </Inline>
  )
}
