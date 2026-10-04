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
    { name: 'Volume 1', date: '2021-03-10' },
    { name: 'Volume 2', date: '2021-09-10' },
    { name: 'Volume 3', date: '2022-02-10' },
  ]
</script>

<template>
  <Stack gap="lg" class="w-full max-w-lg">
    <Stack gap="sm">
      <Text size="sm" tone="faint">comfortable (default)</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Volume</TableHead>
            <TableHead align="end">Release</TableHead>
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
            <TableHead>Volume</TableHead>
            <TableHead align="end">Release</TableHead>
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
