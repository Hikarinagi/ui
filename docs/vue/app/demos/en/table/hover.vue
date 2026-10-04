<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'

  const specs = [
    { key: 'Format', value: 'Download / Physical' },
    { key: 'Length', value: 'About 20 hours' },
    { key: 'Language', value: 'Japanese / Simplified Chinese' },
  ]
</script>

<template>
  <Table :hover="false" class="w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>Item</TableHead>
        <TableHead>Value</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="spec in specs" :key="spec.key">
        <TableCell>{{ spec.key }}</TableCell>
        <TableCell>{{ spec.value }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
