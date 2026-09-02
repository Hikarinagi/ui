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
  } from '@hikarinagi/ui'

  const open = ref('intro')
</script>

<template>
  <Stack class="w-full max-w-md">
    <Inline>
      <Button size="sm" variant="soft" tone="neutral" @click="open = 'intro'">Show synopsis</Button>
      <Button size="sm" variant="soft" tone="neutral" @click="open = 'staff'">Show staff</Button>
    </Inline>
    <Accordion v-model="open">
      <AccordionItem value="intro">
        <AccordionTrigger>Synopsis</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            On my first day at the new school I met a girl on the roof holding an old camera.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="staff">
        <AccordionTrigger>Staff</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">Story, script and art are all by the same author.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Stack>
</template>
