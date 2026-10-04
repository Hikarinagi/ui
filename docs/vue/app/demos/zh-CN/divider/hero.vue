<script setup lang="ts">
  import { Button, Card, Divider, Input, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Stack>
      <Stack gap="xs">
        <Text size="sm">邮箱</Text>
        <Input model-value="shion@hikarinagi.moe" />
      </Stack>
      <Button>用邮箱登录</Button>
      <Divider>或者</Divider>
      <Button variant="outline" tone="neutral">使用通行密钥</Button>
    </Stack>
  </Card>
</template>
