<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input } from '@hina-ui/vue'

  const name = ref('')
</script>

<template>
  <FormField label="昵称" description="公开显示在个人页" required class="w-80">
    <Input v-model="name" placeholder="星见书音" />
  </FormField>
</template>
