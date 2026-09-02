<script setup lang="ts">
  import { Mail } from '@lucide/vue'
  import { Input, Kbd, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <Input type="email" aria-label="Email" placeholder="Email">
      <template #leading>
        <Mail />
      </template>
    </Input>
    <Input inputmode="decimal" aria-label="Weight" placeholder="Weight">
      <template #trailing>kg</template>
    </Input>
    <Input aria-label="Quick jump" placeholder="Quick jump">
      <template #trailing>
        <Kbd>/</Kbd>
      </template>
    </Input>
  </Stack>
</template>
