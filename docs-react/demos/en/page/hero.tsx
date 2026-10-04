import { Button, Card, NavLink, Page, PageAside, PageBody, PageHeader, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page
        size="lg"
        aside={
          <PageAside label="On this page">
            <NavLink href="#" label="Overview">
              Overview
            </NavLink>
            <NavLink href="#" label="Characters">
              Characters
            </NavLink>
            <NavLink href="#" label="Staff">
              Staff
            </NavLink>
          </PageAside>
        }
      >
        <PageHeader
          eyebrow="Galgame"
          title="サクラノ詩"
          description="Makura · 2015-10-23 · Written by Sca-ji"
          actions={
            <>
              <Button variant="soft" tone="neutral" size="sm">
                Favourite
              </Button>
              <Button size="sm">Mark as playing</Button>
            </>
          }
        />

        <PageBody>
          <Text size="sm" tone="muted">
            The synopsis and details go here.
          </Text>
          <Text size="sm" tone="muted">
            PageBody sets the spacing between sections.
          </Text>
        </PageBody>
      </Page>
    </Card>
  )
}
