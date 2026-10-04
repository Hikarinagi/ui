import { Card, Page, PageBody, PageHeader, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page size="sm">
        <PageHeader title="我的书架" description="收录了 48 部作品。" />
        <PageBody>
          <Text size="sm" tone="muted">
            页面正文。
          </Text>
        </PageBody>
      </Page>
    </Card>
  )
}
