<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, FormField, SplitButton, Stack, Switch, Text } from '@hina-ui/vue'

  const loading = ref(false)
  const disabled = ref(false)
  const primaryDisabled = ref(false)
  const menuDisabled = ref(false)
  const result = ref('可以分别禁用主操作和菜单')
</script>

<template>
  <Stack class="w-full max-w-xs" gap="lg">
    <Stack gap="sm">
      <FormField label="加载中" orientation="horizontal"><Switch v-model="loading" /></FormField>
      <FormField label="全部禁用" orientation="horizontal"><Switch v-model="disabled" /></FormField>
      <FormField label="禁用主操作" orientation="horizontal">
        <Switch v-model="primaryDisabled" />
      </FormField>
      <FormField label="禁用菜单" orientation="horizontal">
        <Switch v-model="menuDisabled" />
      </FormField>
    </Stack>
    <Stack align="center" gap="sm">
      <SplitButton
        :loading="loading"
        :disabled="disabled"
        :primary-disabled="primaryDisabled"
        :menu-disabled="menuDisabled"
        menu-label="保存方式"
        @click="result = '已执行：保存'"
      >
        保存修改
        <template #content>
          <DropdownMenuItem @select="result = '已执行：另存副本'">另存副本</DropdownMenuItem>
        </template>
      </SplitButton>
      <Text role="status" size="sm" tone="muted">{{ result }}</Text>
    </Stack>
  </Stack>
</template>
