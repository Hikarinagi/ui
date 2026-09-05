<script setup lang="ts">
  import { Button, Sheet, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Sheet title="Terms of service" description="Read to the end before agreeing.">
    <Button variant="outline" tone="neutral">View terms</Button>
    <template #content>
      <Stack gap="md">
        <Text v-for="n in 24" :key="n">
          Clause {{ n }}: this clause exists to show scrolling inside the sheet; the title and
          footer stay put while the body scrolls in between.
        </Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button @click="close">Agree</Button>
    </template>
  </Sheet>
</template>
