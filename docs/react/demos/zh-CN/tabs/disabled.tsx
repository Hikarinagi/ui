import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tabs defaultValue="public" className="w-full max-w-md">
      <TabsList label="可见范围">
        <TabsTrigger value="public">公开</TabsTrigger>
        <TabsTrigger value="friends">仅关注者</TabsTrigger>
        <TabsTrigger value="private" disabled>
          私密（需要登录）
        </TabsTrigger>
      </TabsList>
      <TabsContent value="public">
        <Text tone="muted" size="sm" className="block pt-4">
          所有人都能看到这份书单。
        </Text>
      </TabsContent>
      <TabsContent value="friends">
        <Text tone="muted" size="sm" className="block pt-4">
          只有关注你的人能看到。
        </Text>
      </TabsContent>
      <TabsContent value="private">
        <Text tone="muted" size="sm" className="block pt-4">
          只有自己可见。
        </Text>
      </TabsContent>
    </Tabs>
  )
}
