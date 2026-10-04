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
    { name: '夏目 佳月', cv: '藤咲ウサ' },
    { name: '斑鳩 千鹤', cv: '御苑生メイ' },
  ]
</script>

<template>
  <Stack gap="lg" class="w-full max-w-lg">
    <Stack gap="sm">
      <Text size="sm" tone="faint">primary</Text>
      <Table variant="primary">
        <TableHeader>
          <TableRow>
            <TableHead>角色</TableHead>
            <TableHead>声优</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.name">
            <TableCell>{{ row.name }}</TableCell>
            <TableCell>{{ row.cv }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>

    <Stack gap="sm">
      <Text size="sm" tone="faint">secondary</Text>
      <Table variant="secondary">
        <TableHeader>
          <TableRow>
            <TableHead>角色</TableHead>
            <TableHead>声优</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.name">
            <TableCell>{{ row.name }}</TableCell>
            <TableCell>{{ row.cv }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  </Stack>
</template>
