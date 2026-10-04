import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('InputGroup', [
  {
    name: 'addon, input and button',
    vue: () =>
      h(V.InputGroup, null, () => [
        h(V.InputGroupAddon, null, () => 'https://'),
        h(V.Input, { 'aria-label': '域名' }),
        h(V.Button, null, () => '确定'),
      ]),
    react: () => (
      <R.InputGroup>
        <R.InputGroupAddon>https://</R.InputGroupAddon>
        <R.Input aria-label="域名" />
        <R.Button>确定</R.Button>
      </R.InputGroup>
    ),
  },
  {
    name: 'hero: prefix and suffix',
    vue: () =>
      h(V.InputGroup, { class: 'w-80' }, () => [
        h(V.InputGroupAddon, null, () => 'https://'),
        h(V.Input, { modelValue: 'shion', 'aria-label': '站点名' }),
        h(V.InputGroupAddon, null, () => '.hoshimi.moe'),
      ]),
    react: () => (
      <R.InputGroup className="w-80">
        <R.InputGroupAddon>https://</R.InputGroupAddon>
        <R.Input value="shion" aria-label="站点名" />
        <R.InputGroupAddon>.hoshimi.moe</R.InputGroupAddon>
      </R.InputGroup>
    ),
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () =>
      h(V.InputGroup, { variant }, () => [
        h(V.InputGroupAddon, null, () => '@'),
        h(V.Input, { 'aria-label': variant, placeholder: variant }),
      ]),
    react: () => (
      <R.InputGroup variant={variant}>
        <R.InputGroupAddon>@</R.InputGroupAddon>
        <R.Input aria-label={variant} placeholder={variant} />
      </R.InputGroup>
    ),
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size} reaches embedded controls`,
    vue: () =>
      h(V.InputGroup, { size }, () => [
        h(V.InputGroupAddon, null, () => 'https://'),
        h(V.Input, { clearable: true, modelValue: '星见', 'aria-label': size }),
        h(V.Button, { size }, () => '确定'),
      ]),
    react: () => (
      <R.InputGroup size={size}>
        <R.InputGroupAddon>https://</R.InputGroupAddon>
        <R.Input clearable value="星见" aria-label={size} />
        <R.Button size={size}>确定</R.Button>
      </R.InputGroup>
    ),
  })),
  {
    name: 'invalid and disabled reach every input',
    vue: () =>
      h(V.InputGroup, { invalid: true, disabled: true }, () => [
        h(V.Input, { 'aria-label': '域名' }),
        h(V.NumberInput, { 'aria-label': '数量' }),
      ]),
    react: () => (
      <R.InputGroup invalid disabled>
        <R.Input aria-label="域名" />
        <R.NumberInput aria-label="数量" />
      </R.InputGroup>
    ),
  },
  {
    name: 'number input and search input in groups',
    vue: () =>
      h('div', null, [
        h(V.InputGroup, null, () => [
          h(V.InputGroupAddon, null, () => h('svg', { 'data-icon': 'yen' })),
          h(V.NumberInput, { modelValue: 120, min: 0, 'aria-label': '价格' }),
        ]),
        h(V.InputGroup, { variant: 'bare' }, () => [
          h(V.SearchInput, { modelValue: '狼', 'aria-label': '搜索' }),
          h(V.Button, null, () => '搜索'),
        ]),
      ]),
    react: () => (
      <div>
        <R.InputGroup>
          <R.InputGroupAddon>
            <svg data-icon="yen" />
          </R.InputGroupAddon>
          <R.NumberInput value={120} min={0} aria-label="价格" />
        </R.InputGroup>
        <R.InputGroup variant="bare">
          <R.SearchInput value="狼" aria-label="搜索" />
          <R.Button>搜索</R.Button>
        </R.InputGroup>
      </div>
    ),
  },
  {
    name: 'icon button',
    vue: () =>
      h(V.InputGroup, null, () => [
        h(V.Input, { modelValue: 'HINA-2026', readonly: true, 'aria-label': '邀请码' }),
        h(V.IconButton, { label: '复制', variant: 'outline', tone: 'neutral' }, () => h('svg')),
      ]),
    react: () => (
      <R.InputGroup>
        <R.Input value="HINA-2026" readOnly aria-label="邀请码" />
        <R.IconButton label="复制" variant="outline" tone="neutral">
          <svg />
        </R.IconButton>
      </R.InputGroup>
    ),
  },
  {
    name: 'addon alone',
    vue: () => h(V.InputGroupAddon, { class: 'px-2' }, () => 'kg'),
    react: () => <R.InputGroupAddon className="px-2">kg</R.InputGroupAddon>,
  },
])
