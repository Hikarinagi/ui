import { Button, Card, NavLink, Page, PageAside, PageBody, PageHeader, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full overflow-hidden">
      <Page
        size="lg"
        aside={
          <PageAside label="本页目录">
            <NavLink href="#" label="简介">
              简介
            </NavLink>
            <NavLink href="#" label="角色">
              角色
            </NavLink>
            <NavLink href="#" label="制作人员">
              制作人员
            </NavLink>
          </PageAside>
        }
      >
        <PageHeader
          eyebrow="Galgame"
          title="サクラノ詩"
          description="枕 · 2015-10-23 · 剧本 すかぢ"
          actions={
            <>
              <Button variant="soft" tone="neutral" size="sm">
                收藏
              </Button>
              <Button size="sm">标记为在玩</Button>
            </>
          }
        />

        <PageBody>
          <Text size="sm" tone="muted">
            作品简介与详情放在这里。
          </Text>
          <Text size="sm" tone="muted">
            正文各节之间由 PageBody 统一间距。
          </Text>
        </PageBody>
      </Page>
    </Card>
  )
}
