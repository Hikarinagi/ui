<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
    Stack,
    Text,
  } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Heading :level="3" size="md">Frequently asked questions</Heading>
    <Accordion>
      <AccordionItem value="submit">
        <AccordionTrigger :level="4">How do I submit a work?</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            Sign in, open the creator center, pick the type of work and fill in its details.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="review">
        <AccordionTrigger :level="4">How long does review take?</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">Usually within three working days.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Stack>
</template>
