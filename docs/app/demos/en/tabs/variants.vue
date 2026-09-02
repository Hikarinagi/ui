<script setup lang="ts">
  import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-full max-w-md">
    <Tabs default-value="a" variant="underline">
      <TabsList label="Underline shape">
        <TabsTrigger value="a">underline</TabsTrigger>
        <TabsTrigger value="b">The default</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Text tone="muted" size="sm" class="block pt-3">
          A rounded line marks the selected tab.
        </Text>
      </TabsContent>
      <TabsContent value="b">
        <Text tone="muted" size="sm" class="block pt-3">
          Suits content grouped at the width of the body text.
        </Text>
      </TabsContent>
    </Tabs>
    <Tabs default-value="a" variant="soft">
      <TabsList label="Block shape">
        <TabsTrigger value="a">soft</TabsTrigger>
        <TabsTrigger value="b">The block shape</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Text tone="muted" size="sm" class="block pt-3">
          A raised block marks the selected tab.
        </Text>
      </TabsContent>
      <TabsContent value="b">
        <Text tone="muted" size="sm" class="block pt-3">Suits toolbars and compact switches.</Text>
      </TabsContent>
    </Tabs>
  </Stack>
</template>
