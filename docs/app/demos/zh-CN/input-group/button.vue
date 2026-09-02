<script setup lang="ts">
  import { ref } from 'vue'
  import { Copy } from '@lucide/vue'
  import { Button, IconButton, Input, InputGroup, Stack } from '@hina-ui/vue'

  const code = ref('HINA-2026')
  const email = ref('')
</script>

<template>
  <Stack class="w-80">
    <InputGroup>
      <Input v-model="code" readonly aria-label="邀请码" />
      <IconButton label="复制" variant="outline" tone="neutral">
        <Copy />
      </IconButton>
    </InputGroup>
    <InputGroup>
      <Input v-model="email" type="email" aria-label="邮箱" placeholder="邮箱" />
      <Button>订阅</Button>
    </InputGroup>
  </Stack>
</template>
