<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Stepper, Button, Card, FormField, Input, Inline, Stack, Text } from '@hina-ui/vue'

  const name = ref('')
  const error = ref('')
  const items = computed(() => [
    { title: 'Step A', error: !!error.value },
    { title: 'Step B' },
    { title: 'Step C' },
  ])

  async function beforeChange(step: number, previousStep: number) {
    if (step <= previousStep || previousStep !== 1) return true
    await new Promise(resolve => setTimeout(resolve, 700))
    error.value = name.value.trim() ? '' : 'Enter a name'
    return !error.value
  }
</script>

<template>
  <Stepper :items="items" :before-change="beforeChange">
    <template #default="{ step, next, prev, pending, canNext, canPrev }">
      <Card>
        <Stack gap="lg">
          <FormField v-if="step === 1" label="Name" :error="error">
            <Input v-model="name" :disabled="pending" />
          </FormField>
          <Text v-else>Step {{ step }}</Text>
          <Inline justify="between">
            <Button variant="outline" tone="neutral" :disabled="!canPrev" @click="prev">
              Previous
            </Button>
            <Button :loading="pending" :disabled="!canNext" @click="next">Next</Button>
          </Inline>
        </Stack>
      </Card>
    </template>
  </Stepper>
</template>
