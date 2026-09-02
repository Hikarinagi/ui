<script setup lang="ts">
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Text } from '@hina-ui/vue'
  import { Plus } from '@lucide/vue'
</script>

<template>
  <Accordion class="w-full max-w-md">
    <AccordionItem value="intro">
      <AccordionTrigger>
        Synopsis
        <template #icon><Plus /></template>
      </AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">
          On my first day at the new school I met a girl on the roof holding an old camera.
        </Text>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="staff">
      <AccordionTrigger :icon="false">Staff</AccordionTrigger>
      <AccordionContent>
        <Text tone="muted" size="sm">Story, script and art are all by the same author.</Text>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
