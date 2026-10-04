<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Listbox, Stack, Switch } from '@hina-ui/vue'
  const padded = ref(false)
  const selected = ref('a')
  const options = [
    { value: 'a', label: '选项 A' },
    { label: '分组', options: [{ value: 'b', label: '选项 B' }] },
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
        aria-label="列表外围留白"
      />
    </Card>
  </Stack>
</template>
