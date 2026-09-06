<script setup lang="ts">
  import { useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'
  import { panelActions, panelBody, panelHeader, panelIcon, panelTitle } from './panel.variants'

  defineOptions({ name: 'HnPanel' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      count?: number
      level?: 2 | 3 | 4
      padded?: boolean
      class?: string
    }>(),
    { level: 2, padded: true },
  )

  const slots = useSlots()
</script>

<template>
  <Card data-hn-panel :padded="false" :class="cn('flex flex-col', props.class)">
    <div :class="panelHeader()">
      <div class="flex min-w-0 flex-col gap-1">
        <div :class="panelTitle()">
          <span v-if="slots.icon" :class="panelIcon()" aria-hidden="true">
            <slot name="icon" />
          </span>
          <Heading :level="props.level" size="base" class="min-w-0">
            <slot name="title">{{ props.title }}</slot>
          </Heading>
          <Text
            v-if="props.count !== undefined"
            as="span"
            tone="muted"
            size="sm"
            class="tabular-nums"
          >
            {{ props.count }}
          </Text>
        </div>
        <Text v-if="props.description || slots.description" tone="muted" size="sm">
          <slot name="description">{{ props.description }}</slot>
        </Text>
      </div>
      <div v-if="slots.actions" :class="panelActions()">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="slots.default" :class="panelBody({ padded: props.padded })">
      <slot />
    </div>
  </Card>
</template>
