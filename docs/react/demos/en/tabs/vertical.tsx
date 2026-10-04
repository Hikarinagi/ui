import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tabs defaultValue="account" orientation="vertical" className="w-full max-w-md">
      <TabsList label="Settings sections">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="reading">Reading</TabsTrigger>
        <TabsTrigger value="notice">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Text tone="muted" size="sm">
          Username, email address and password.
        </Text>
      </TabsContent>
      <TabsContent value="reading">
        <Text tone="muted" size="sm">
          Type size, line height and page direction.
        </Text>
      </TabsContent>
      <TabsContent value="notice">
        <Text tone="muted" size="sm">
          Update alerts and site messages.
        </Text>
      </TabsContent>
    </Tabs>
  )
}
