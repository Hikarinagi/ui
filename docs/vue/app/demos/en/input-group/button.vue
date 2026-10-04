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
      <Input v-model="code" readonly aria-label="Invite code" />
      <IconButton label="Copy" variant="outline" tone="neutral">
        <Copy />
      </IconButton>
    </InputGroup>
    <InputGroup>
      <Input v-model="email" type="email" aria-label="Email" placeholder="Email" />
      <Button>Subscribe</Button>
    </InputGroup>
  </Stack>
</template>
