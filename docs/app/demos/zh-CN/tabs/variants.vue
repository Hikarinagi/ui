<script setup lang="ts">
  import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-full max-w-md">
    <Tabs default-value="a" variant="underline">
      <TabsList label="下划线形态">
        <TabsTrigger value="a">underline</TabsTrigger>
        <TabsTrigger value="b">默认形态</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Text tone="muted" size="sm" class="block pt-3">选中项由一条圆头线标示。</Text>
      </TabsContent>
      <TabsContent value="b">
        <Text tone="muted" size="sm" class="block pt-3">适合与正文同宽的内容分组。</Text>
      </TabsContent>
    </Tabs>
    <Tabs default-value="a" variant="soft">
      <TabsList label="色块形态">
        <TabsTrigger value="a">soft</TabsTrigger>
        <TabsTrigger value="b">色块形态</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <Text tone="muted" size="sm" class="block pt-3">选中项由一块浮起的滑块标示。</Text>
      </TabsContent>
      <TabsContent value="b">
        <Text tone="muted" size="sm" class="block pt-3">适合工具栏与紧凑的切换。</Text>
      </TabsContent>
    </Tabs>
  </Stack>
</template>
