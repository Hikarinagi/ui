<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Stack,
    Text,
  } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-full max-w-md">
    <Accordion default-value="intro">
      <AccordionItem value="intro">
        <AccordionTrigger>Synopsis</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            On my first day at the new school I met a girl on the roof holding an old camera.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="staff" disabled>
        <AccordionTrigger>Staff</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">Story, script and art are all by the same author.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <Accordion disabled>
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
