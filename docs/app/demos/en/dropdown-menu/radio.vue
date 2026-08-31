<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Button,
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
  } from '@hikarinagi/ui'

  const sort = ref('newest')
  const labels: Record<string, string> = {
    newest: 'Newest',
    popular: 'Most saved',
    rating: 'Highest rated',
  }
</script>

<template>
  <DropdownMenu label="Sort by">
    <Button variant="outline" tone="neutral">Sort: {{ labels[sort] }}</Button>
    <template #content>
      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="sort">
        <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="popular">Most saved</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="rating">Highest rated</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </template>
  </DropdownMenu>
</template>
