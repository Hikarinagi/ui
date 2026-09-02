<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Text,
  } from '@hikarinagi/ui'
  import { Plus } from '@lucide/vue'
</script>

<template>
  <Accordion class="w-full max-w-md">
    <AccordionItem value="intro">
      <AccordionTrigger>
        作品简介
        <template #icon><Plus /></template>
      </AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">转学第一天，我在天台遇见了那个抱着旧相机的少女。</Text>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="staff">
      <AccordionTrigger :icon="false">制作人员</AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">原作、脚本与原画均由同一位作者完成。</Text>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
