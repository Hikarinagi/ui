<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input } from '@hina-ui/vue'
  const name = ref('Hina')
</script>
<template>
  <FormField
    label="显示名称"
    orientation="horizontal"
    label-width="8rem"
    description="显示在你的公开个人资料中。"
    class="w-full"
  >
    <Input v-model="name" />
  </FormField>
</template>
