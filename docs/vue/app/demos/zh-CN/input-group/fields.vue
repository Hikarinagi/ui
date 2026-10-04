<script setup lang="ts">
  import { ref } from 'vue'
  import { JapaneseYen } from '@lucide/vue'
  import {
    Button,
    InputGroup,
    InputGroupAddon,
    NumberInput,
    SearchInput,
    Stack,
  } from '@hina-ui/vue'

  const price = ref(128)
  const query = ref('')
</script>

<template>
  <Stack class="w-80">
    <InputGroup>
      <InputGroupAddon>
        <JapaneseYen />
      </InputGroupAddon>
      <NumberInput v-model="price" :min="0" aria-label="价格" />
    </InputGroup>
    <InputGroup>
      <SearchInput v-model="query" aria-label="搜索" placeholder="搜索作品" />
      <Button>搜索</Button>
    </InputGroup>
  </Stack>
</template>
