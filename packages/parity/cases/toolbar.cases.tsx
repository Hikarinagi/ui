import { h } from 'vue'
import VToolbar from '@hina-ui/vue/components/toolbar/Toolbar.vue'
import VToolbarButton from '@hina-ui/vue/components/toolbar/ToolbarButton.vue'
import VToolbarLink from '@hina-ui/vue/components/toolbar/ToolbarLink.vue'
import VToolbarSeparator from '@hina-ui/vue/components/toolbar/ToolbarSeparator.vue'
import VToolbarToggleGroup from '@hina-ui/vue/components/toolbar/ToolbarToggleGroup.vue'
import VToolbarToggleItem from '@hina-ui/vue/components/toolbar/ToolbarToggleItem.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VIconButton from '@hina-ui/vue/components/icon-button/IconButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { Toolbar } from '@hina-ui/react/components/toolbar/Toolbar'
import { ToolbarButton } from '@hina-ui/react/components/toolbar/ToolbarButton'
import { ToolbarLink } from '@hina-ui/react/components/toolbar/ToolbarLink'
import { ToolbarSeparator } from '@hina-ui/react/components/toolbar/ToolbarSeparator'
import { ToolbarToggleGroup } from '@hina-ui/react/components/toolbar/ToolbarToggleGroup'
import { ToolbarToggleItem } from '@hina-ui/react/components/toolbar/ToolbarToggleItem'
import { Button } from '@hina-ui/react/components/button/Button'
import { IconButton } from '@hina-ui/react/components/icon-button/IconButton'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineCases } from '../src/cases'

const icon = (name: string) => () => h('svg', { 'data-icon': name })

const basicVue = (props: Record<string, unknown> = {}) =>
  h(VToolbar, { label: 'Actions', ...props }, () => [
    h(VToolbarButton, {}, () => 'First'),
    h(VToolbarButton, { disabled: true }, () => 'Disabled'),
    h(VToolbarSeparator),
    h(VToolbarLink, { href: '#help' }, () => 'Help'),
  ])

const basicReact = (props: Record<string, unknown> = {}) => (
  <Toolbar label="Actions" {...props}>
    <ToolbarButton>First</ToolbarButton>
    <ToolbarButton disabled>Disabled</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarLink href="#help">Help</ToolbarLink>
  </Toolbar>
)

const labelledVue = () => [
  h(VToolbarButton, { label: '剪切' }, icon('scissors')),
  h(VToolbarButton, { label: '复制' }, icon('copy')),
  h(VToolbarButton, { label: '粘贴' }, icon('paste')),
]

const labelledReact = () => (
  <>
    <ToolbarButton label="剪切">
      <svg data-icon="scissors" />
    </ToolbarButton>
    <ToolbarButton label="复制">
      <svg data-icon="copy" />
    </ToolbarButton>
    <ToolbarButton label="粘贴">
      <svg data-icon="paste" />
    </ToolbarButton>
  </>
)

const heroVue = () =>
  h(VToolbar, { label: '文本工具', size: 'sm' }, () => [
    h(VToolbarButton, { label: '撤销' }, icon('undo')),
    h(VToolbarButton, { label: '重做', disabled: true }, icon('redo')),
    h(VToolbarSeparator),
    h(VToolbarToggleGroup, { modelValue: ['bold'], type: 'multiple', label: '格式' }, () => [
      h(VToolbarToggleItem, { value: 'bold', label: '加粗' }, icon('bold')),
      h(VToolbarToggleItem, { value: 'italic', label: '斜体' }, icon('italic')),
      h(VToolbarToggleItem, { value: 'underline', label: '下划线' }, icon('underline')),
    ]),
  ])

const heroReact = () => (
  <Toolbar label="文本工具" size="sm">
    <ToolbarButton label="撤销">
      <svg data-icon="undo" />
    </ToolbarButton>
    <ToolbarButton label="重做" disabled>
      <svg data-icon="redo" />
    </ToolbarButton>
    <ToolbarSeparator />
    <ToolbarToggleGroup value={['bold']} type="multiple" label="格式">
      <ToolbarToggleItem value="bold" label="加粗">
        <svg data-icon="bold" />
      </ToolbarToggleItem>
      <ToolbarToggleItem value="italic" label="斜体">
        <svg data-icon="italic" />
      </ToolbarToggleItem>
      <ToolbarToggleItem value="underline" label="下划线">
        <svg data-icon="underline" />
      </ToolbarToggleItem>
    </ToolbarToggleGroup>
  </Toolbar>
)

