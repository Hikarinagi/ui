import { Button, Card, Inline, Page, PageHeader, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page size="sm">
        <PageHeader
          eyebrow="Light novel"
          title="Spring and Asura"
          description="Three volumes, ongoing."
          actions={
            <>
              <Button variant="soft" tone="neutral" size="sm">
                Favourite
              </Button>
              <Button size="sm">Start reading</Button>
            </>
          }
        >
          <Inline gap="xs">
            <Tag>Fantasy</Tag>
            <Tag>School</Tag>
            <Tag tone="accent">Editor's pick</Tag>
          </Inline>
        </PageHeader>
      </Page>
    </Card>
  )
}
