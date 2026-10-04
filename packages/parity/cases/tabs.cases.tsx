import { h } from 'vue'
import VTabs from '@hina-ui/vue/components/tabs/Tabs.vue'
import VTabsList from '@hina-ui/vue/components/tabs/TabsList.vue'
import VTabsTrigger from '@hina-ui/vue/components/tabs/TabsTrigger.vue'
import VTabsContent from '@hina-ui/vue/components/tabs/TabsContent.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { Tabs } from '@hina-ui/react/components/tabs/Tabs'
import { TabsList } from '@hina-ui/react/components/tabs/TabsList'
import { TabsTrigger } from '@hina-ui/react/components/tabs/TabsTrigger'
import { TabsContent } from '@hina-ui/react/components/tabs/TabsContent'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

type Variant = 'underline' | 'soft'
type Size = 'sm' | 'md' | 'lg'
type Orientation = 'horizontal' | 'vertical'

interface Setup {
  variant?: Variant
  size?: Size
  orientation?: Orientation
  value?: string
  defaultValue?: string
  label?: string
  className?: string
  triggers: Array<[string, string, boolean?]>
  contents: Array<[string, string]>
}

function vueTabs(setup: Setup) {
  return () =>
    h(
      VTabs,
      {
        variant: setup.variant,
        size: setup.size,
        orientation: setup.orientation,
        defaultValue: setup.defaultValue,
        modelValue: setup.value,
        class: setup.className,
      },
      () => [
        h(VTabsList, { label: setup.label }, () =>
          setup.triggers.map(([value, label, disabled]) =>
            h(VTabsTrigger, { value, disabled }, () => label),
          ),
        ),
        ...setup.contents.map(([value, body]) => h(VTabsContent, { value }, () => h('p', body))),
      ],
    )
}

