<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'
</script>

<template>
  <Table caption="Tankobon release schedule" class="w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>Volume</TableHead>
        <TableHead>Release</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Volume 1</TableCell>
        <TableCell>2021-03-10</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Volume 2</TableCell>
        <TableCell>2021-09-10</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
