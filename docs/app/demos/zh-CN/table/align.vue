<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'

  const volumes = [
    { name: '第一卷', chapters: 12, rating: '8.6' },
    { name: '第二卷', chapters: 9, rating: '9.1' },
    { name: '第三卷', chapters: 14, rating: '8.8' },
  ]
</script>

<template>
  <Table class="w-full max-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>卷次</TableHead>
        <TableHead align="center">章节数</TableHead>
        <TableHead align="end">评分</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="volume in volumes" :key="volume.name">
        <TableCell>{{ volume.name }}</TableCell>
        <TableCell align="center">{{ volume.chapters }}</TableCell>
        <TableCell align="end">{{ volume.rating }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
