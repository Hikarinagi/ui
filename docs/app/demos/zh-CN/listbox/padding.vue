<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Listbox, Stack, Switch } from '@hina-ui/vue'
  const padded = ref(false)
  const selected = ref('reading')
  const options = [
    { value: 'reading', label: '在读' },
    { label: '归档', options: [{ value: 'finished', label: '已读' }] },
  ]
</script>
<template>
  <Stack class="w-64">
    <Switch v-model="padded" control-placement="end" block>列表外围留白</Switch>
    <Card :padded="false">
      <Listbox
        v-model="selected"
        :options="options"
        variant="bare"
        :padded="padded"
        aria-label="阅读状态"
      />
    </Card>
  </Stack>
</template>
