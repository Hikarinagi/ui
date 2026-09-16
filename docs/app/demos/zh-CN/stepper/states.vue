<script setup lang="ts">
  import { Stepper, Stack, Switch } from '@hina-ui/vue'
  import { ref } from 'vue'

  const disabled = ref(false)
  const items = [
    { title: '已完成', completed: true },
    { title: '需要检查', description: '此步骤存在错误', error: true },
    { title: '已禁用', disabled: true },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Switch v-model="disabled">禁用整个步骤条</Switch>
    <Stepper :items="items" :default-value="2" :linear="false" :disabled="disabled" />
  </Stack>
</template>
