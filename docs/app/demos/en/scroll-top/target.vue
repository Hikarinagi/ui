<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, FormField, ScrollArea, ScrollTop, Stack, Switch, Text } from '@hina-ui/vue'

  const area = ref<InstanceType<typeof ScrollArea>>()
  const show = ref(true)
</script>

<template>
  <Stack class="w-full max-w-md" gap="sm">
    <FormField label="Mount the scroll area" orientation="horizontal">
      <Switch v-model="show" />
    </FormField>
    <Button
      variant="outline"
      tone="neutral"
      class="self-start"
      :disabled="!show"
      @click="area?.viewport?.scrollTo({ top: 500, behavior: 'instant' })"
    >
      Scroll to the middle
    </Button>
    <Card :padded="false" class="relative h-64 overflow-hidden">
      <ScrollArea
        v-if="show"
        ref="area"
        class="h-full"
        :shadow="false"
        focusable
        label="Review log"
      >
        <Stack class="p-5 pb-24" gap="lg">
          <Text v-for="i in 20" :key="i" size="sm" class="border-line border-b pb-3">
            Review log {{ i }} · Review interactions and visual details
          </Text>
        </Stack>
      </ScrollArea>
      <Text v-else size="sm" tone="muted" class="p-5">The scroll area is unmounted</Text>
      <ScrollTop :target="() => area?.viewport" position="absolute" :threshold="120" :offset="16" />
    </Card>
    <Text size="sm" tone="muted">
      ScrollTop stays mounted. When its target is unavailable, the button hides without falling back
      to page scrolling.
    </Text>
  </Stack>
</template>
