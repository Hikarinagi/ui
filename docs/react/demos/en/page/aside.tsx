import { Card, NavLink, Page, PageAside, PageBody, PageHeader, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page
        size="lg"
        aside={
          <PageAside label="Related">
            <NavLink href="#" label="Same brand">
              Same brand
            </NavLink>
            <NavLink href="#" label="Same writer">
              Same writer
            </NavLink>
          </PageAside>
        }
      >
        <PageHeader title="Staff" />
        <PageBody>
          <Text size="sm" tone="muted">
            Main column. The aside is hidden below a viewport width of 1280 pixels.
          </Text>
        </PageBody>
      </Page>
    </Card>
  )
}
