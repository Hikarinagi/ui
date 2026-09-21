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
  const items = affixChecklist('en')
</script>

<template>
  <Stack class="w-full max-w-xl">
    <Inline align="center" gap="lg" wrap>
      <Switch v-model="disabled">Disable affixing</Switch>
      <Inline align="center" gap="sm">
        <Text size="sm" tone="muted">Top offset</Text>
        <NumberInput
          v-model="offset"
          :min="0"
          :max="40"
          :step="4"
          size="sm"
          aria-label="Top offset in pixels"
          class="w-28"
        />
      </Inline>
    </Inline>
    <Card :padded="false">
      <ScrollArea class="h-80" :shadow="false" focusable label="Release checklist">
        <Stack class="p-4" gap="lg">
          <Text size="sm" tone="muted">
            Scroll through the checklist. The toolbar stops at the chosen offset so your progress
            stays visible.
          </Text>
          <Affix v-slot="{ affixed }" :offset="offset" :disabled="disabled">
            <Card class="p-3" :class="affixed ? 'shadow-md' : 'shadow-none'">
              <Inline align="center" justify="between" gap="sm" wrap>
                <Text size="sm" weight="medium">Release checks · {{ completed }}/6</Text>
                <Tag size="sm" :tone="affixed ? 'accent' : 'neutral'">
                  {{ affixed ? 'Affixed' : 'In flow' }}
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
          <Text size="xs" tone="muted">
            Affixing never moves or remounts controls inside the toolbar.
          </Text>
        </Stack>
      </ScrollArea>
    </Card>
  </Stack>
</template>
