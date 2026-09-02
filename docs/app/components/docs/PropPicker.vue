<script setup lang="ts">
  import { Button, ButtonGroup, Inline, Text } from '@hina-ui/vue'

  const props = defineProps<{
    label: string
    options?: readonly string[]
  }>()

  const model = defineModel<string | boolean>()
</script>

<template>
  <Inline gap="xs" class="border-line rounded-md border py-0.5 ps-2.5 pe-0.5">
    <Text as="span" size="xs" tone="muted" class="font-mono">{{ props.label }}</Text>
    <ButtonGroup v-if="props.options" :label="props.label">
      <Button
        v-for="option in props.options"
        :key="option"
        size="sm"
        :variant="model === option ? 'soft' : 'ghost'"
        :tone="model === option ? 'accent' : 'neutral'"
        :aria-pressed="model === option"
        @click="model = option"
      >
        {{ option }}
      </Button>
    </ButtonGroup>
    <Button
      v-else
      size="sm"
      :variant="model ? 'soft' : 'ghost'"
      :tone="model ? 'accent' : 'neutral'"
      :aria-pressed="!!model"
      @click="model = !model"
    >
      {{ model ? 'true' : 'false' }}
    </Button>
  </Inline>
</template>
