import { h } from 'vue'
import { Plus as VPlus } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Plus as RPlusIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VCollapsible from '@hina-ui/vue/components/collapsible/Collapsible.vue'
import VCollapsibleTrigger from '@hina-ui/vue/components/collapsible/CollapsibleTrigger.vue'
import VCollapsibleContent from '@hina-ui/vue/components/collapsible/CollapsibleContent.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VCard from '@hina-ui/vue/components/card/Card.vue'
import VDisclosureIcon from '@hina-ui/vue/components/disclosure-icon/DisclosureIcon.vue'
import VInline from '@hina-ui/vue/components/inline/Inline.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { Collapsible } from '@hina-ui/react/components/collapsible/Collapsible'
import { CollapsibleTrigger } from '@hina-ui/react/components/collapsible/CollapsibleTrigger'
import { CollapsibleContent } from '@hina-ui/react/components/collapsible/CollapsibleContent'
import { Button } from '@hina-ui/react/components/button/Button'
import { Card } from '@hina-ui/react/components/card/Card'
import { DisclosureIcon } from '@hina-ui/react/components/disclosure-icon/DisclosureIcon'
import { Inline } from '@hina-ui/react/components/inline/Inline'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { Text } from '@hina-ui/react/components/text/Text'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const RPlus = lucide(RPlusIcon)

const harness =
  (props: Record<string, unknown> = {}) =>
  () =>
    h(VCollapsible, props, () => [
      h(VCollapsibleTrigger, () => '展开'),
      h(VCollapsibleContent, () => h('p', '折叠内容')),
    ])