export default defineCases('Toolbar', [
  {
    name: 'buttons, disabled button, separator and link',
    vue: () => basicVue(),
    react: () => basicReact(),
  },
  {
    name: 'vertical orientation flips the separator',
    vue: () => basicVue({ orientation: 'vertical' }),
    react: () => basicReact({ orientation: 'vertical' }),
  },
  ...(['sm', 'lg'] as const).map(size => ({
    name: `size ${size} inherited by controls`,
    vue: () => basicVue({ size }),
    react: () => basicReact({ size }),
  })),
  {
    name: 'root disabled disables every control and marks the toolbar',
    vue: () => basicVue({ size: 'lg', disabled: true }),
    react: () => basicReact({ size: 'lg', disabled: true }),
  },
  {
    name: 'explicit rtl, no loop, class and fallthrough attributes',
    vue: () =>
      basicVue({
        dir: 'rtl',
        loop: false,
        class: 'w-full',
        style: 'max-width: 240px',
        id: 'tools',
      }),
    react: () =>
      basicReact({
        dir: 'rtl',
        loop: false,
        className: 'w-full',
        style: { maxWidth: '240px' },
        id: 'tools',
      }),
  },
  {
    name: 'per-control size and asChild composition with a Button and an IconButton',
    vue: () =>
      h(VToolbar, { label: 'Custom', size: 'lg' }, () => [
        h(VToolbarButton, { size: 'sm' }, () => 'Small'),
        h(VToolbarButton, { asChild: true }, () => h(VButton, { variant: 'soft' }, () => 'Custom')),
        h(VToolbarButton, { asChild: true }, () => h(VIconButton, { label: 'Save' }, () => 'S')),
      ]),
    react: () => (
      <Toolbar label="Custom" size="lg">
        <ToolbarButton size="sm">Small</ToolbarButton>
        <ToolbarButton asChild>
          <Button variant="soft">Custom</Button>
        </ToolbarButton>
        <ToolbarButton asChild>
          <IconButton label="Save">S</IconButton>
        </ToolbarButton>
      </Toolbar>
    ),
  },
  {
    name: 'controlled single toggle group without a value',
    vue: () =>
      h(VToolbar, { label: 'Alignment' }, () =>
        h(VToolbarToggleGroup, { modelValue: undefined, type: 'single' }, () => [
          h(VToolbarToggleItem, { value: 'start' }, () => 'Start'),
          h(VToolbarToggleItem, { value: 'center' }, () => 'Center'),
        ]),
      ),
    react: () => (
      <Toolbar label="Alignment">
        <ToolbarToggleGroup value={undefined} type="single">
          <ToolbarToggleItem value="start">Start</ToolbarToggleItem>
          <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    ),
  },
  {
    name: 'controlled single toggle group with a selected item',
    vue: () =>
      h(VToolbar, { label: 'Alignment' }, () =>
        h(VToolbarToggleGroup, { modelValue: 'center' }, () => [
          h(VToolbarToggleItem, { value: 'start' }, () => 'Start'),
          h(VToolbarToggleItem, { value: 'center' }, () => 'Center'),
        ]),
      ),
    react: () => (
      <Toolbar label="Alignment">
        <ToolbarToggleGroup value="center">
          <ToolbarToggleItem value="start">Start</ToolbarToggleItem>
          <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    ),
  },
  {
    name: 'uncontrolled multiple toggle group with a default value',
    vue: () =>
      h(VToolbar, { label: 'Formats' }, () =>
        h(VToolbarToggleGroup, { type: 'multiple', defaultValue: ['bold'] }, () => [
          h(VToolbarToggleItem, { value: 'bold' }, () => 'Bold'),
          h(VToolbarToggleItem, { value: 'italic' }, () => 'Italic'),
        ]),
      ),
    react: () => (
      <Toolbar label="Formats">
        <ToolbarToggleGroup type="multiple" defaultValue={['bold']}>
          <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
          <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    ),
  },
  ...([true, false] as const).map(disabled => ({
    name: `group disabled ${disabled}, item disabled and loading button`,
    vue: () =>
      h(VToolbar, { label: 'Disabled' }, () => [
        h(VToolbarToggleGroup, { disabled }, () => [
          h(VToolbarToggleItem, { value: 'one' }, () => 'One'),
          h(VToolbarToggleItem, { value: 'two', disabled: true }, () => 'Two'),
        ]),
        h(VToolbarButton, { loading: disabled }, () => 'Save'),
      ]),
    react: () => (
      <Toolbar label="Disabled">
        <ToolbarToggleGroup disabled={disabled}>
          <ToolbarToggleItem value="one">One</ToolbarToggleItem>
          <ToolbarToggleItem value="two" disabled>
            Two
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarButton loading={disabled}>Save</ToolbarButton>
      </Toolbar>
    ),
  })),
  {
    name: 'disabled link',
    vue: () =>
      h(VToolbar, { label: 'Links' }, () =>
        h(VToolbarLink, { href: '#help', disabled: true }, () => 'Help'),
      ),
    react: () => (
      <Toolbar label="Links">
        <ToolbarLink href="#help" disabled>
          Help
        </ToolbarLink>
      </Toolbar>
    ),
  },
  {
    name: 'accessible names, labelled group, semantic separator and link attributes',
    vue: () =>
      h(VToolbar, { label: 'Accessible toolbar' }, () => [
        h(VToolbarButton, { label: 'Undo', tooltip: false }, () => '↶'),
        h(VToolbarToggleGroup, { label: 'Formatting', type: 'multiple' }, () =>
          h(VToolbarToggleItem, { value: 'bold', label: 'Bold' }, () => 'B'),
        ),
        h(VToolbarSeparator, { decorative: false }),
        h(VToolbarLink, { href: '#help', target: '_blank', rel: 'noopener' }, () => 'Help'),
      ]),
    react: () => (
      <Toolbar label="Accessible toolbar">
        <ToolbarButton label="Undo" tooltip={false}>
          ↶
        </ToolbarButton>
        <ToolbarToggleGroup label="Formatting" type="multiple">
          <ToolbarToggleItem value="bold" label="Bold">
            B
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator decorative={false} />
        <ToolbarLink href="#help" target="_blank" rel="noopener">
          Help
        </ToolbarLink>
      </Toolbar>
    ),
  },
  {
    name: 'vertical rtl toolbar with every part',
    vue: () =>
      h(VToolbar, { label: 'Tools', dir: 'rtl', orientation: 'vertical' }, () => [
        h(VToolbarButton, {}, () => 'Action'),
        h(VToolbarSeparator),
        h(VToolbarToggleGroup, { type: 'multiple', defaultValue: ['bold'] }, () =>
          h(VToolbarToggleItem, { value: 'bold' }, () => 'Bold'),
        ),
        h(VToolbarLink, { href: '#help' }, () => 'Help'),
      ]),
    react: () => (
      <Toolbar label="Tools" dir="rtl" orientation="vertical">
        <ToolbarButton>Action</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup type="multiple" defaultValue={['bold']}>
          <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarLink href="#help">Help</ToolbarLink>
      </Toolbar>
    ),
  },
  {
    name: 'icon slots with text labels',
    vue: () =>
      h(VToolbar, { label: '操作', size: 'sm' }, () => [
        h(VToolbarButton, {}, { icon: icon('copy'), default: () => '复制' }),
        h(VToolbarButton, {}, { icon: icon('download'), default: () => '下载' }),
        h(VToolbarButton, {}, { trailing: icon('reset'), default: () => '重置' }),
        h(VToolbarSeparator),
        h(VToolbarLink, { href: '#api' }, () => 'API'),
      ]),
    react: () => (
      <Toolbar label="操作" size="sm">
        <ToolbarButton icon={<svg data-icon="copy" />}>复制</ToolbarButton>
        <ToolbarButton icon={<svg data-icon="download" />}>下载</ToolbarButton>
        <ToolbarButton trailing={<svg data-icon="reset" />}>重置</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarLink href="#api">API</ToolbarLink>
      </Toolbar>
    ),
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant} with labelled icon buttons`,
    vue: () => h(VToolbar, { variant, label: variant, size: 'sm' }, labelledVue),
    react: () => (
      <Toolbar variant={variant} label={variant} size="sm">
        {labelledReact()}
      </Toolbar>
    ),
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `labelled icon buttons at size ${size}`,
    vue: () => h(VToolbar, { size, label: size }, labelledVue),
    react: () => (
      <Toolbar size={size} label={size}>
        {labelledReact()}
      </Toolbar>
    ),
  })),
  {
    name: 'hero: labelled buttons, disabled redo and a multiple group',
    vue: heroVue,
    react: heroReact,
  },
  {
    name: 'hero inside a TooltipProvider wraps labelled controls in tooltips',
    vue: () => h(VTooltipProvider, null, heroVue),
    react: () => <TooltipProvider>{heroReact()}</TooltipProvider>,
  },
  {
    name: 'unlabelled and tooltip-disabled controls inside a TooltipProvider',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(VToolbar, { label: 'Mixed' }, () => [
          h(VToolbarButton, {}, () => 'Plain'),
          h(VToolbarButton, { label: 'Quiet', tooltip: false }, () => 'Q'),
          h(VToolbarLink, { href: '#a', label: 'Docs' }, () => 'D'),
        ]),
      ),
    react: () => (
      <TooltipProvider>
        <Toolbar label="Mixed">
          <ToolbarButton>Plain</ToolbarButton>
          <ToolbarButton label="Quiet" tooltip={false}>
            Q
          </ToolbarButton>
          <ToolbarLink href="#a" label="Docs">
            D
          </ToolbarLink>
        </Toolbar>
      </TooltipProvider>
    ),
  },
  {
    name: 'toggles demo: multiple formats and single alignment',
    vue: () =>
      h(VToolbar, { label: '切换组', size: 'sm' }, () => [
        h(VToolbarToggleGroup, { modelValue: ['bold'], type: 'multiple', label: '格式' }, () => [
          h(VToolbarToggleItem, { value: 'bold', label: '加粗' }, icon('bold')),
          h(VToolbarToggleItem, { value: 'italic', label: '斜体' }, icon('italic')),
        ]),
        h(VToolbarSeparator),
        h(VToolbarToggleGroup, { modelValue: 'start', label: '对齐' }, () => [
          h(VToolbarToggleItem, { value: 'start', label: '起始对齐' }, icon('start')),
          h(VToolbarToggleItem, { value: 'end', label: '末尾对齐' }, icon('end')),
        ]),
      ]),
    react: () => (
      <Toolbar label="切换组" size="sm">
        <ToolbarToggleGroup value={['bold']} type="multiple" label="格式">
          <ToolbarToggleItem value="bold" label="加粗">
            <svg data-icon="bold" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" label="斜体">
            <svg data-icon="italic" />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarToggleGroup value="start" label="对齐">
          <ToolbarToggleItem value="start" label="起始对齐">
            <svg data-icon="start" />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="end" label="末尾对齐">
            <svg data-icon="end" />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    ),
  },
  {
    name: 'vertical demo: side right, single tool group and a button',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(VToolbar, { label: '纵向工具', orientation: 'vertical', size: 'sm' }, () => [
          h(VToolbarToggleGroup, { modelValue: 'pointer', label: '工具' }, () => [
            h(
              VToolbarToggleItem,
              { value: 'pointer', label: '选择', side: 'right' },
              icon('pointer'),
            ),
            h(VToolbarToggleItem, { value: 'hand', label: '移动', side: 'right' }, icon('hand')),
          ]),
          h(VToolbarSeparator),
          h(VToolbarButton, { label: '添加', side: 'right' }, icon('plus')),
        ]),
      ),
    react: () => (
      <TooltipProvider>
        <Toolbar label="纵向工具" orientation="vertical" size="sm">
          <ToolbarToggleGroup value="pointer" label="工具">
            <ToolbarToggleItem value="pointer" label="选择" side="right">
              <svg data-icon="pointer" />
            </ToolbarToggleItem>
            <ToolbarToggleItem value="hand" label="移动" side="right">
              <svg data-icon="hand" />
            </ToolbarToggleItem>
          </ToolbarToggleGroup>
          <ToolbarSeparator />
          <ToolbarButton label="添加" side="right">
            <svg data-icon="plus" />
          </ToolbarButton>
        </Toolbar>
      </TooltipProvider>
    ),
  },
  {
    name: 'disabled demo: root and group disabled with a default selection',
    vue: () =>
      h(VToolbar, { label: '禁用状态', disabled: true, size: 'sm' }, () => [
        h(VToolbarButton, { label: '撤销' }, icon('undo')),
        h(VToolbarSeparator),
        h(
          VToolbarToggleGroup,
          { modelValue: ['bold'], type: 'multiple', label: '格式', disabled: true },
          () => [h(VToolbarToggleItem, { value: 'bold', label: '加粗' }, icon('bold'))],
        ),
      ]),
    react: () => (
      <Toolbar label="禁用状态" disabled size="sm">
        <ToolbarButton label="撤销">
          <svg data-icon="undo" />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup value={['bold']} type="multiple" label="格式" disabled>
          <ToolbarToggleItem value="bold" label="加粗">
            <svg data-icon="bold" />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    ),
  },
  {
    name: 'control variant, tone, class and button attributes',
    vue: () =>
      h(VToolbar, { label: 'Styled', variant: 'secondary' }, () => [
        h(
          VToolbarButton,
          {
            variant: 'soft',
            tone: 'accent',
            class: 'px-6',
            ripple: false,
            'data-test': 'go',
            title: 'Go',
          },
          () => 'Go',
        ),
        h(VToolbarButton, { as: 'span' }, () => 'Span'),
      ]),
    react: () => (
      <Toolbar label="Styled" variant="secondary">
        <ToolbarButton
          variant="soft"
          tone="accent"
          className="px-6"
          ripple={false}
          data-test="go"
          title="Go"
        >
          Go
        </ToolbarButton>
        <ToolbarButton as="span">Span</ToolbarButton>
      </Toolbar>
    ),
  },
])
