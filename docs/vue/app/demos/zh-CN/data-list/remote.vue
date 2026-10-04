<script setup lang="ts">
  import { onMounted, onScopeDispose, ref, watch } from 'vue'
  import { useRuntimeConfig } from '#app'
  import { Button, DataList, Empty, Switch, Text } from '@hina-ui/vue'
  import type { DataListDemoItem } from '../../data-list'

  const baseURL = useRuntimeConfig().app.baseURL
  const page = ref(1)
  const rows = ref<DataListDemoItem[]>([])
  const total = ref<number>()
  const loading = ref(true)
  const knownTotal = ref(true)
  const hasNextPage = ref(false)
  const failed = ref(false)
  let controller: AbortController | undefined
  async function load() {
    controller?.abort()
    const request = new AbortController()
    controller = request
    loading.value = true
    failed.value = false
    try {
      const response = await fetch(`${baseURL}demo/data-list/page-${page.value}.json`, {
        signal: request.signal,
      })
      if (!response.ok) throw new Error(String(response.status))
      const data = (await response.json()) as {
        items: Omit<DataListDemoItem, 'subtitle'>[]
        total: number
        hasNextPage: boolean
      }
      if (request.signal.aborted) return
      rows.value = data.items.map(item => ({
        ...item,
        title: item.title,
        subtitle: item.title === item.originalTitle ? '' : item.originalTitle,
      }))
      total.value = data.total
      hasNextPage.value = data.hasNextPage
    } catch {
      if (!request.signal.aborted) {
        rows.value = []
        failed.value = true
      }
    } finally {
      if (!request.signal.aborted) loading.value = false
    }
  }
  onMounted(load)
  watch(page, load)
  onScopeDispose(() => controller?.abort())
</script>
<template>
  <DataList
    v-model:page="page"
    :items="rows"
    item-key="id"
    item-title="title"
    item-description="subtitle"
    pagination
    manual
    :page-size="10"
    :total="knownTotal ? total : undefined"
    :has-next-page="hasNextPage"
    :loading="loading"
    :min-height="400"
    class="max-w-2xl"
    label="远程条目"
  >
    <template #header>
      <Switch v-model="knownTotal" :disabled="loading">已知总条数</Switch>
      <Button variant="ghost" tone="neutral" size="sm" :disabled="loading" @click="load">
        刷新
      </Button>
    </template>
    <template #meta="{ item }">
      <Text size="xs" tone="muted">{{ item.released }}</Text>
    </template>
    <template #empty>
      <Empty :title="failed ? '加载失败' : '暂无数据'" size="sm">
        <template v-if="failed" #actions><Button size="sm" @click="load">重试</Button></template>
      </Empty>
    </template>
  </DataList>
</template>
