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
      <NumberInput v-model="price" :min="0" aria-label="Price" />
    </InputGroup>
    <InputGroup>
      <SearchInput v-model="query" aria-label="Search" placeholder="Search works" />
      <Button>Search</Button>
    </InputGroup>
  </Stack>
</template>
