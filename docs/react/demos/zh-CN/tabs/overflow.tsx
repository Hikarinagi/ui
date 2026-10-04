import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

const genres = ['科幻', '悬疑', '日常', '校园', '治愈', '奇幻', '推理', '恋爱', '历史', '战记']

export default function Demo() {
  return (
    <Tabs defaultValue="科幻" className="w-full max-w-sm">
      <TabsList label="题材">
        {genres.map(genre => (
          <TabsTrigger key={genre} value={genre}>
            {genre}
          </TabsTrigger>
        ))}
      </TabsList>
      {genres.map(genre => (
        <TabsContent key={genre} value={genre}>
          <Text tone="muted" size="sm" className="block pt-4">
            {genre}题材的作品列表。
          </Text>
        </TabsContent>
      ))}
    </Tabs>
  )
}
