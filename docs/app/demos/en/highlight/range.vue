<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, Grid, Highlight, Inline, Stack, Text } from '@hina-ui/vue'

  const rows = ['Overview', 'Characters', 'Staff', 'Release']
  const from = ref(1)
  const to = ref(2)
  const span = computed(
    () => `${Math.min(from.value, to.value) + 1} / ${Math.max(from.value, to.value) + 2}`,
  )
</script>

<template>
  <Stack gap="md" class="w-full max-w-sm">
    <Inline gap="sm">
      <Button size="sm" variant="outline" tone="neutral" @click="from = (from + 1) % rows.length">
        Move start
      </Button>
      <Button size="sm" variant="outline" tone="neutral" @click="to = (to + 1) % rows.length">
        Move end
      </Button>
    </Inline>

    <Grid :cols="1" gap="none" class="border-line relative isolate rounded-lg border p-1">
      <Highlight
        axis="y"
        :style="{ gridRow: span }"
        class="bg-accent-soft col-start-1 -z-10 rounded-md"
      />
      <Text
        v-for="(row, index) in rows"
        :key="row"
        as="span"
        size="sm"
        class="col-start-1 block px-3 py-1.5"
        :style="{ gridRow: index + 1 }"
      >
        {{ row }}
      </Text>
    </Grid>
  </Stack>
</template>
