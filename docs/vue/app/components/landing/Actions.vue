<script setup lang="ts">
  import { Button, Grid } from '@hina-ui/vue'

  const { t } = useI18n()

  const actions = [
    { key: 'read', variant: 'solid', tone: 'accent' },
    { key: 'save', variant: 'soft', tone: 'accent' },
    { key: 'share', variant: 'outline', tone: 'neutral' },
    { key: 'review', variant: 'ghost', tone: 'neutral' },
    { key: 'remove', variant: 'soft', tone: 'danger' },
    { key: 'report', variant: 'solid', tone: 'danger' },
  ] as const
</script>

<template>
  <Grid :cols="3" gap="sm" class="w-[280px]">
    <Button
      v-for="action in actions"
      :key="action.key"
      size="sm"
      :variant="action.variant"
      :tone="action.tone"
    >
      {{ t(`landing.wall.actions.${action.key}`) }}
    </Button>
  </Grid>
</template>
