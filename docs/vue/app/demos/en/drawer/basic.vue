<script setup lang="ts">
  import { Button, Drawer, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="Notifications" description="Messages from the past seven days.">
    <Button variant="outline" tone="neutral">Open notifications</Button>
    <template #content>
      <Text>
        The message list goes here. The drawer opens flush against the edge of the screen and keeps
        its square corners.
      </Text>
    </template>
  </Drawer>
</template>
