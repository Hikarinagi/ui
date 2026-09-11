<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Listbox, Stack, Switch } from '@hina-ui/vue'
  const padded = ref(false)
  const selected = ref('reading')
  const options = [
    { value: 'reading', label: 'Reading' },
    { label: 'Archive', options: [{ value: 'finished', label: 'Finished' }] },
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
        aria-label="Reading status"
      />
    </Card>
  </Stack>
</template>
