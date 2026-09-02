<script setup lang="ts">
  import {
    Button,
    Card,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DisclosureIcon,
    Stack,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-md">
    <Collapsible>
      <Stack gap="sm" align="start">
        <Text tone="muted" size="sm">
          转学第一天，我在天台遇见了那个抱着旧相机的少女。她说这台相机拍得到明天。
        </Text>
        <CollapsibleTrigger as-child>
          <Button variant="link" size="sm">
            <template #trailing>
              <DisclosureIcon />
            </template>
            展开全部简介
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text tone="muted" size="sm">
            那之后的每一天，我们都在放学后爬上那道生锈的铁梯。她按下快门，我负责记录时间。直到某个傍晚，取景框里出现了不该出现的东西。
          </Text>
        </CollapsibleContent>
      </Stack>
    </Collapsible>
  </Card>
</template>
