<script setup lang="ts">
  import { Card, Flex, Stack, Text } from '@hina-ui/vue'

  const aligns = ['start', 'center', 'end', 'stretch'] as const
  const justifies = ['start', 'center', 'end', 'between'] as const
</script>

<template>
  <Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">align works on the cross axis</Text>
      <Flex gap="lg" wrap>
        <Stack v-for="align in aligns" :key="align" gap="xs">
          <Text tone="muted" size="sm">{{ align }}</Text>
          <Flex :align="align" gap="sm" class="bg-inset h-24 rounded-md p-3">
            <Card class="bg-surface h-8 w-8" :padded="false" />
            <Card class="bg-surface h-12 w-8" :padded="false" />
          </Flex>
        </Stack>
      </Flex>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">justify works on the main axis</Text>
      <Flex direction="col" gap="sm">
        <Flex
          v-for="justify in justifies"
          :key="justify"
          :justify="justify"
          class="bg-inset w-64 rounded-md p-3"
        >
          <Card class="bg-surface size-8" :padded="false" />
          <Card class="bg-surface size-8" :padded="false" />
        </Flex>
      </Flex>
    </Stack>
  </Stack>
</template>
