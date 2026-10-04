<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Inline,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const open = ref('intro')
</script>

<template>
  <Stack class="w-full max-w-md">
    <Inline>
      <Button size="sm" variant="soft" tone="neutral" @click="open = 'intro'">看简介</Button>
      <Button size="sm" variant="soft" tone="neutral" @click="open = 'staff'">看制作人员</Button>
    </Inline>
    <Accordion v-model="open">
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
    </Accordion>
  </Stack>
</template>
