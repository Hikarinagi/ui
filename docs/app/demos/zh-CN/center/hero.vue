<script setup lang="ts">
  import { BookOpen } from '@lucide/vue'
  import { Button, Card, Center, Heading, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-md">
    <Center class="h-56">
      <Stack gap="sm" align="center">
        <Center class="bg-inset text-muted size-12 rounded-full">
          <BookOpen class="size-6" />
        </Center>
        <Heading :level="3" size="md">书架还是空的</Heading>
        <Text tone="muted" size="sm">找到喜欢的作品之后，它会出现在这里。</Text>
        <Button size="sm" variant="soft" tone="neutral">去逛逛</Button>
      </Stack>
    </Center>
  </Card>
</template>
