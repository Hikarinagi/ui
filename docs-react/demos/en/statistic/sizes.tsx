import { Card, Inline, Statistic } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="md" align="stretch">
      <Card className="w-48">
        <Statistic label="Reading" value={12480} size="sm" />
      </Card>
      <Card className="w-48">
        <Statistic label="Reading" value={12480} />
      </Card>
      <Card className="w-48">
        <Statistic label="Reading" value={12480} size="lg" />
      </Card>
    </Inline>
  )
}
