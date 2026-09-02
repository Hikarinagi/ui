<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'
</script>

<template>
  <Table class="w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>卷次</TableHead>
        <TableHead>页数</TableHead>
        <TableHead>发售日</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>第一卷</TableCell>
        <TableCell>328</TableCell>
        <TableCell>2021-03-10</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>第二卷</TableCell>
        <TableCell>304</TableCell>
        <TableCell>2021-09-10</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>第三卷</TableCell>
        <TableCell>352</TableCell>
        <TableCell>2022-02-10</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
