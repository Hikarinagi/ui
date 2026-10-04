import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Toggle', [
  {
    name: 'text toggle with class and attrs',
    vue: () => h(V.Toggle, { class: 'w-32', 'data-x': '1' }, () => '仅看已完结'),
    react: () => (
      <R.Toggle className="w-32" data-x="1">
        仅看已完结
      </R.Toggle>
    ),
  },
  {
    name: 'pressed',
    vue: () => h(V.Toggle, { modelValue: true }, () => '加粗'),
    react: () => <R.Toggle value>加粗</R.Toggle>,
  },
  {
    name: 'icon only uses the label',
    vue: () =>
      h(
        V.Toggle,
        { label: '加粗', variant: 'outline', pill: true, disabled: true },
        { icon: () => h('svg', { 'data-icon': 'bold' }) },
      ),
    react: () => (
      <R.Toggle
        label="加粗"
        variant="outline"
        pill
        disabled
        renderIcon={() => <svg data-icon="bold" />}
      />
    ),
  },
  {
    name: 'icon with text keeps button padding',
    vue: () =>
      h(
        V.Toggle,
        { label: '加粗文字' },
        { icon: () => h('svg', { 'data-icon': 'bold' }), default: () => '加粗' },
      ),
    react: () => (
      <R.Toggle label="加粗文字" renderIcon={() => <svg data-icon="bold" />}>
        加粗
      </R.Toggle>
    ),
  },
  {
    name: 'icon receives pressed',
    vue: () =>
      h(
        V.Toggle,
        { label: '收藏', modelValue: true },
        {
          icon: ({ pressed }: { pressed: boolean }) => h('i', { 'data-pressed': String(pressed) }),
        },
      ),
    react: () => (
      <R.Toggle
        label="收藏"
        value
        renderIcon={({ pressed }) => <i data-pressed={String(pressed)} />}
      />
    ),
  },
  {
    name: 'pressed icon replaces the icon',
    vue: () =>
      h(
        V.Toggle,
        { label: '收藏', modelValue: true },
        {
          icon: () => h('svg', { 'data-icon': 'heart' }),
          'pressed-icon': () => h('svg', { 'data-icon': 'heart-on' }),
        },
      ),
    react: () => (
      <R.Toggle
        label="收藏"
        value
        renderIcon={() => <svg data-icon="heart" />}
        pressedIcon={<svg data-icon="heart-on" />}
      />
    ),
  },
  {
    name: 'pressed icon while released',
    vue: () =>
      h(
        V.Toggle,
        { label: '收藏' },
        {
          icon: () => h('svg', { 'data-icon': 'heart' }),
          'pressed-icon': () => h('svg', { 'data-icon': 'heart-on' }),
        },
      ),
    react: () => (
      <R.Toggle
        label="收藏"
        renderIcon={() => <svg data-icon="heart" />}
        pressedIcon={<svg data-icon="heart-on" />}
      />
    ),
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Toggle, { size }, () => size),
    react: () => <R.Toggle size={size}>{size}</R.Toggle>,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `icon size ${size}`,
    vue: () =>
      h(V.Toggle, { size, label: '加粗' }, { icon: () => h('svg', { 'data-icon': 'bold' }) }),
    react: () => <R.Toggle size={size} label="加粗" renderIcon={() => <svg data-icon="bold" />} />,
  })),
  {
    name: 'outline variant',
    vue: () => h(V.Toggle, { variant: 'outline', modelValue: true }, () => '描边'),
    react: () => (
      <R.Toggle variant="outline" value>
        描边
      </R.Toggle>
    ),
  },
  {
    name: 'without ripple',
    vue: () => h(V.Toggle, { ripple: false }, () => '无波纹'),
    react: () => <R.Toggle ripple={false}>无波纹</R.Toggle>,
  },
  {
    name: 'aria-label attribute is replaced by the label prop',
    vue: () => h(V.Toggle, { 'aria-label': '外部' }, () => '文字'),
    react: () => <R.Toggle aria-label="外部">文字</R.Toggle>,
  },
  {
    name: 'tooltip trigger with a provider',
    vue: () =>
      h(V.TooltipProvider, null, () =>
        h(
          V.Toggle,
          { label: '加粗', side: 'bottom' },
          { icon: () => h('svg', { 'data-icon': 'bold' }) },
        ),
      ),
    react: () => (
      <R.TooltipProvider>
        <R.Toggle label="加粗" side="bottom" renderIcon={() => <svg data-icon="bold" />} />
      </R.TooltipProvider>
    ),
  },
  {
    name: 'tooltip disabled keeps the trigger',
    vue: () =>
      h(V.TooltipProvider, null, () =>
        h(
          V.Toggle,
          { label: '加粗', tooltip: false, modelValue: true },
          { icon: () => h('svg', { 'data-icon': 'bold' }) },
        ),
      ),
    react: () => (
      <R.TooltipProvider>
        <R.Toggle label="加粗" tooltip={false} value renderIcon={() => <svg data-icon="bold" />} />
      </R.TooltipProvider>
    ),
  },
  {
    name: 'inside a field',
    vue: () =>
      h(V.FormField, { label: '格式', description: '加粗正文', disabled: true }, () =>
        h(V.Toggle, null, () => '加粗'),
      ),
    react: () => (
      <R.FormField label="格式" description="加粗正文" disabled>
        <R.Toggle>加粗</R.Toggle>
      </R.FormField>
    ),
  },
])
