import { Card, Page, PageBody, PageHeader, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page size="sm">
        <PageHeader title="My shelf" description="48 titles collected." />
        <PageBody>
          <Text size="sm" tone="muted">
            Page content.
          </Text>
        </PageBody>
      </Page>
    </Card>
  )
}
