<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'

  const episodes = Array.from({ length: 24 }, (_, index) => ({
    no: index + 1,
    title: `Episode ${index + 1}`,
    date: `2024-${String(Math.floor(index / 4) + 1).padStart(2, '0')}-15`,
  }))
</script>

<template>
  <Table sticky-header class="max-h-72 w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>No.</TableHead>
        <TableHead>Title</TableHead>
        <TableHead align="end">Updated</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="episode in episodes" :key="episode.no">
        <TableCell>{{ episode.no }}</TableCell>
        <TableCell>{{ episode.title }}</TableCell>
        <TableCell align="end">{{ episode.date }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
