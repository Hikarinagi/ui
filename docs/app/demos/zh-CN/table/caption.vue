<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'
</script>

<template>
  <Table caption="单行本发售一览" class="w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>卷次</TableHead>
        <TableHead>发售日</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>第一卷</TableCell>
        <TableCell>2021-03-10</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>第二卷</TableCell>
        <TableCell>2021-09-10</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
