<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Stepper, Button, Card, FormField, Input, Inline, Stack, Text } from '@hina-ui/vue'

  const name = ref('')
  const error = ref('')
  const items = computed(() => [
    { title: '步骤 A', error: !!error.value },
    { title: '步骤 B' },
    { title: '步骤 C' },
  ])

  async function beforeChange(step: number, previousStep: number) {
    if (step <= previousStep || previousStep !== 1) return true
    await new Promise(resolve => setTimeout(resolve, 700))
    error.value = name.value.trim() ? '' : '请填写名称'
    return !error.value
  }
</script>

<template>
  <Stepper :items="items" :before-change="beforeChange">
    <template #default="{ step, next, prev, pending, canNext, canPrev }">
      <Card>
        <Stack gap="lg">
          <FormField v-if="step === 1" label="名称" :error="error">
            <Input v-model="name" :disabled="pending" />
          </FormField>
          <Text v-else>第 {{ step }} 步</Text>
          <Inline justify="between">
            <Button variant="outline" tone="neutral" :disabled="!canPrev" @click="prev">
              上一步
            </Button>
            <Button :loading="pending" :disabled="!canNext" @click="next">下一步</Button>
          </Inline>
        </Stack>
      </Card>
    </template>
  </Stepper>
</template>
