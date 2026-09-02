<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Tabs default-value="account" orientation="vertical" class="w-full max-w-md">
    <TabsList label="设置分组">
      <TabsTrigger value="account">账号</TabsTrigger>
      <TabsTrigger value="reading">阅读</TabsTrigger>
      <TabsTrigger value="notice">通知</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Text tone="muted" size="sm">用户名、邮箱与密码。</Text>
    </TabsContent>
    <TabsContent value="reading">
      <Text tone="muted" size="sm">字号、行距与翻页方向。</Text>
    </TabsContent>
    <TabsContent value="notice">
      <Text tone="muted" size="sm">更新提醒与站内消息。</Text>
    </TabsContent>
  </Tabs>
</template>
