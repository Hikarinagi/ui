<script setup lang="ts">
  import { ref } from 'vue'
  import { Mail } from '@lucide/vue'
  import { Input } from '@hina-ui/vue'

  const email = ref('shion@hoshimi.moe')
</script>

<template>
  <Input v-model="email" type="email" clearable aria-label="邮箱" class="w-72">
    <template #leading>
      <Mail />
    </template>
  </Input>
</template>
