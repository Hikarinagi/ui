<script setup lang="ts">
  import { Checkbox, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Checkbox invalid>我已阅读并同意用户协议</Checkbox>
    <Checkbox disabled>已禁用</Checkbox>
    <Checkbox disabled model-value>已禁用且选中</Checkbox>
  </Stack>
</template>
