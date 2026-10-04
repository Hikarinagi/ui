import { Button, Card, Inline, Page, PageHeader, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page size="sm">
        <PageHeader
          eyebrow="轻小说"
          title="春与修罗"
          description="全三卷，连载中。"
          actions={
            <>
              <Button variant="soft" tone="neutral" size="sm">
                收藏
              </Button>
              <Button size="sm">开始阅读</Button>
            </>
          }
        >
          <Inline gap="xs">
            <Tag>奇幻</Tag>
            <Tag>校园</Tag>
            <Tag tone="accent">编辑推荐</Tag>
          </Inline>
        </PageHeader>
      </Page>
    </Card>
  )
}
