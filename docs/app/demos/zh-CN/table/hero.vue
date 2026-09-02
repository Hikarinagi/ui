<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'

  const games = [
    { title: 'ATRI -My Dear Moments-', brand: 'ANIPLEX.EXE', date: '2020-06-19' },
    { title: 'Summer Pockets', brand: 'Key', date: '2018-06-29' },
    { title: 'サクラノ詩', brand: '枕', date: '2015-10-23' },
  ]
</script>

<template>
  <Table caption="收录的部分作品" class="w-full max-w-xl">
    <TableHeader>
      <TableRow>
        <TableHead>作品</TableHead>
        <TableHead>品牌</TableHead>
        <TableHead align="end">发售日</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="game in games" :key="game.title">
        <TableCell>{{ game.title }}</TableCell>
        <TableCell>{{ game.brand }}</TableCell>
        <TableCell align="end">{{ game.date }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
