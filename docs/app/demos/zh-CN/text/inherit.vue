<script setup lang="ts">
  import { Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Text size="sm">
      sm 父级文字，
      <Text as="span" size="inherit" tone="accent">继承字号和行高</Text>
      。
    </Text>
    <Text size="base">
      base 父级文字，
      <Text as="span" size="inherit" tone="accent">继承字号和行高</Text>
      。
    </Text>
    <Text size="xl">
      xl 父级文字，
      <Text as="span" size="inherit" tone="accent">继承字号和行高</Text>
      。
    </Text>
  </Stack>
</template>
