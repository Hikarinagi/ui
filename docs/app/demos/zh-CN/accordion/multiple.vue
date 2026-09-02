<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Accordion type="multiple" :default-value="['intro', 'staff']" class="w-full max-w-md">
    <AccordionItem value="intro">
      <AccordionTrigger>作品简介</AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">转学第一天，我在天台遇见了那个抱着旧相机的少女。</Text>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="staff">
      <AccordionTrigger>制作人员</AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">原作、脚本与原画均由同一位作者完成。</Text>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="release">
      <AccordionTrigger>发售信息</AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">2024 年冬季发售，支持简体中文。</Text>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
