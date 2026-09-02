<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Checkbox, Stack } from '@hina-ui/vue'

  const types = ['Galgame', '轻小说', '漫画']
  const picked = ref(['Galgame'])

  const all = computed<boolean | 'indeterminate'>({
    get: () =>
      picked.value.length === 0
        ? false
        : picked.value.length === types.length
          ? true
          : 'indeterminate',
    set: value => {
      picked.value = value === true ? [...types] : []
    },
  })

  function toggle(type: string, on: boolean | 'indeterminate') {
    picked.value = on === true ? [...picked.value, type] : picked.value.filter(t => t !== type)
  }
</script>

<template>
  <Stack gap="sm">
    <Checkbox v-model="all">全部类型</Checkbox>
    <Stack gap="sm" class="ps-6">
      <Checkbox
        v-for="type in types"
        :key="type"
        :model-value="picked.includes(type)"
        @update:model-value="toggle(type, $event)"
      >
        {{ type }}
      </Checkbox>
    </Stack>
  </Stack>
</template>
