<script setup lang="ts">
  import { Button, Card, Divider, Input, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Stack>
      <Stack gap="xs">
        <Text size="sm">Email</Text>
        <Input model-value="shion@hikarinagi.moe" />
      </Stack>
      <Button>Sign in with email</Button>
      <Divider>or</Divider>
      <Button variant="outline" tone="neutral">Use a passkey</Button>
    </Stack>
  </Card>
</template>
