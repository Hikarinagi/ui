<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, Stack, Textarea } from '@hina-ui/vue'

  const name = ref('')
  const bio = ref('')
</script>

<template>
  <Stack gap="md" align="stretch" class="w-80">
    <FormField label="昵称" description="公开显示在个人页，可以随时修改">
      <Input v-model="name" />
    </FormField>
    <FormField label="简介">
      <Textarea v-model="bio" />
      <template #description>不超过 80 个字，支持换行。</template>
    </FormField>
  </Stack>
</template>
