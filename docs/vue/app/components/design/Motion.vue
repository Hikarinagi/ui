<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const moved = ref(false)
  const durations = ['fast', 'base', 'slow'] as const
</script>

<template>
  <Stack class="border-line rounded-lg border p-5">
    <Inline justify="between">
      <Text size="sm" tone="muted">{{ t('designPreview.motionHint') }}</Text>
      <Button variant="outline" tone="neutral" size="sm" @click="moved = !moved">
        {{ t('designPreview.replay') }}
      </Button>
    </Inline>
    <Stack v-for="duration in durations" :key="duration" gap="sm">
      <Inline justify="between">
        <Text size="sm" weight="medium">{{ duration }}</Text>
        <Text size="xs" tone="muted" class="font-mono">{{ `--hn-duration-${duration}` }}</Text>
      </Inline>
      <Stack class="bg-subtle rounded-md p-2">
        <Stack class="relative h-7 me-7">
          <Stack
            class="bg-accent absolute inset-y-0 start-0 size-7 rounded-sm transition-[inset-inline-start]"
            :style="{
              insetInlineStart: moved ? '100%' : '0%',
              transitionDuration: `var(--hn-duration-${duration})`,
              transitionTimingFunction: 'var(--hn-ease-move)',
            }"
            aria-hidden="true"
          />
        </Stack>
      </Stack>
    </Stack>
  </Stack>
</template>
