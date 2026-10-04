import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Switch', [
  {
    name: 'bare',
    vue: () => h(V.Switch, { 'aria-label': '自动播放' }),
    react: () => <R.Switch aria-label="自动播放" />,
  },
  {
    name: 'label, description, class and attrs on the track',
    vue: () =>
      h(
        V.Switch,
        { description: '播放完自动跳到下一话', class: 'w-64', id: 'autoplay', 'data-x': '1' },
        () => '自动播放',
      ),
    react: () => (
      <R.Switch description="播放完自动跳到下一话" className="w-64" id="autoplay" data-x="1">
        自动播放
      </R.Switch>
    ),
  },
  {
    name: 'on',
    vue: () => h(V.Switch, { modelValue: true }, () => '开'),
    react: () => <R.Switch checked>开</R.Switch>,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Switch, { size, description: 'd' }, () => size),
    react: () => (
      <R.Switch size={size} description="d">
        {size}
      </R.Switch>
    ),
  })),
  {
    name: 'disabled on',
    vue: () => h(V.Switch, { disabled: true, modelValue: true }, () => '禁用'),
    react: () => (
      <R.Switch disabled checked>
        禁用
      </R.Switch>
    ),
  },
  {
    name: 'invalid',
    vue: () => h(V.Switch, { invalid: true }, () => '无效'),
    react: () => <R.Switch invalid>无效</R.Switch>,
  },
  {
    name: 'control at the end, block',
    vue: () =>
      h(
        V.Switch,
        { controlPlacement: 'end', block: true, description: '同步阅读进度' },
        () => '同步',
      ),
    react: () => (
      <R.Switch controlPlacement="end" block description="同步阅读进度">
        同步
      </R.Switch>
    ),
  },
  {
    name: 'name renders the hidden input',
    vue: () => h(V.Switch, { name: 'public', modelValue: true, required: true }, () => '公开'),
    react: () => (
      <R.Switch name="public" checked required>
        公开
      </R.Switch>
    ),
  },
  {
    name: 'inside a field without a heading',
    vue: () =>
      h(V.FormField, { orientation: 'horizontal', error: 'Save failed' }, () =>
        h(V.Switch, { block: true, controlPlacement: 'end' }, () => 'Sync progress'),
      ),
    react: () => (
      <R.FormField orientation="horizontal" error="Save failed">
        <R.Switch block controlPlacement="end">
          Sync progress
        </R.Switch>
      </R.FormField>
    ),
  },
])
