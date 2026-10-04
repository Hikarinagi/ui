<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'

  const rows = [
    { platform: 'Windows', release: '2020-06-19', price: '3,278 円' },
    { platform: 'Nintendo Switch', release: '2022-03-24', price: '4,180 円' },
    { platform: 'PlayStation 4', release: '2022-03-24', price: '4,180 円' },
  ]
</script>

<template>
  <Table class="w-full max-w-xl">
    <TableHeader>
      <TableRow>
        <TableHead>Platform</TableHead>
        <TableHead>Release</TableHead>
        <TableHead align="end">Price</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in rows" :key="row.platform">
        <TableHead scope="row">{{ row.platform }}</TableHead>
        <TableCell>{{ row.release }}</TableCell>
        <TableCell align="end">{{ row.price }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
