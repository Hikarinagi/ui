<script setup lang="ts">
  import { Container, Heading, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack gap="none" class="bg-inset w-full rounded-md py-8">
    <Container size="sm">
      <Stack gap="xs">
        <Heading :level="3" size="lg">Dawn of the Observer</Heading>
        <Text tone="muted">
          A container holds its content to a readable width and centres it on the page. The inset on
          either side follows the screen: 16 pixels when narrow, 24 when wide.
        </Text>
      </Stack>
    </Container>
  </Stack>
</template>
