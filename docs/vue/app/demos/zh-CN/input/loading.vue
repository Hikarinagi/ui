<script setup lang="ts">
  import { Mail } from '@lucide/vue'
  import { Input, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <Input loading model-value="shion@hoshimi.moe" aria-label="校验邮箱中">
      <template #leading>
        <Mail />
      </template>
    </Input>
    <Input loading model-value="hoshimi" aria-label="校验昵称中" />
  </Stack>
</template>
