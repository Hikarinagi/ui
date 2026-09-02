<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Card,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-md">
    <Accordion default-value="submit">
      <AccordionItem value="submit">
        <AccordionTrigger>How do I submit a work?</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            Sign in, open the creator center, pick the type of work and fill in its details. It
            joins the review queue once submitted.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="review">
        <AccordionTrigger>How long does review take?</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            Usually within three working days. Incomplete entries are returned for more details.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="edit">
        <AccordionTrigger>Can published content be edited?</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            Yes. An edit creates a new version, which replaces the current one after review.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
</template>
