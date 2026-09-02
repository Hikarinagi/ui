<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
    Stack,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Heading :level="3" size="md">常见问题</Heading>
    <Accordion>
      <AccordionItem value="submit">
        <AccordionTrigger :level="4">如何投稿</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">登录后进入创作者中心，选择作品类型并填写资料。</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="review">
        <AccordionTrigger :level="4">审核需要多久</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">通常在三个工作日内完成。</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Stack>
</template>
