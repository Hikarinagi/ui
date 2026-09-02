<script setup lang="ts">
  import { Mail } from '@lucide/vue'
  import { Input, Kbd, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <Input type="email" aria-label="邮箱" placeholder="邮箱">
      <template #leading>
        <Mail />
      </template>
    </Input>
    <Input inputmode="decimal" aria-label="体重" placeholder="体重">
      <template #trailing>kg</template>
    </Input>
    <Input aria-label="快速跳转" placeholder="快速跳转">
      <template #trailing>
        <Kbd>/</Kbd>
      </template>
    </Input>
  </Stack>
</template>
