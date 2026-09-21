<script setup lang="ts">
  import {
    Card,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Masonry,
    Stack,
    Text,
  } from '@hina-ui/vue'
  import { masonryNotes } from '../../masonry'
  const items = masonryNotes('en')
</script>

<template>
  <Masonry
    :items="items"
    :get-key="item => item.id"
    :min-column-width="180"
    label="Expandable design notes"
    class="max-w-2xl"
  >
    <template #default="{ item }">
      <Card>
        <Stack gap="sm">
          <Text weight="medium" size="sm">{{ item.title }}</Text>
          <Text size="sm" tone="muted">{{ item.body }}</Text>
          <Collapsible>
            <CollapsibleTrigger class="text-sm">Details</CollapsibleTrigger>
            <CollapsibleContent>
              <Text size="sm" tone="muted" class="pt-3">{{ item.detail }}</Text>
            </CollapsibleContent>
          </Collapsible>
        </Stack>
      </Card>
    </template>
  </Masonry>
</template>
