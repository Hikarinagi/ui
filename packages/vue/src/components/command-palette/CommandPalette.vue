<script setup lang="ts">
  import { Search } from '@lucide/vue'
  import {
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
    ListboxContent,
    ListboxFilter,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxRoot,
    VisuallyHidden,
  } from 'reka-ui'
  import { computed, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectLabel, selectListBody } from '../select/select.variants'
  import CommandPaletteItem from './CommandPaletteItem.vue'
  import { useHotkey } from './composables/useHotkey'
  import {
    commandCard,
    commandEmpty,
    commandInput,
    commandInputRow,
    commandList,
    commandWrapper,
  } from './command-palette.variants'
  import type { CommandItem, CommandItems } from './types'
  import { filterCommands } from './utils/match'

  defineOptions({ name: 'HnCommandPalette', inheritAttrs: false })

  const props = defineProps<{
    items: CommandItems
    placeholder?: string
    label?: string
    hotkey?: string
    ignoreFilter?: boolean
    class?: string
  }>()

  const emit = defineEmits<{ select: [item: CommandItem] }>()

  const open = defineModel<boolean>('open', { default: false })
  const search = defineModel<string>('search', { default: '' })

  const t = useUiLocale()

  const sections = computed(() =>
    filterCommands(props.items, props.ignoreFilter ? '' : search.value),
  )
  const label = computed(() => props.label ?? t.value.command.label)

  useHotkey(
    () => props.hotkey,
    () => {
      open.value = !open.value
    },
  )

  watch(open, value => {
    if (!value) search.value = ''
  })

  function select(item: CommandItem) {
    item.onSelect?.()
    emit('select', item)
    open.value = false
  }
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="hn-scrim" />
      <div :class="commandWrapper()">
        <DialogContent as-child>
          <Card
            v-bind="$attrs"
            data-hn-command-palette
            :padded="false"
            :class="cn(commandCard(), props.class)"
          >
            <VisuallyHidden>
              <DialogTitle>{{ label }}</DialogTitle>
            </VisuallyHidden>
            <ListboxRoot
              selection-behavior="replace"
              highlight-on-hover
              class="flex min-h-0 flex-col"
            >
              <div :class="commandInputRow()">
                <Search aria-hidden="true" />
                <ListboxFilter
                  v-model="search"
                  auto-focus
                  :placeholder="props.placeholder ?? t.command.placeholder"
                  :aria-label="label"
                  :class="commandInput()"
                />
              </div>
              <ScrollArea :class="commandList()">
                <ListboxContent :aria-label="label" :class="selectListBody()">
                  <template v-for="section in sections" :key="section.key">
                    <ListboxGroup v-if="section.label">
                      <ListboxGroupLabel :class="selectLabel()">
                        {{ section.label }}
                      </ListboxGroupLabel>
                      <CommandPaletteItem
                        v-for="match in section.matches"
                        :key="match.item.id"
                        :match="match"
                        @select="select(match.item)"
                      />
                    </ListboxGroup>
                    <template v-else>
                      <CommandPaletteItem
                        v-for="match in section.matches"
                        :key="match.item.id"
                        :match="match"
                        @select="select(match.item)"
                      />
                    </template>
                  </template>
                  <div v-if="sections.length === 0" :class="commandEmpty()">
                    {{ t.command.empty }}
                  </div>
                </ListboxContent>
              </ScrollArea>
            </ListboxRoot>
          </Card>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
