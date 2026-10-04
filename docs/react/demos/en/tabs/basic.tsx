import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tabs defaultValue="reading" className="w-full max-w-md">
      <TabsList label="Shelf">
        <TabsTrigger value="reading">Reading</TabsTrigger>
        <TabsTrigger value="planned">Want to read</TabsTrigger>
        <TabsTrigger value="finished">Read</TabsTrigger>
      </TabsList>
      <TabsContent value="reading">
        <Text tone="muted" size="sm" className="block pt-4">
          Three works in progress.
        </Text>
      </TabsContent>
      <TabsContent value="planned">
        <Text tone="muted" size="sm" className="block pt-4">
          Twelve works saved for later.
        </Text>
      </TabsContent>
      <TabsContent value="finished">
        <Text tone="muted" size="sm" className="block pt-4">
          Forty-eight works finished.
        </Text>
      </TabsContent>
    </Tabs>
  )
}
