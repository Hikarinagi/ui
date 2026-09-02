<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'
</script>

<template>
  <Table class="w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>Volume</TableHead>
        <TableHead>Pages</TableHead>
        <TableHead>Release</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Volume 1</TableCell>
        <TableCell>328</TableCell>
        <TableCell>2021-03-10</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Volume 2</TableCell>
        <TableCell>304</TableCell>
        <TableCell>2021-09-10</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Volume 3</TableCell>
        <TableCell>352</TableCell>
        <TableCell>2022-02-10</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
