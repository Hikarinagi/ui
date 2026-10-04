import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

const sizes = ['sm', 'md', 'lg'] as const

export default function Demo() {
  return (
    <Stack gap="lg" className="w-full max-w-md">
      {sizes.map(size => (
        <Stack key={size} gap="xs">
          <Text tone="muted" size="sm">
            {size}
          </Text>
          <Tabs defaultValue="a" size={size}>
            <TabsList label={`${size} 档`}>
              <TabsTrigger value="a">简介</TabsTrigger>
              <TabsTrigger value="b">卷册</TabsTrigger>
            </TabsList>
            <TabsContent value="a" />
            <TabsContent value="b" />
          </Tabs>
        </Stack>
      ))}
    </Stack>
  )
}
