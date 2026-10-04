<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, Inline, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/vue'

  const loading = ref(false)
  const immediate = ref(false)
  const result = ref('')

  async function request(ms: number) {
    loading.value = true
    result.value = ''
    await new Promise(resolve => setTimeout(resolve, ms))
    loading.value = false
    result.value = `Returned after ${ms} ms`
  }
</script>

<template>
  <Stack gap="md" align="start">
    <Inline gap="md" align="center">
      <Button variant="outline" tone="neutral" :disabled="loading" @click="request(150)">
        Fast request
      </Button>
      <Button variant="outline" tone="neutral" :disabled="loading" @click="request(1500)">
        Slow request
      </Button>
      <Switch v-model="immediate">Show at once</Switch>
    </Inline>
    <Card class="relative w-96">
      <Text>
        {{
          result ||
          'With the default delay the fast request never shows the overlay; with "Show at once" both do.'
        }}
      </Text>
      <LoadingOverlay :visible="loading" :delay="immediate ? 0 : undefined" />
    </Card>
  </Stack>
</template>
