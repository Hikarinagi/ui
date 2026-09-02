<script setup lang="ts">
  import { Plus } from '@lucide/vue'
  import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DisclosureIcon,
    Stack,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Collapsible>
      <Stack gap="sm" align="start">
        <CollapsibleTrigger>
          更换字形
          <template #icon>
            <Plus />
          </template>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">加号旋转四分之一圈后成为叉号，旋转仍由组件负责。</Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
    <Collapsible>
      <Stack gap="sm" align="start">
        <CollapsibleTrigger as-child>
          <Button variant="outline" tone="neutral" block class="justify-between">
            自行提供整个触发器
            <template #trailing>
              <DisclosureIcon />
            </template>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            此时外观与指示物均由调用方决定，放置一个 DisclosureIcon 即可。
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  </Stack>
</template>
