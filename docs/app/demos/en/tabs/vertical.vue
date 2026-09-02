<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Tabs default-value="account" orientation="vertical" class="w-full max-w-md">
    <TabsList label="Settings sections">
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="reading">Reading</TabsTrigger>
      <TabsTrigger value="notice">Notifications</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Text tone="muted" size="sm">Username, email address and password.</Text>
    </TabsContent>
    <TabsContent value="reading">
      <Text tone="muted" size="sm">Type size, line height and page direction.</Text>
    </TabsContent>
    <TabsContent value="notice">
      <Text tone="muted" size="sm">Update alerts and site messages.</Text>
    </TabsContent>
  </Tabs>
</template>
