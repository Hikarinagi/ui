<script setup lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/vue'

  const works = [
    {
      title: 'ATRI -My Dear Moments-',
      brand: 'ANIPLEX.EXE',
      date: '2020-06-19',
      platform: 'Windows',
      language: 'Japanese / Simplified Chinese',
      length: 'About 20 hours',
      rating: '8.9',
    },
    {
      title: 'Summer Pockets',
      brand: 'Key',
      date: '2018-06-29',
      platform: 'Windows',
      language: 'Japanese',
      length: 'About 40 hours',
      rating: '8.5',
    },
    {
      title: 'サクラノ詩',
      brand: '枕',
      date: '2015-10-23',
      platform: 'Windows',
      language: 'Japanese',
      length: 'About 50 hours',
      rating: '9.0',
    },
  ]
</script>

<template>
  <Table class="w-full max-w-lg [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
    <TableHeader>
      <TableRow>
        <TableHead sticky>Title</TableHead>
        <TableHead>Brand</TableHead>
        <TableHead>Release</TableHead>
        <TableHead>Platform</TableHead>
        <TableHead>Language</TableHead>
        <TableHead>Length</TableHead>
        <TableHead align="end">Rating</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="work in works" :key="work.title">
        <TableCell sticky>{{ work.title }}</TableCell>
        <TableCell>{{ work.brand }}</TableCell>
        <TableCell>{{ work.date }}</TableCell>
        <TableCell>{{ work.platform }}</TableCell>
        <TableCell>{{ work.language }}</TableCell>
        <TableCell>{{ work.length }}</TableCell>
        <TableCell align="end">{{ work.rating }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
