<script setup lang="ts">
  import { ref } from 'vue'
  import { ChevronsUp } from '@lucide/vue'
  import {
    Button,
    Card,
    FormField,
    Heading,
    ScrollArea,
    ScrollTop,
    Stack,
    Switch,
    Text,
  } from '@hina-ui/vue'

  const area = ref<InstanceType<typeof ScrollArea>>()
  const heading = ref<InstanceType<typeof Heading>>()
  const instant = ref(false)
  function goDown() {
    area.value?.viewport?.scrollTo({ top: 450, behavior: 'instant' })
  }
</script>

<template>
  <Stack class="w-full max-w-md" gap="sm">
    <FormField label="Return instantly" orientation="horizontal">
      <Switch v-model="instant" />
    </FormField>
    <Button variant="outline" tone="neutral" class="self-start" @click="goDown">
      Scroll to the middle
    </Button>
    <Card :padded="false" class="relative overflow-hidden">
      <ScrollArea ref="area" class="h-64" :shadow="false" focusable label="Release checklist">
        <Stack class="p-5 pb-24" gap="lg">
          <Heading
            ref="heading"
            :level="3"
            size="base"
            tabindex="-1"
            class="hn-focus-ring rounded-sm"
          >
            Release checklist
          </Heading>
          <Text
            v-for="item in [
              'Verify core flows',
              'Check empty states',
              'Check loading and retries',
              'Check keyboard navigation',
              'Check form errors',
              'Check mobile layouts',
              'Check dark mode',
              'Check RTL',
              'Check server rendering',
              'Review documentation examples',
              'Update the changelog',
              'Confirm the release version',
            ]"
            :key="item"
            size="sm"
            class="border-line border-b pb-3"
          >
            {{ item }}
          </Text>
        </Stack>
      </ScrollArea>
      <ScrollTop
        :target="() => area?.viewport"
        :focus-target="() => heading?.$el"
        :threshold="80"
        :behavior="instant ? 'instant' : 'smooth'"
        position="absolute"
        :offset="16"
        extended
        size="sm"
        shape="square"
        variant="soft"
        tone="accent"
        label="Back to the checklist"
      >
        <ChevronsUp />
      </ScrollTop>
    </Card>
    <Text size="sm" tone="muted">
      Returning to the top focuses the heading, so keyboard navigation can continue from there.
    </Text>
  </Stack>
</template>
