<script setup lang="ts">
  import { ref } from 'vue'
  import { Pagination, Text } from '@hina-ui/vue'

  const page = ref(2)
  const numerals = ['I', 'II', 'III', 'IV', 'V']
</script>

<template>
  <Pagination v-model="page" :total="50">
    <template #page="{ page: number, selected }">
      <Text as="span" :weight="selected ? 'semibold' : 'normal'" class="text-inherit">
        {{ numerals[number - 1] }}
      </Text>
    </template>
  </Pagination>
</template>
