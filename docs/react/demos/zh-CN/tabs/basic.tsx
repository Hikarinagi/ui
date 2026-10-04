import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tabs defaultValue="reading" className="w-full max-w-md">
      <TabsList label="书架分类">
        <TabsTrigger value="reading">在读</TabsTrigger>
        <TabsTrigger value="planned">想读</TabsTrigger>
        <TabsTrigger value="finished">读过</TabsTrigger>
      </TabsList>
      <TabsContent value="reading">
        <Text tone="muted" size="sm" className="block pt-4">
          正在读的 3 部作品。
        </Text>
      </TabsContent>
      <TabsContent value="planned">
        <Text tone="muted" size="sm" className="block pt-4">
          收藏待读的 12 部作品。
        </Text>
      </TabsContent>
      <TabsContent value="finished">
        <Text tone="muted" size="sm" className="block pt-4">
          已经读完的 48 部作品。
        </Text>
      </TabsContent>
    </Tabs>
  )
}
