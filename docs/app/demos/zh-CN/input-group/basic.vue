<script setup lang="ts">
  import { ref } from 'vue'
  import { AtSign } from '@lucide/vue'
  import { Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/vue'

  const handle = ref('')
  const amount = ref('')
</script>

<template>
  <Stack class="w-80">
    <InputGroup>
      <InputGroupAddon>
        <AtSign />
      </InputGroupAddon>
      <Input v-model="handle" aria-label="用户名" placeholder="用户名" />
    </InputGroup>
    <InputGroup>
      <Input v-model="amount" inputmode="decimal" aria-label="金额" placeholder="金额" />
      <InputGroupAddon>元</InputGroupAddon>
    </InputGroup>
  </Stack>
</template>