export default defineCases('Collapsible', [
  {
    name: 'closed by default renders a ghost Button with the disclosure icon',
    vue: harness(),
    react: () => (
      <Collapsible>
        <CollapsibleTrigger>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>折叠内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'defaultOpen skips the mount animation state on the content',
    vue: harness({ defaultOpen: true }),
    react: () => (
      <Collapsible defaultOpen>
        <CollapsibleTrigger>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>折叠内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'disabled',
    vue: harness({ disabled: true }),
    react: () => (
      <Collapsible disabled>
        <CollapsibleTrigger>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>折叠内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  ...([true, false] as const).map(open => ({
    name: `controlled open ${open}`,
    vue: harness({ open }),
    react: () => (
      <Collapsible open={open}>
        <CollapsibleTrigger>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>折叠内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  })),
  {
    name: 'icon false renders no indicator',
    vue: () =>
      h(VCollapsible, null, () => [
        h(VCollapsibleTrigger, { icon: false }, () => '展开'),
        h(VCollapsibleContent, () => h('p', '内容')),
      ]),
    react: () => (
      <Collapsible>
        <CollapsibleTrigger icon={false}>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'icon slot replaces the glyph inside the indicator',
    vue: () =>
      h(VCollapsible, null, () => [
        h(VCollapsibleTrigger, null, {
          default: () => '展开',
          icon: () => h('i', { class: 'custom-glyph' }),
        }),
        h(VCollapsibleContent, () => h('p', '内容')),
      ]),
    react: () => (
      <Collapsible>
        <CollapsibleTrigger icon={<i className="custom-glyph" />}>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'asChild lends the trigger to a project Button',
    vue: () =>
      h(VCollapsible, () => [
        h(VCollapsibleTrigger, { asChild: true }, () =>
          h(VButton, { variant: 'ghost', tone: 'neutral' }, () => '借体开关'),
        ),
        h(VCollapsibleContent, () => h('p', '内容')),
      ]),
    react: () => (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" tone="neutral">
            借体开关
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'class and attributes on every part',
    vue: () =>
      h(VCollapsible, { class: 'w-full', id: 'root', 'data-x': '1', defaultOpen: true }, () => [
        h(VCollapsibleTrigger, { class: 'justify-between', 'data-y': '2' }, () => '展开'),
        h(VCollapsibleContent, { class: 'pt-2', 'data-z': '3', style: { color: 'red' } }, () =>
          h('p', '内容'),
        ),
      ]),
    react: () => (
      <Collapsible className="w-full" id="root" data-x="1" defaultOpen>
        <CollapsibleTrigger className="justify-between" data-y="2">
          展开
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2" data-z="3" style={{ color: 'red' }}>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'demo basic',
    vue: () =>
      h(VCollapsible, { class: 'w-full max-w-md' }, () =>
        h(VStack, { gap: 'sm', align: 'start' }, () => [
          h(VCollapsibleTrigger, () => '阅读设置'),
          h(VCollapsibleContent, () =>
            h(
              VText,
              { tone: 'muted', size: 'sm' },
              () => '字号、行距、翻页方向与背景色都在这里调整。',
            ),
          ),
        ]),
      ),
    react: () => (
      <Collapsible className="w-full max-w-md">
        <Stack gap="sm" align="start">
          <CollapsibleTrigger>阅读设置</CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              字号、行距、翻页方向与背景色都在这里调整。
            </Text>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
    ),
  },
  ...([false, true] as const).map(open => ({
    name: `demo controlled open ${open}`,
    vue: () =>
      h(VStack, { class: 'w-full max-w-md' }, () => [
        h(VInline, () => [
          h(VButton, { size: 'sm', variant: 'soft', tone: 'neutral' }, () =>
            open ? '收起' : '展开',
          ),
          h(VText, { tone: 'muted', size: 'sm' }, () => `open：${open}`),
        ]),
        h(VCollapsible, { open }, () =>
          h(VStack, { gap: 'sm', align: 'start' }, () => [
            h(VCollapsibleTrigger, () => '组件自己的触发器'),
            h(VCollapsibleContent, () =>
              h(VText, { tone: 'muted', size: 'sm' }, () => '两处触发器操作的是同一个状态。'),
            ),
          ]),
        ),
      ]),
    react: () => (
      <Stack className="w-full max-w-md">
        <Inline>
          <Button size="sm" variant="soft" tone="neutral">
            {open ? '收起' : '展开'}
          </Button>
          <Text tone="muted" size="sm">{`open：${open}`}</Text>
        </Inline>
        <Collapsible open={open}>
          <Stack gap="sm" align="start">
            <CollapsibleTrigger>组件自己的触发器</CollapsibleTrigger>
            <CollapsibleContent>
              <Text tone="muted" size="sm">
                两处触发器操作的是同一个状态。
              </Text>
            </CollapsibleContent>
          </Stack>
        </Collapsible>
      </Stack>
    ),
  })),
  {
    name: 'demo custom glyph and caller-provided trigger',
    vue: () =>
      h(VStack, { class: 'w-full max-w-md' }, () => [
        h(VCollapsible, () =>
          h(VStack, { gap: 'sm', align: 'start' }, () => [
            h(VCollapsibleTrigger, null, { default: () => '更换字形', icon: () => h(VPlus) }),
            h(VCollapsibleContent, () =>
              h(
                VText,
                { tone: 'muted', size: 'sm' },
                () => '加号旋转四分之一圈后成为叉号，旋转仍由组件负责。',
              ),
            ),
          ]),
        ),
        h(VCollapsible, () =>
          h(VStack, { gap: 'sm', align: 'start' }, () => [
            h(VCollapsibleTrigger, { asChild: true }, () =>
              h(
                VButton,
                { variant: 'outline', tone: 'neutral', block: true, class: 'justify-between' },
                { default: () => '自行提供整个触发器', trailing: () => h(VDisclosureIcon) },
              ),
            ),
            h(VCollapsibleContent, () =>
              h(
                VText,
                { tone: 'muted', size: 'sm' },
                () => '此时外观与指示物均由调用方决定，放置一个 DisclosureIcon 即可。',
              ),
            ),
          ]),
        ),
      ]),
    react: () => (
      <Stack className="w-full max-w-md">
        <Collapsible>
          <Stack gap="sm" align="start">
            <CollapsibleTrigger icon={<RPlus />}>更换字形</CollapsibleTrigger>
            <CollapsibleContent>
              <Text tone="muted" size="sm">
                加号旋转四分之一圈后成为叉号，旋转仍由组件负责。
              </Text>
            </CollapsibleContent>
          </Stack>
        </Collapsible>
        <Collapsible>
          <Stack gap="sm" align="start">
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                tone="neutral"
                block
                className="justify-between"
                trailing={<DisclosureIcon />}
              >
                自行提供整个触发器
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Text tone="muted" size="sm">
                此时外观与指示物均由调用方决定，放置一个 DisclosureIcon 即可。
              </Text>
            </CollapsibleContent>
          </Stack>
        </Collapsible>
      </Stack>
    ),
  },
  {
    name: 'demo disabled',
    vue: () =>
      h(VCollapsible, { disabled: true, class: 'w-full max-w-md' }, () =>
        h(VStack, { gap: 'sm', align: 'start' }, () => [
          h(VCollapsibleTrigger, () => '编辑记录（需要登录）'),
          h(VCollapsibleContent, () =>
            h(VText, { tone: 'muted', size: 'sm' }, () => '这段内容不会被展开。'),
          ),
        ]),
      ),
    react: () => (
      <Collapsible disabled className="w-full max-w-md">
        <Stack gap="sm" align="start">
          <CollapsibleTrigger>编辑记录（需要登录）</CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              这段内容不会被展开。
            </Text>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
    ),
  },
  {
    name: 'demo hero',
    vue: () =>
      h(VCard, { class: 'w-full max-w-md' }, () =>
        h(VCollapsible, () =>
          h(VStack, { gap: 'sm', align: 'start' }, () => [
            h(
              VText,
              { tone: 'muted', size: 'sm' },
              () => '转学第一天，我在天台遇见了那个抱着旧相机的少女。她说这台相机拍得到明天。',
            ),
            h(VCollapsibleTrigger, { asChild: true }, () =>
              h(
                VButton,
                { variant: 'link', size: 'sm' },
                { trailing: () => h(VDisclosureIcon), default: () => '展开全部简介' },
              ),
            ),
            h(VCollapsibleContent, () =>
              h(
                VText,
                { tone: 'muted', size: 'sm' },
                () => '那之后的每一天，我们都在放学后爬上那道生锈的铁梯。',
              ),
            ),
          ]),
        ),
      ),
    react: () => (
      <Card className="w-full max-w-md">
        <Collapsible>
          <Stack gap="sm" align="start">
            <Text tone="muted" size="sm">
              转学第一天，我在天台遇见了那个抱着旧相机的少女。她说这台相机拍得到明天。
            </Text>
            <CollapsibleTrigger asChild>
              <Button variant="link" size="sm" trailing={<DisclosureIcon />}>
                展开全部简介
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Text tone="muted" size="sm">
                那之后的每一天，我们都在放学后爬上那道生锈的铁梯。
              </Text>
            </CollapsibleContent>
          </Stack>
        </Collapsible>
      </Card>
    ),
  },
])
