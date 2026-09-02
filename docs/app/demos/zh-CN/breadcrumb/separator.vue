<script setup lang="ts">
  import { Slash } from '@lucide/vue'
  import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="md">
    <Stack gap="xs">
      <Text size="sm" tone="faint">默认</Text>
      <Breadcrumb>
        <BreadcrumbItem href="#">首页</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href="#">漫画</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>第 12 话</BreadcrumbItem>
      </Breadcrumb>
    </Stack>

    <Stack gap="xs">
      <Text size="sm" tone="faint">斜线</Text>
      <Breadcrumb>
        <BreadcrumbItem href="#">首页</BreadcrumbItem>
        <BreadcrumbSeparator><Slash class="size-3.5" /></BreadcrumbSeparator>
        <BreadcrumbItem href="#">漫画</BreadcrumbItem>
        <BreadcrumbSeparator><Slash class="size-3.5" /></BreadcrumbSeparator>
        <BreadcrumbItem current>第 12 话</BreadcrumbItem>
      </Breadcrumb>
    </Stack>

    <Stack gap="xs">
      <Text size="sm" tone="faint">文字</Text>
      <Breadcrumb>
        <BreadcrumbItem href="#">首页</BreadcrumbItem>
        <BreadcrumbSeparator>·</BreadcrumbSeparator>
        <BreadcrumbItem href="#">漫画</BreadcrumbItem>
        <BreadcrumbSeparator>·</BreadcrumbSeparator>
        <BreadcrumbItem current>第 12 话</BreadcrumbItem>
      </Breadcrumb>
    </Stack>
  </Stack>
</template>
