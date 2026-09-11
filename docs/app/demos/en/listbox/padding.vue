<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Listbox, Stack, Switch } from '@hina-ui/vue'
  const padded = ref(false)
  const selected = ref('a')
  const options = [
    { value: 'a', label: 'Option A' },
    { label: 'Group', options: [{ value: 'b', label: 'Option B' }] },
  ]
</script>
<template>
  <Stack class="w-64">
    <Switch v-model="padded" control-placement="end" block>List padding</Switch>
    <Card :padded="false">
      <Listbox
        v-model="selected"
        :options="options"
        variant="bare"
        :padded="padded"
        aria-label="List padding"
      />
    </Card>
  </Stack>
</template>
