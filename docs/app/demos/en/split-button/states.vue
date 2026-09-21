<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, FormField, SplitButton, Stack, Switch, Text } from '@hina-ui/vue'

  const loading = ref(false)
  const disabled = ref(false)
  const primaryDisabled = ref(false)
  const menuDisabled = ref(false)
  const result = ref('Disable either action independently')
</script>

<template>
  <Stack class="w-full max-w-xs" gap="lg">
    <Stack gap="sm">
      <FormField label="Loading" orientation="horizontal"><Switch v-model="loading" /></FormField>
      <FormField label="Disable both" orientation="horizontal">
        <Switch v-model="disabled" />
      </FormField>
      <FormField label="Disable primary action" orientation="horizontal">
        <Switch v-model="primaryDisabled" />
      </FormField>
      <FormField label="Disable menu" orientation="horizontal">
        <Switch v-model="menuDisabled" />
      </FormField>
    </Stack>
    <Stack align="center" gap="sm">
      <SplitButton
        :loading="loading"
        :disabled="disabled"
        :primary-disabled="primaryDisabled"
        :menu-disabled="menuDisabled"
        menu-label="Save options"
        @click="result = 'Action: save'"
      >
        Save changes
        <template #content>
          <DropdownMenuItem @select="result = 'Action: save a copy'">Save a copy</DropdownMenuItem>
        </template>
      </SplitButton>
      <Text role="status" size="sm" tone="muted">{{ result }}</Text>
    </Stack>
  </Stack>
</template>
