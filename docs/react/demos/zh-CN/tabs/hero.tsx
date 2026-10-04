import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tabs defaultValue="intro" className="w-full max-w-md">
      <TabsList label="作品信息">
        <TabsTrigger value="intro">简介</TabsTrigger>
        <TabsTrigger value="volumes">卷册</TabsTrigger>
        <TabsTrigger value="staff">制作</TabsTrigger>
      </TabsList>
      <TabsContent value="intro">
        <Stack gap="xs" className="pt-4">
          <Text tone="muted" size="sm">
            转学第一天，我在天台遇见了那个抱着旧相机的少女。
          </Text>
        </Stack>
      </TabsContent>
      <TabsContent value="volumes">
        <Stack gap="xs" className="pt-4">
          <Text tone="muted" size="sm">
            全 7 卷，第 8 卷预定于今年冬季发行。
          </Text>
        </Stack>
      </TabsContent>
      <TabsContent value="staff">
        <Stack gap="xs" className="pt-4">
          <Text tone="muted" size="sm">
            作者 支倉凍砂，插画 文倉十。
          </Text>
        </Stack>
      </TabsContent>
    </Tabs>
  )
}