function reactTabs(setup: Setup) {
  return () => (
    <Tabs
      variant={setup.variant}
      size={setup.size}
      orientation={setup.orientation}
      defaultValue={setup.defaultValue}
      value={setup.value}
      className={setup.className}
    >
      <TabsList label={setup.label}>
        {setup.triggers.map(([value, label, disabled]) => (
          <TabsTrigger key={value} value={value} disabled={disabled}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {setup.contents.map(([value, body]) => (
        <TabsContent key={value} value={value}>
          <p>{body}</p>
        </TabsContent>
      ))}
    </Tabs>
  )
}

const pair: Array<[string, string]> = [
  ['a', '甲'],
  ['b', '乙'],
]

const single = (name: string, setup: Omit<Setup, 'triggers' | 'contents'>) => ({
  name,
  vue: vueTabs({ ...setup, triggers: pair, contents: [['a', '甲的内容']] }),
  react: reactTabs({ ...setup, triggers: pair, contents: [['a', '甲的内容']] }),
})

const full = (name: string, setup: Setup) => ({
  name,
  vue: vueTabs(setup),
  react: reactTabs(setup),
})

export default defineCases('Tabs', [
  single('selected tab carries the static highlight', { defaultValue: 'a', label: '分组' }),
  ...(['underline', 'soft'] as const).flatMap(variant =>
    (['sm', 'md', 'lg'] as const).flatMap(size =>
      (['horizontal', 'vertical'] as const).map(orientation =>
        single(`${variant} ${size} ${orientation}`, {
          variant,
          size,
          orientation,
          defaultValue: 'a',
          label: '分组',
        }),
      ),
    ),
  ),
  single('controlled value', { value: 'a', label: '分组' }),
  {
    ...single('no selection renders no highlight', { label: '分组' }),
  },
  single('class merges on the root', { defaultValue: 'a', className: 'w-full max-w-md' }),
  {
    name: 'class and attributes on list, trigger and content',
    vue: () =>
      h(VTabs, { defaultValue: 'a', 'data-root': '' }, () => [
        h(VTabsList, { label: '分组', class: 'mb-2', 'data-list': '' }, () => [
          h(VTabsTrigger, { value: 'a', class: 'px-4', 'data-trigger': '' }, () => '甲'),
        ]),
        h(VTabsContent, { value: 'a', class: 'pt-4', 'data-content': '' }, () => '甲的内容'),
      ]),
    react: () => (
      <Tabs defaultValue="a" data-root="">
        <TabsList label="分组" className="mb-2" data-list="">
          <TabsTrigger value="a" className="px-4" data-trigger="">
            甲
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="pt-4" data-content="">
          甲的内容
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: 'disabled trigger is marked on the roving item',
    vue: vueTabs({
      defaultValue: 'public',
      label: '可见范围',
      triggers: [
        ['public', '公开'],
        ['friends', '仅关注者'],
        ['private', '私密（需要登录）', true],
      ],
      contents: [['public', '所有人都能看到这份书单。']],
    }),
    react: reactTabs({
      defaultValue: 'public',
      label: '可见范围',
      triggers: [
        ['public', '公开'],
        ['friends', '仅关注者'],
        ['private', '私密（需要登录）', true],
      ],
      contents: [['public', '所有人都能看到这份书单。']],
    }),
  },
  full('inactive panels render hidden and empty', {
    defaultValue: 'a',
    label: '分组',
    triggers: pair,
    contents: [
      ['a', '甲的内容'],
      ['b', '乙的内容'],
    ],
  }),
  full('demo overflow', {
    defaultValue: '科幻',
    label: '题材',
    className: 'w-full max-w-sm',
    triggers: ['科幻', '悬疑', '日常', '校园', '治愈', '奇幻', '推理', '恋爱', '历史', '战记'].map(
      genre => [genre, genre] as [string, string],
    ),
    contents: ['科幻', '悬疑', '日常'].map(genre => [genre, `${genre}题材的作品列表。`]),
  }),
  full('demo disabled', {
    defaultValue: 'public',
    label: '可见范围',
    className: 'w-full max-w-md',
    triggers: [
      ['public', '公开'],
      ['friends', '仅关注者'],
      ['private', '私密（需要登录）', true],
    ],
    contents: [
      ['public', '所有人都能看到这份书单。'],
      ['friends', '只有关注你的人能看到。'],
      ['private', '只有自己可见。'],
    ],
  }),
  {
    name: 'demo basic',
    vue: () =>
      h(VTabs, { defaultValue: 'reading', class: 'w-full max-w-md' }, () => [
        h(VTabsList, { label: '书架分类' }, () => [
          h(VTabsTrigger, { value: 'reading' }, () => '在读'),
          h(VTabsTrigger, { value: 'planned' }, () => '想读'),
          h(VTabsTrigger, { value: 'finished' }, () => '读过'),
        ]),
        h(VTabsContent, { value: 'reading' }, () =>
          h(VText, { tone: 'muted', size: 'sm', class: 'block pt-4' }, () => '正在读的 3 部作品。'),
        ),
        h(VTabsContent, { value: 'planned' }, () =>
          h(
            VText,
            { tone: 'muted', size: 'sm', class: 'block pt-4' },
            () => '收藏待读的 12 部作品。',
          ),
        ),
      ]),
    react: () => (
      <Tabs defaultValue="reading" className="w-full max-w-md">
        <TabsList label="书架分类">
          <TabsTrigger value="reading">在读</TabsTrigger>
          <TabsTrigger value="planned">想读</TabsTrigger>
          <TabsTrigger value="finished">读过</TabsTrigger>
        </TabsList>
        <TabsContent value="reading">
          <Text tone="muted" size="sm" className="block pt-4">
            正在读的 3 部作品。
          </Text>
        </TabsContent>
        <TabsContent value="planned">
          <Text tone="muted" size="sm" className="block pt-4">
            收藏待读的 12 部作品。
          </Text>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: 'demo hero',
    vue: () =>
      h(VTabs, { defaultValue: 'intro', class: 'w-full max-w-md' }, () => [
        h(VTabsList, { label: '作品信息' }, () => [
          h(VTabsTrigger, { value: 'intro' }, () => '简介'),
          h(VTabsTrigger, { value: 'volumes' }, () => '卷册'),
          h(VTabsTrigger, { value: 'staff' }, () => '制作'),
        ]),
        h(VTabsContent, { value: 'intro' }, () =>
          h(VStack, { gap: 'xs', class: 'pt-4' }, () =>
            h(
              VText,
              { tone: 'muted', size: 'sm' },
              () => '转学第一天，我在天台遇见了那个抱着旧相机的少女。',
            ),
          ),
        ),
      ]),
    react: () => (
      <Tabs defaultValue="intro" className="w-full max-w-md">
        <TabsList label="作品信息">
          <TabsTrigger value="intro">简介</TabsTrigger>
          <TabsTrigger value="volumes">卷册</TabsTrigger>
          <TabsTrigger value="staff">制作</TabsTrigger>
        </TabsList>
        <TabsContent value="intro">
          <Stack gap="xs" className="pt-4">
            <Text tone="muted" size="sm">
              转学第一天，我在天台遇见了那个抱着旧相机的少女。
            </Text>
          </Stack>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: 'demo sizes',
    vue: () =>
      h(VStack, { gap: 'lg', class: 'w-full max-w-md' }, () =>
        (['sm', 'md', 'lg'] as const).map(size =>
          h(VStack, { gap: 'xs' }, () => [
            h(VText, { tone: 'muted', size: 'sm' }, () => size),
            h(VTabs, { defaultValue: 'a', size }, () => [
              h(VTabsList, { label: `${size} 档` }, () => [
                h(VTabsTrigger, { value: 'a' }, () => '简介'),
                h(VTabsTrigger, { value: 'b' }, () => '卷册'),
              ]),
              h(VTabsContent, { value: 'a' }),
            ]),
          ]),
        ),
      ),
    react: () => (
      <Stack gap="lg" className="w-full max-w-md">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <Stack key={size} gap="xs">
            <Text tone="muted" size="sm">
              {size}
            </Text>
            <Tabs defaultValue="a" size={size}>
              <TabsList label={`${size} 档`}>
                <TabsTrigger value="a">简介</TabsTrigger>
                <TabsTrigger value="b">卷册</TabsTrigger>
              </TabsList>
              <TabsContent value="a" />
            </Tabs>
          </Stack>
        ))}
      </Stack>
    ),
  },
  {
    name: 'demo vertical',
    vue: () =>
      h(
        VTabs,
        { defaultValue: 'account', orientation: 'vertical', class: 'w-full max-w-md' },
        () => [
          h(VTabsList, { label: '设置分组' }, () => [
            h(VTabsTrigger, { value: 'account' }, () => '账号'),
            h(VTabsTrigger, { value: 'reading' }, () => '阅读'),
            h(VTabsTrigger, { value: 'notice' }, () => '通知'),
          ]),
          h(VTabsContent, { value: 'account' }, () =>
            h(VText, { tone: 'muted', size: 'sm' }, () => '用户名、邮箱与密码。'),
          ),
        ],
      ),
    react: () => (
      <Tabs defaultValue="account" orientation="vertical" className="w-full max-w-md">
        <TabsList label="设置分组">
          <TabsTrigger value="account">账号</TabsTrigger>
          <TabsTrigger value="reading">阅读</TabsTrigger>
          <TabsTrigger value="notice">通知</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Text tone="muted" size="sm">
            用户名、邮箱与密码。
          </Text>
        </TabsContent>
      </Tabs>
    ),
  },
])
