<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {
    Affix,
    Card,
    Checkbox,
    Inline,
    NumberInput,
    ScrollArea,
    Stack,
    Switch,
    Tag,
    Text,
  } from '@hina-ui/vue'
  import { affixChecklist } from '../../affix'

  const disabled = ref(false)
  const offset = ref(12)
  const checked = ref<boolean[]>(Array(6).fill(false))
  const completed = computed(() => checked.value.filter(Boolean).length)
  const items = affixChecklist('zh-CN')
</script>

<template>
  <Stack class="w-full max-w-xl">
    <Inline align="center" gap="lg" wrap>
      <Switch v-model="disabled">禁用吸附</Switch>
      <Inline align="center" gap="sm">
        <Text size="sm" tone="muted">顶部偏移</Text>
        <NumberInput
          v-model="offset"
          :min="0"
          :max="40"
          :step="4"
          size="sm"
          aria-label="顶部偏移（px）"
          class="w-28"
        />
      </Inline>
    </Inline>
    <Card :padded="false">
      <ScrollArea class="h-80" :shadow="false" focusable label="发布前检查清单">
        <Stack class="p-4" gap="lg">
          <Text size="sm" tone="muted">
            向下滚动检查清单。工具栏到达指定偏移后会停住，勾选进度始终可见。
          </Text>
          <Affix v-slot="{ affixed }" :offset="offset" :disabled="disabled">
            <Card class="p-3" :class="affixed ? 'shadow-md' : 'shadow-none'">
              <Inline align="center" justify="between" gap="sm" wrap>
                <Text size="sm" weight="medium">发布前检查 · {{ completed }}/6</Text>
                <Tag size="sm" :tone="affixed ? 'accent' : 'neutral'">
                  {{ affixed ? '已吸附' : '随内容滚动' }}
                </Tag>
              </Inline>
            </Card>
          </Affix>
          <Checkbox
            v-for="(item, index) in items"
            :key="item.title"
            v-model="checked[index]"
            :description="item.description"
            block
          >
            {{ item.title }}
          </Checkbox>
          <Text size="xs" tone="muted">吸附不会移动或重建工具栏里的控件。</Text>
        </Stack>
      </ScrollArea>
    </Card>
  </Stack>
</template>
