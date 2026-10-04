import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tabs defaultValue="public" className="w-full max-w-md">
      <TabsList label="Visibility">
        <TabsTrigger value="public">Public</TabsTrigger>
        <TabsTrigger value="friends">Followers only</TabsTrigger>
        <TabsTrigger value="private" disabled>
          Private (sign in required)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="public">
        <Text tone="muted" size="sm" className="block pt-4">
          Anyone can see this list.
        </Text>
      </TabsContent>
      <TabsContent value="friends">
        <Text tone="muted" size="sm" className="block pt-4">
          Only people who follow you can see it.
        </Text>
      </TabsContent>
      <TabsContent value="private">
        <Text tone="muted" size="sm" className="block pt-4">
          Only you can see it.
        </Text>
      </TabsContent>
    </Tabs>
  )
}
