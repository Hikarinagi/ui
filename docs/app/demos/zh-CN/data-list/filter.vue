<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { Button, DataList, Empty, SearchInput, Select, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN')
  const query = ref('')
  const order = ref<string | number | null>('release')
  const page = ref(1)
  const options = [
    { value: 'release', label: '发行时间降序' },
    { value: 'title', label: '名称排序' },
  ]
  const filtered = computed(() =>
    items
      .filter(item =>
        `${item.title} ${item.originalTitle} ${item.developer}`
          .toLocaleLowerCase()
          .includes(query.value.trim().toLocaleLowerCase()),
      )
      .toSorted((a, b) =>
        order.value === 'release'
          ? b.released.localeCompare(a.released)
          : a.title.localeCompare(b.title),
      ),
  )
  watch([query, order], () => {
    page.value = 1
  })
</script>
<template>
  <DataList
    v-model:page="page"
    :items="filtered"
    item-key="id"
    item-title="title"
    item-description="subtitle"
    pagination
    :page-size="10"
    label="筛选结果"
    class="max-w-2xl"
  >
    <template #header>
      <SearchInput
        v-model="query"
        placeholder="搜索名称或开发商"
        aria-label="搜索"
        class="w-full @lg/hn-data-list:min-w-0 @lg/hn-data-list:flex-1"
      />
      <Select
        v-model="order"
        :options="options"
        aria-label="排序方式"
        class="w-full @lg/hn-data-list:w-44"
      />
    </template>
    <template #meta="{ item }">
      <Text size="xs" tone="muted">{{ item.released }}</Text>
    </template>
    <template #empty>
      <Empty title="没有匹配的作品" size="sm" :icon="false">
        <template #actions>
          <Button variant="outline" tone="neutral" size="sm" @click="query = ''">清空搜索</Button>
        </template>
      </Empty>
    </template>
    <template #footer="{ total }">
      <Text size="xs" tone="muted">共 {{ total }} 条结果</Text>
    </template>
  </DataList>
</template>
