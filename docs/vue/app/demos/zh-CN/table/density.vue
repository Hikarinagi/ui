<script setup lang="ts">
  import {
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Text,
  } from '@hina-ui/vue'

  const rows = [
    { name: '第一卷', date: '2021-03-10' },
    { name: '第二卷', date: '2021-09-10' },
    { name: '第三卷', date: '2022-02-10' },
  ]
</script>

<template>
  <Stack gap="lg" class="w-full max-w-lg">
    <Stack gap="sm">
      <Text size="sm" tone="faint">comfortable（默认）</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>卷次</TableHead>
            <TableHead align="end">发售日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.name">
            <TableCell>{{ row.name }}</TableCell>
            <TableCell align="end">{{ row.date }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>

    <Stack gap="sm" data-density="compact">
      <Text size="sm" tone="faint">compact</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>卷次</TableHead>
            <TableHead align="end">发售日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.name">
            <TableCell>{{ row.name }}</TableCell>
            <TableCell align="end">{{ row.date }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  </Stack>
</template>
