<script setup lang="ts">
  import { defineComponent, h, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
  import Button from '../src/components/button/Button.vue'
  import Blockquote from '../src/components/blockquote/Blockquote.vue'
  import Card from '../src/components/card/Card.vue'
  import Input from '../src/components/input/Input.vue'
  import Ripple from '../src/components/ripple/Ripple.vue'
  import Heading from '../src/components/heading/Heading.vue'
  import Code from '../src/components/code/Code.vue'
  import Kbd from '../src/components/kbd/Kbd.vue'
  import Link from '../src/components/link/Link.vue'
  import Mark from '../src/components/mark/Mark.vue'
  import Prose from '../src/components/prose/Prose.vue'
  import Spoiler from '../src/components/spoiler/Spoiler.vue'
  import CodeBlock from '../src/components/code-block/CodeBlock.vue'
  import List from '../src/components/list/List.vue'
  import DescriptionList from '../src/components/description-list/DescriptionList.vue'
  import Time from '../src/components/time/Time.vue'
  import NumberFormat from '../src/components/number-format/NumberFormat.vue'
  import Text from '../src/components/text/Text.vue'
  import Stack from '../src/components/stack/Stack.vue'
  import Inline from '../src/components/inline/Inline.vue'
  import Flex from '../src/components/flex/Flex.vue'
  import Grid from '../src/components/grid/Grid.vue'
  import SimpleGrid from '../src/components/simple-grid/SimpleGrid.vue'
  import Container from '../src/components/container/Container.vue'
  import Center from '../src/components/center/Center.vue'
  import Space from '../src/components/space/Space.vue'
  import Divider from '../src/components/divider/Divider.vue'
  import AspectRatio from '../src/components/aspect-ratio/AspectRatio.vue'
  import Splitter from '../src/components/splitter/Splitter.vue'
  import SplitterPanel from '../src/components/splitter/SplitterPanel.vue'
  import SplitterHandle from '../src/components/splitter/SplitterHandle.vue'
  import Collapsible from '../src/components/collapsible/Collapsible.vue'
  import CollapsibleTrigger from '../src/components/collapsible/CollapsibleTrigger.vue'
  import CollapsibleContent from '../src/components/collapsible/CollapsibleContent.vue'
  import NavLink from '../src/components/nav-link/NavLink.vue'
  import Sidebar from '../src/components/sidebar/Sidebar.vue'
  import SidebarGroup from '../src/components/sidebar/SidebarGroup.vue'
  import AppShell from '../src/components/app-shell/AppShell.vue'
  import Page from '../src/components/page/Page.vue'
  import PageHeader from '../src/components/page/PageHeader.vue'
  import PageBody from '../src/components/page/PageBody.vue'
  import PageAside from '../src/components/page/PageAside.vue'
  import Section from '../src/components/section/Section.vue'
  import Anchor from '../src/components/anchor/Anchor.vue'
  import Breadcrumb from '../src/components/breadcrumb/Breadcrumb.vue'
  import BreadcrumbItem from '../src/components/breadcrumb/BreadcrumbItem.vue'
  import BreadcrumbSeparator from '../src/components/breadcrumb/BreadcrumbSeparator.vue'
  import ScrollArea from '../src/components/scroll-area/ScrollArea.vue'
  import TooltipProvider from '../src/components/tooltip/TooltipProvider.vue'
  import Tooltip from '../src/components/tooltip/Tooltip.vue'
  import Popover from '../src/components/popover/Popover.vue'
  import Dialog from '../src/components/dialog/Dialog.vue'
  import Drawer from '../src/components/drawer/Drawer.vue'
  import Toaster from '../src/components/toast/Toaster.vue'
  import { toast, type ToasterPosition } from '../src/components/toast/store'
  import type { ButtonVariants } from '../src/components/button/button.variants'
  import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MousePointerClick,
    Redo2,
    Star,
    TextCursorInput,
    Undo2,
  } from '@lucide/vue'
  import SidebarTrigger from '../src/components/sidebar/SidebarTrigger.vue'
  import IconButton from '../src/components/icon-button/IconButton.vue'
  import CloseButton from '../src/components/close-button/CloseButton.vue'
  import CopyButton from '../src/components/copy-button/CopyButton.vue'
  import ButtonGroup from '../src/components/button-group/ButtonGroup.vue'
  import Tag from '../src/components/tag/Tag.vue'
  import Callout from '../src/components/callout/Callout.vue'
  import Badge from '../src/components/badge/Badge.vue'
  import PrevNext from '../src/components/prev-next/PrevNext.vue'
  import PrevNextLink from '../src/components/prev-next/PrevNextLink.vue'
  import Table from '../src/components/table/Table.vue'
  import TableHeader from '../src/components/table/TableHeader.vue'
  import TableBody from '../src/components/table/TableBody.vue'
  import TableRow from '../src/components/table/TableRow.vue'
  import TableHead from '../src/components/table/TableHead.vue'
  import TableCell from '../src/components/table/TableCell.vue'
  import Tabs from '../src/components/tabs/Tabs.vue'
  import TabsList from '../src/components/tabs/TabsList.vue'
  import TabsTrigger from '../src/components/tabs/TabsTrigger.vue'
  import TabsContent from '../src/components/tabs/TabsContent.vue'
  import PlusIcon from './PlusIcon.vue'
  import ArrowIcon from './ArrowIcon.vue'
  import Wordmark from '../src/components/wordmark/Wordmark.vue'

  const dark = ref(false)
  const density = ref<'comfortable' | 'compact'>('comfortable')
  const loading = ref(false)
  const submitted = ref(0)

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', dark.value)
  })

  const email = ref('')
  const variants: NonNullable<ButtonVariants['variant']>[] = ['solid', 'soft', 'outline', 'ghost']
  const tones: NonNullable<ButtonVariants['tone']>[] = ['accent', 'neutral', 'danger']
  const sizes: NonNullable<ButtonVariants['size']>[] = ['sm', 'md', 'lg']

  const nav = [
    { id: 'button', label: 'Button · 变体阵列' },
    { id: 'button-icon', label: 'Button · 图标与加载' },
    { id: 'button-layout', label: 'Button · 布局与语义' },
    { id: 'text', label: 'Text · 字阶' },
    { id: 'link', label: 'Link · 链接' },
    { id: 'inline', label: '行内排印' },
    { id: 'blocks', label: '块级排印' },
    { id: 'codeblock', label: 'CodeBlock' },
    { id: 'prose', label: 'Prose' },
    { id: 'input', label: 'Input 探针' },
    { id: 'card', label: 'Card 探针' },
    { id: 'statelayer', label: '状态层' },
    { id: 'stack', label: 'Stack · 纵向布局' },
    { id: 'inline-layout', label: 'Inline · 横向布局' },
    { id: 'flex-layout', label: 'Flex · 自由布局' },
    { id: 'grid-layout', label: 'Grid · 网格' },
    { id: 'simple-grid', label: 'SimpleGrid · 自动成列' },
    { id: 'container-layout', label: 'Container · 页宽' },
    { id: 'center-layout', label: 'Center · 双轴居中' },
    { id: 'space-divider', label: 'Space · Divider' },
    { id: 'aspect-ratio', label: 'AspectRatio · 比例' },
    { id: 'splitter', label: 'Splitter · 分栏' },
    { id: 'collapsible', label: 'Collapsible · 折叠' },
    { id: 'sidebar-nav', label: 'NavLink · Sidebar' },
    { id: 'app-shell', label: 'AppShell · 页面骨架' },
    { id: 'tooltip', label: 'Tooltip · 浮层底座' },
    { id: 'popover', label: 'Popover · 驻留浮层' },
    { id: 'dialog', label: 'Dialog · 对话框' },
    { id: 'drawer', label: 'Drawer · 边缘抽屉' },
    { id: 'toast', label: 'Toast · 通知' },
    { id: 'overlay-stack', label: '浮层嵌套 · 栈序' },
    { id: 'icon-button', label: 'IconButton · 图标钮' },
    { id: 'button-group', label: 'ButtonGroup · 按钮组' },
    { id: 'tag', label: 'Tag · 标签' },
    { id: 'tabs', label: 'Tabs · 分页签' },
    { id: 'callout', label: 'Callout · 提示块' },
    { id: 'table', label: 'Table · 样式表' },
    { id: 'prev-next', label: 'PrevNext · 上下页' },
    { id: 'badge', label: 'Badge · 徽标' },
  ]
  const active = ref('button')
  let spy: IntersectionObserver | undefined

  onMounted(() => {
    spy = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.value = entry.target.id
        }
      },
      { rootMargin: '-15% 0px -75% 0px' },
    )
    for (const item of nav) {
      const el = document.getElementById(item.id)
      if (el) spy.observe(el)
    }
  })

  onBeforeUnmount(() => spy?.disconnect())

  const unread = ref(5)
  const saveMenu = ref(false)
  const deleteMenu = ref(false)

  function pickSave(label: string) {
    saveMenu.value = false
    toast.success(label)
  }

  function pickDelete(label: string) {
    deleteMenu.value = false
    toast.danger(label)
  }

  const toastPos = ref<ToasterPosition | 'auto'>('auto')
  const toastPositions: (ToasterPosition | 'auto')[] = [
    'auto',
    'top-end',
    'top-center',
    'top-start',
    'bottom-end',
    'bottom-center',
    'bottom-start',
  ]

  const FollowToast = defineComponent({
    props: { toastId: { type: [String, Number], required: true } },
    setup(p) {
      return () =>
        h('div', { class: 'flex items-center gap-3' }, [
          h(
            'span',
            {
              class:
                'bg-accent-soft text-accent-text inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium',
            },
            '雏',
          ),
          h('div', { class: 'min-w-0 flex-1' }, [
            h('p', { class: 'text-fg font-medium' }, '星见书音关注了你'),
            h('p', { class: 'text-muted text-sm' }, '自定义 body,卡面与手势不变。'),
          ]),
          h(
            Button,
            { size: 'sm', variant: 'soft', onClick: () => toast.dismiss(p.toastId) },
            () => '回关',
          ),
        ])
    },
  })

  function demoPromise() {
    void toast.promise(new Promise<string>(res => setTimeout(() => res('胧月的书架'), 1500)), {
      loading: '正在保存…',
      success: v => `已保存:${v}`,
      error: '保存失败',
    })
  }
</script>

<template>
  <TooltipProvider>
    <div :data-density="density" class="bg-canvas text-fg min-h-screen">
      <header
        class="border-line bg-canvas sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b px-6 py-3"
      >
        <span class="me-auto flex items-center gap-3">
          <Wordmark />
          <span class="text-muted text-sm font-medium">预览工作台</span>
        </span>
        <Button size="sm" variant="outline" tone="neutral" @click="dark = !dark">
          {{ dark ? '深色' : '浅色' }}
        </Button>
        <Button
          size="sm"
          variant="outline"
          tone="neutral"
          @click="density = density === 'compact' ? 'comfortable' : 'compact'"
        >
          {{ density }}
        </Button>
        <Button size="sm" variant="outline" tone="neutral" @click="loading = !loading">
          loading {{ loading ? 'on' : 'off' }}
        </Button>
      </header>

      <div class="mx-auto flex w-full max-w-6xl gap-10 px-6">
        <aside
          class="sticky top-16 hidden h-[calc(100vh-4rem)] w-44 shrink-0 self-start overflow-y-auto py-10 lg:block"
        >
          <nav class="flex flex-col gap-0.5" aria-label="组件目录">
            <NavLink
              v-for="item in nav"
              :key="item.id"
              :href="`#${item.id}`"
              :active="active === item.id"
            >
              {{ item.label }}
            </NavLink>
          </nav>
        </aside>

        <main class="flex min-w-0 flex-1 flex-col gap-14 py-10">
          <section id="button" class="flex scroll-mt-16 flex-col gap-8">
            <div v-for="variant in variants" :key="variant" class="flex flex-col gap-4">
              <h2 class="text-muted font-mono text-sm tracking-wide uppercase">{{ variant }}</h2>
              <div
                v-for="tone in tones"
                :key="tone"
                class="border-line flex flex-wrap items-center gap-3 border-b pb-4 last:border-b-0"
              >
                <span class="text-faint w-20 shrink-0 font-mono text-xs">{{ tone }}</span>
                <Button
                  v-for="size in sizes"
                  :key="size"
                  :variant="variant"
                  :tone="tone"
                  :size="size"
                  :loading="loading"
                >
                  按钮 Button
                </Button>
                <Button
                  :variant="variant"
                  :tone="tone"
                  :loading="loading"
                  icon-only
                  aria-label="更多"
                >
                  ⋯
                </Button>
                <Button :variant="variant" :tone="tone" disabled>禁用</Button>
              </div>
            </div>
          </section>

          <section id="button-icon" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              icon 插槽 · loading 切换对比
            </h2>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-faint w-20 shrink-0 font-mono text-xs">#icon</span>
              <Button v-for="size in sizes" :key="size" :size="size" :loading="loading">
                <template #icon><PlusIcon /></template>
                新建
              </Button>
              <Button variant="outline" tone="neutral" :loading="loading">
                <template #icon><PlusIcon /></template>
                带图标
              </Button>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-faint w-20 shrink-0 font-mono text-xs">#trailing</span>
              <Button variant="soft" tone="accent" :loading="loading">
                下一步
                <template #trailing><ArrowIcon /></template>
              </Button>
              <Button variant="ghost" tone="neutral" :loading="loading">
                <template #icon><PlusIcon /></template>
                两侧都有
                <template #trailing><ArrowIcon /></template>
              </Button>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-faint w-20 shrink-0 font-mono text-xs">纯文字</span>
              <Button :loading="loading">仅文字</Button>
              <Button icon-only aria-label="新建" :loading="loading"><PlusIcon /></Button>
              <span class="text-muted text-sm">
                spinner 只顶掉主图标位(优先 #icon)· 后置的方向指示是语义标记,保持不变
              </span>
            </div>
          </section>

          <section id="button-layout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">block / as / type</h2>
            <Button block>整宽按钮</Button>
            <div class="flex flex-wrap items-center gap-3">
              <Button as="a" href="#" variant="ghost" tone="neutral">作为链接渲染</Button>
              <Button as="a" href="#" variant="ghost" tone="neutral" disabled>
                禁用的链接(不可聚焦、不可点)
              </Button>
            </div>
            <form class="flex flex-wrap items-center gap-3" @submit.prevent="submitted++">
              <Button type="submit" variant="soft">提交表单</Button>
              <span class="text-muted text-sm">已提交 {{ submitted }} 次</span>
            </form>
            <div class="flex flex-wrap items-center gap-3">
              <Button :ripple="false">无波纹</Button>
              <Button :ripple="false" variant="soft">无波纹</Button>
              <Button :ripple="false" variant="outline" tone="neutral">无波纹</Button>
              <Button :ripple="false" variant="ghost" tone="neutral">无波纹</Button>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <Button pill>胶囊按钮</Button>
              <Button pill variant="soft" tone="danger">胶囊 soft</Button>
              <Button pill variant="outline" tone="neutral">胶囊描边</Button>
              <Button pill icon-only aria-label="新建"><PlusIcon /></Button>
              <Button pill icon-only size="lg" variant="soft" aria-label="新建">
                <PlusIcon />
              </Button>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-muted text-sm">行内混排:点这里</span>
              <Button variant="link">链接按钮</Button>
              <Button variant="link" tone="neutral">中性链接</Button>
              <Button variant="link" tone="danger">危险动作</Button>
              <Button variant="link" disabled>禁用链接</Button>
              <span class="text-muted text-sm">继续正文</span>
            </div>
          </section>

          <section id="text" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              text · 字阶 / 色调 / 字重
            </h2>
            <div class="flex flex-col gap-1">
              <Text size="2xl" weight="semibold">2xl 半粗 · 星见书音的藏书阁</Text>
              <Text size="xl" weight="medium">xl 中等 · 星见书音的藏书阁</Text>
              <Text size="lg">lg · 星见书音的藏书阁 Hoshimi Shion</Text>
              <Text size="md">md · 星见书音的藏书阁 Hoshimi Shion</Text>
              <Text>base(默认)· 星见书音的藏书阁 Hoshimi Shion 0123456789</Text>
              <Text size="sm">sm · 星见书音的藏书阁 Hoshimi Shion 0123456789</Text>
              <Text size="xs">xs · 星见书音的藏书阁 Hoshimi Shion 0123456789</Text>
            </div>
            <div class="flex flex-wrap items-center gap-4">
              <Text as="span">default</Text>
              <Text as="span" tone="muted">muted</Text>
              <Text as="span" tone="faint">faint</Text>
              <Text as="span" tone="disabled">disabled</Text>
              <Text as="span" tone="accent">accent</Text>
              <Text as="span" tone="success">success</Text>
              <Text as="span" tone="warning">warning</Text>
              <Text as="span" tone="danger">danger</Text>
              <Text as="span" tone="info">info</Text>
            </div>
            <Text truncate class="max-w-sm">
              truncate:这一行会在容器边缘被单行截断,后面的内容不会换行而是变成省略号,比如这些字就看不到了
            </Text>
            <div class="border-line flex flex-col gap-2 border-t pt-4">
              <Heading v-for="level in [1, 2, 3, 4, 5, 6] as const" :key="level" :level="level">
                h{{ level }} · 星见书音的藏书阁
              </Heading>
              <Heading :level="3" size="2xl">语义 h3,视觉 2xl —— 解耦示例</Heading>
            </div>
          </section>

          <section id="link" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">link · 导航链接</h2>
            <div class="flex flex-wrap items-center gap-5">
              <Link href="#">accent 导航</Link>
              <Link href="#" tone="neutral">neutral 导航</Link>
              <Link href="#" underline>正文里带下划线的</Link>
              <Link href="#" tone="neutral" underline>中性带下划线</Link>
              <Text as="span" tone="muted">
                交互与 Button link 同一套墨:hover 压深,下划线只是身份标识
              </Text>
            </div>
          </section>

          <section id="inline" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              行内排印 · code / kbd / mark / spoiler
            </h2>
            <Text>
              行内代码混排:运行
              <Code>pnpm --filter @hina-ui/vue dev</Code>
              后访问
              <Code>localhost:3720</Code>
              ,字号随上下文 0.875em 缩放;按
              <Kbd>Ctrl</Kbd>
              +
              <Kbd>K</Kbd>
              唤起搜索;搜索结果里的
              <Mark>星见书音</Mark>
              会这样高亮。
            </Text>
            <Text class="max-w-2xl">
              剧透(点击):第三卷的结局里,
              <Spoiler>
                真凶其实是图书馆的园丁,这个反转在第七章就埋了伏笔,连借书卡上的墨迹都是证据
              </Spoiler>
              ;悬停版:
              <Spoiler reveal-on="hover">主角最终没有回到现实世界</Spoiler>
              ;无 Houdini 的浏览器会退回站内同款
              <Spoiler force-fallback>模糊遮罩</Spoiler>
              。
            </Text>
          </section>

          <section id="blocks" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              块级排印 · blockquote / list / dl / time / number
            </h2>
            <Blockquote cite="星见书音" class="max-w-md">
              独立引用组件:书页翻动的声音,是图书馆唯一允许的喧哗。
            </Blockquote>
            <div class="flex gap-12 text-sm">
              <List>
                <li>无序列表,disc 记号</li>
                <li>marker 用 faint 淡色</li>
                <li>
                  项距 0.375em
                  <List class="mt-1.5">
                    <li>嵌套时再挂一层 List</li>
                  </List>
                </li>
              </List>
              <List ordered>
                <li>有序列表,decimal</li>
                <li>与 prose 里的裸 ol 同源</li>
              </List>
              <DescriptionList>
                <dt>原名</dt>
                <dd>星之航路</dd>
                <dt>作者</dt>
                <dd>dt 用 medium 字重作标签,dd 正文色、缩进归零</dd>
              </DescriptionList>
            </div>
            <Text tone="muted">
              时间:
              <Time :value="Date.now()" format="relative" />
              发布 ·
              <Time :value="Date.now() - 3 * 60_000" format="relative" />
              更新 ·
              <Time :value="Date.now() - 2 * 86_400_000" format="relative" />
              归档 · 绝对档
              <Time :value="Date.now()" />
              · 未知值
              <Time :value="null" />
            </Text>
            <Text tone="muted">
              数字:
              <NumberFormat :value="1234567.891" />
              · 紧凑
              <NumberFormat :value="128000" format="compact" />
              · 百分比
              <NumberFormat :value="0.4271" format="percent" />
              · 货币
              <NumberFormat :value="1234.5" format="currency" currency="CNY" />
              · 收两位
              <NumberFormat :value="3.14159" :precision="2" />
              · 非法值
              <NumberFormat :value="null" />
            </Text>
          </section>

          <section id="codeblock" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              code block · 块级代码
            </h2>
            <CodeBlock
              class="max-w-2xl"
              lang="ts"
              :code="`import { CodeBlock } from '@hina-ui/vue'\n\n// vitesse 双主题,随暗色翻转;文法按需加载,SSR 渲染素文本\nconst greeting: string = '常驻复制钮,ghost 落墨,复制后两秒内显示已复制'\nexport const answer = 42 // 横向溢出时这一行会变得非常非常非常非常非常非常长以便测试滚动`"
            />
            <CodeBlock
              class="max-w-2xl"
              :copyable="false"
              :code="`# 无标签、不可复制的裸块\npnpm --filter @hina-ui/vue dev`"
            />
          </section>

          <section id="prose" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              prose · 接管原生标签流
            </h2>
            <Card class="max-w-2xl">
              <Prose>
                <h2>轻小说《星之航路》第三卷</h2>
                <p>
                  这一卷的
                  <strong>叙事结构</strong>
                  明显成熟了,作者在
                  <a href="#">上一卷的访谈</a>
                  里提过要尝试双线并进——如今看来,
                  <code>flashback</code>
                  的插入点选得相当克制。
                </p>
                <blockquote>
                  <p>「书页翻动的声音,是图书馆唯一允许的喧哗。」—— 星见书音</p>
                </blockquote>
                <h3>本卷看点</h3>
                <ul>
                  <li>双线叙事在第七章合流,伏笔回收干净</li>
                  <li>新角色的动机铺垫充分,没有工具人感</li>
                  <li>
                    插画与文字的配合达到系列最佳,快捷键
                    <kbd>Ctrl</kbd>
                    +
                    <kbd>D</kbd>
                    收藏
                  </li>
                </ul>
                <pre><code>const rating = { story: 9, art: 8.5, pacing: 8 }</code></pre>
                <table>
                  <thead>
                    <tr>
                      <th>卷次</th>
                      <th>评分</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>第一卷</td>
                      <td>8.2</td>
                      <td>已读</td>
                    </tr>
                    <tr>
                      <td>第三卷</td>
                      <td>9.0</td>
                      <td><mark>在读</mark></td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <p>
                  下一卷预定
                  <em>2027 年春</em>
                  发售。
                </p>
              </Prose>
            </Card>
          </section>

          <section id="input" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              input 探针 · primary 在 bg 上 / secondary 在 surface 内
            </h2>
            <div class="flex max-w-md flex-col gap-3">
              <Input v-model="email" size="sm" placeholder="primary · sm" />
              <Input v-model="email" placeholder="primary · md:hover 落墨,focus 墨退净" />
              <Input v-model="email" size="lg" placeholder="primary · lg" />
              <Input v-model="email" invalid placeholder="错误态:danger 勾边 + 淡墨" />
              <Input model-value="禁用态" disabled />
              <span class="text-muted text-sm">已输入:{{ email || '(空)' }}</span>
            </div>
            <Card class="max-w-md">
              <h3 class="text-md font-medium">surface 之内用 secondary</h3>
              <div class="mt-3 flex flex-col gap-3">
                <Input
                  v-model="email"
                  variant="secondary"
                  placeholder="扁平 · 无阴影 · inset 填充"
                />
                <Input v-model="email" variant="secondary" invalid placeholder="secondary 错误态" />
              </div>
            </Card>
          </section>

          <section id="card" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              card 探针 · surface / 间距 / 深浅
            </h2>
            <div class="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <h3 class="text-md font-medium">静态卡片</h3>
                <p class="text-muted mt-2 text-sm">发丝线 + 最轻阴影,底为 surface。</p>
              </Card>
              <Card as="button" class="hn-interactive hn-state-layer hn-press-lg text-start">
                <Ripple />
                <h3 class="text-md font-medium">调用方自组的可点卡</h3>
                <p class="text-muted mt-2 text-sm">
                  Card 只交 surface;可点视觉是调用方拼的:hn-interactive + hn-state-layer +
                  hn-press-lg + Ripple。
                </p>
              </Card>
              <Card :padded="false">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='120'%3E%3Crect fill='%2339c5bb' width='320' height='120'/%3E%3C/svg%3E"
                  alt=""
                  class="w-full rounded-t-lg"
                />
                <div class="p-[var(--hn-panel-p)]">
                  <h3 class="text-md font-medium">无内边距卡片</h3>
                  <p class="text-muted mt-2 text-sm">媒体贴边,文字区自管 padding。</p>
                </div>
              </Card>
            </div>
          </section>

          <section id="statelayer" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              状态层叠加在任意底色上
            </h2>
            <div class="flex flex-wrap gap-3">
              <Button
                v-for="c in ['blue', 'purple', 'cyan', 'orange', 'coral', 'yellow']"
                :key="c"
                variant="ghost"
                tone="neutral"
                :style="{ backgroundColor: `var(--color-expr-${c})`, color: '#171717' }"
              >
                {{ c }}
              </Button>
            </div>
          </section>

          <section id="stack" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              stack · 纵向布局(md 档随顶栏密度开关翻转)
            </h2>
            <div class="flex flex-wrap gap-10">
              <div v-for="g in ['sm', 'md', 'lg'] as const" :key="g" class="flex flex-col gap-2">
                <span class="text-faint font-mono text-xs">gap {{ g }}</span>
                <Stack :gap="g" class="w-40">
                  <div v-for="n in 3" :key="n" class="bg-inset text-muted rounded-md p-2 text-xs">
                    块 {{ n }}
                  </div>
                </Stack>
              </div>
              <div class="flex flex-col gap-2">
                <span class="text-faint font-mono text-xs">align center · as section</span>
                <Stack
                  as="section"
                  align="center"
                  gap="sm"
                  class="border-line w-40 rounded-md border p-3"
                >
                  <div class="bg-inset text-muted rounded-md p-2 text-xs">窄块</div>
                  <div class="bg-inset text-muted rounded-md p-2 text-xs">更宽一点的块</div>
                </Stack>
              </div>
            </div>
          </section>

          <section id="inline-layout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              inline · 横向布局(md 档随密度,默认换行 + 居中对齐)
            </h2>
            <Inline class="border-line max-w-md rounded-md border p-3">
              <Button>操作一</Button>
              <Button variant="outline" tone="neutral">操作二</Button>
              <Button variant="soft" tone="neutral">操作三</Button>
              <Button variant="ghost" tone="neutral">操作四</Button>
              <Button variant="outline" tone="danger">危险操作</Button>
            </Inline>
            <Inline align="baseline" gap="sm">
              <Heading :level="3">基线对齐</Heading>
              <Text tone="muted">大小字号沿 baseline 排,不是几何居中</Text>
            </Inline>
            <Inline :wrap="false" gap="sm" class="max-w-md overflow-hidden">
              <div
                v-for="n in 8"
                :key="n"
                class="bg-inset text-muted shrink-0 rounded-md p-2 text-xs"
              >
                nowrap {{ n }}
              </div>
            </Inline>
          </section>

          <section id="flex-layout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              flex · 自由布局(md 档随方向取 inline/stack 密度 token)
            </h2>
            <Flex
              justify="between"
              align="center"
              class="border-line max-w-md rounded-md border p-3"
            >
              <Text weight="medium">justify between</Text>
              <Button variant="ghost" tone="neutral">操作</Button>
            </Flex>
            <Flex
              direction="col-reverse"
              gap="md"
              class="border-line max-w-md rounded-md border p-3"
            >
              <div class="bg-inset text-muted rounded-md p-2 text-xs">
                DOM 里的第一个(col-reverse 排到底)
              </div>
              <div class="bg-inset text-muted rounded-md p-2 text-xs">DOM 里的第二个</div>
            </Flex>
          </section>

          <section id="grid-layout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              grid · 显式网格(md 档双轴各吃 inline/stack 密度 token)
            </h2>
            <Grid :cols="3" class="max-w-xl">
              <div v-for="n in 6" :key="n" class="bg-inset text-muted rounded-md p-3 text-xs">
                格 {{ n }}
              </div>
            </Grid>
            <Grid :cols="4" gap="sm" as="ul" class="max-w-xl list-none">
              <li v-for="n in 4" :key="n" class="bg-inset text-muted rounded-md p-2 text-xs">
                gap sm · li {{ n }}
              </li>
            </Grid>
          </section>

          <section id="simple-grid" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              simple grid · 自动成列(拖窗口宽度看列数变化)
            </h2>
            <Text tone="muted">auto-fill(默认):容器变宽先加空轨,子项守住 min 宽</Text>
            <SimpleGrid min="12rem">
              <div v-for="n in 3" :key="n" class="bg-inset text-muted rounded-md p-3 text-xs">
                fill {{ n }}
              </div>
            </SimpleGrid>
            <Text tone="muted">auto-fit:空轨塌掉,子项撑满整行</Text>
            <SimpleGrid min="12rem" fit>
              <div v-for="n in 3" :key="n" class="bg-inset text-muted rounded-md p-3 text-xs">
                fit {{ n }}
              </div>
            </SimpleGrid>
          </section>

          <section id="container-layout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              container · 内容宽度约束(四档语义页宽,此处画的是各档右边界)
            </h2>
            <ScrollArea direction="horizontal">
              <div class="flex w-[84rem] flex-col gap-2 pb-2">
                <Container
                  v-for="s in ['sm', 'md', 'lg', 'xl'] as const"
                  :key="s"
                  :size="s"
                  class="mx-0"
                >
                  <div class="bg-inset text-faint rounded-md p-2 text-right font-mono text-xs">
                    {{ s }}
                  </div>
                </Container>
              </div>
            </ScrollArea>
            <Text tone="muted">
              工作台内容列本身只有 ~57rem,md 以上会被钳位 —— 这条轨道 84rem,横向滚动看真实档差。
            </Text>
          </section>

          <section id="center-layout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">center · 双轴居中</h2>
            <Center class="border-line h-32 max-w-md rounded-md border">
              <Stack align="center" gap="xs">
                <Text weight="medium">空态占位</Text>
                <Text tone="muted">块级 Center:定高容器里双轴居中</Text>
              </Stack>
            </Center>
            <Text>
              行内版:文字里嵌一个
              <Center inline class="bg-inset size-6 rounded-full text-xs">音</Center>
              徽标,inline-flex 不打断行盒。
            </Text>
          </section>

          <section id="space-divider" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              space · 撑开与定长 / divider · 分隔
            </h2>
            <div class="border-line flex max-w-md items-center rounded-md border p-3">
              <Text weight="medium">工具栏左侧</Text>
              <Space />
              <Button variant="ghost" tone="neutral">被推到右边</Button>
            </div>
            <div class="border-line flex max-w-md items-center rounded-md border p-3">
              <Button variant="soft" tone="neutral">甲</Button>
              <Space size="lg" />
              <Button variant="soft" tone="neutral">乙(隔 lg 定长)</Button>
            </div>
            <Divider class="max-w-md" />
            <Divider class="max-w-md">第三卷</Divider>
            <div class="flex h-8 max-w-md items-center gap-3">
              <Text>左</Text>
              <Divider orientation="vertical" />
              <Text>右(竖分隔)</Text>
            </div>
          </section>

          <section id="aspect-ratio" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              aspect ratio · 比例盒(16:9 默认 / 1:1)
            </h2>
            <div class="flex max-w-2xl gap-4">
              <AspectRatio class="flex-1">
                <Center class="bg-inset size-full rounded-md">
                  <Text tone="muted">16 : 9</Text>
                </Center>
              </AspectRatio>
              <AspectRatio :ratio="1" class="w-40">
                <Center class="bg-inset size-full rounded-md">
                  <Text tone="muted">1 : 1</Text>
                </Center>
              </AspectRatio>
            </div>
          </section>

          <section id="splitter" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              splitter · 可调分栏(拖手柄或聚焦后用方向键)
            </h2>
            <Splitter class="border-line h-40 max-w-2xl rounded-md border">
              <SplitterPanel :default-size="30" :min-size="15">
                <Center class="h-full">
                  <Text tone="muted">侧栏 · min 15%</Text>
                </Center>
              </SplitterPanel>
              <SplitterHandle />
              <SplitterPanel :default-size="70">
                <Splitter direction="vertical" class="h-full">
                  <SplitterPanel :default-size="60">
                    <Center class="h-full"><Text tone="muted">内容区</Text></Center>
                  </SplitterPanel>
                  <SplitterHandle />
                  <SplitterPanel :default-size="40" :min-size="20">
                    <Center class="h-full"><Text tone="muted">纵向嵌套</Text></Center>
                  </SplitterPanel>
                </Splitter>
              </SplitterPanel>
            </Splitter>
          </section>

          <section id="collapsible" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              collapsible · 折叠(高度经 hn-anim-collapse,base + move)
            </h2>
            <Card class="max-w-md">
              <Collapsible default-open>
                <CollapsibleTrigger as-child>
                  <Button variant="ghost" tone="neutral" block class="group/coll justify-between">
                    组件 · 12 篇
                    <template #trailing>
                      <ChevronRight class="hn-transition group-data-[state=open]/coll:rotate-90" />
                    </template>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Stack gap="none" class="pt-1 ps-3">
                    <Button
                      v-for="t in ['Button', 'Input', 'Card']"
                      :key="t"
                      variant="ghost"
                      tone="neutral"
                      size="sm"
                      block
                      class="justify-start"
                    >
                      {{ t }}
                    </Button>
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger as-child>
                  <Button variant="ghost" tone="neutral" block class="group/coll justify-between">
                    设计语言 · 8 篇(默认收起)
                    <template #trailing>
                      <ChevronRight class="hn-transition group-data-[state=open]/coll:rotate-90" />
                    </template>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Stack gap="sm" class="pt-2 ps-3">
                    <Text tone="muted">
                      content 是无约束插槽:段落、列表、表单、嵌套折叠都行,高度动画量的是实际内容高。
                    </Text>
                    <List class="text-sm">
                      <li>薄墨:一种介质三种落法</li>
                      <li>两轴动效:时长归通道,曲线归性质</li>
                      <li>surface 与阴影:纯度守在内容坐的地方</li>
                    </List>
                    <Inline gap="sm">
                      <Button variant="soft" tone="neutral">也能放控件</Button>
                      <Kbd>Esc</Kbd>
                    </Inline>
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </section>

          <section id="sidebar-nav" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              navlink + sidebar · 文档站骨架预演(左侧工作台目录已是 NavLink 狗粮)
            </h2>
            <div
              class="border-line bg-surface h-80 max-w-md overflow-hidden rounded-md border shadow-sm"
            >
              <Sidebar class="h-full w-full border-e-0">
                <template #header>
                  <Text weight="medium">Hina UI</Text>
                </template>
                <SidebarGroup label="组件">
                  <NavLink href="#sidebar-nav" active>Button</NavLink>
                  <NavLink href="#sidebar-nav">Input</NavLink>
                  <NavLink href="#sidebar-nav">Card</NavLink>
                </SidebarGroup>
                <SidebarGroup label="设计语言" :default-open="false">
                  <NavLink href="#sidebar-nav">薄墨</NavLink>
                  <NavLink href="#sidebar-nav">两轴动效</NavLink>
                </SidebarGroup>
                <SidebarGroup label="很长的一组(测滚动)">
                  <NavLink v-for="n in 12" :key="n" href="#sidebar-nav">条目 {{ n }}</NavLink>
                </SidebarGroup>
                <template #footer>
                  <Text tone="muted">v0.1.0 · dev</Text>
                </template>
              </Sidebar>
            </div>
          </section>

          <section id="app-shell" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              app shell · 页面骨架(固定壳,内容滚动交给 ScrollArea —— 盒内可直接滚)
            </h2>
            <div class="border-line h-96 max-w-3xl overflow-hidden rounded-md border shadow-sm">
              <AppShell class="h-full">
                <template #header>
                  <SidebarTrigger size="sm" />
                  <Text weight="medium">Hina Docs</Text>
                  <Space />
                  <Button size="sm" variant="outline" tone="neutral">搜索</Button>
                </template>
                <template #sidebar>
                  <Sidebar class="h-full">
                    <SidebarGroup label="组件">
                      <NavLink href="#app-shell" label="Button" active>
                        <template #icon><MousePointerClick class="size-4 shrink-0" /></template>
                        Button
                      </NavLink>
                      <NavLink href="#app-shell" label="Input">
                        <template #icon><TextCursorInput class="size-4 shrink-0" /></template>
                        Input
                      </NavLink>
                    </SidebarGroup>
                  </Sidebar>
                </template>
                <Page>
                  <Breadcrumb>
                    <BreadcrumbItem href="#app-shell">文档</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem href="#app-shell">组件</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem current>Button</BreadcrumbItem>
                  </Breadcrumb>
                  <PageHeader
                    title="Button"
                    description="按钮组件的用法、变体与设计裁定。"
                    class="-mt-4"
                  >
                    <template #actions>
                      <Button variant="outline" tone="neutral">源码</Button>
                    </template>
                  </PageHeader>
                  <PageBody>
                    <Section title="变体" id="demo-variants">
                      <Text tone="muted">
                        solid / soft / outline / ghost 四种出身,墨与波纹随 hn-state-layer 白拿。
                      </Text>
                    </Section>
                    <Section title="尺寸" id="demo-sizes">
                      <Text v-for="n in 6" :key="n" tone="muted">
                        第 {{ n }} 段填充,撑出内滚 —— 滚动条与边缘投影在壳里自然成立。
                      </Text>
                    </Section>
                  </PageBody>
                  <template #aside>
                    <PageAside>
                      <Text size="sm" weight="medium">本页目录</Text>
                      <Anchor
                        :items="[
                          { id: 'demo-variants', label: '变体' },
                          { id: 'demo-sizes', label: '尺寸' },
                        ]"
                      />
                    </PageAside>
                  </template>
                </Page>
              </AppShell>
            </div>
          </section>

          <section id="tooltip" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              tooltip · 浮层底座第一件(反色小体 · pop 动效 · 悬停/聚焦触发)
            </h2>
            <Stack gap="sm" align="center" class="w-max">
              <Tooltip content="side = top" side="top">
                <Button variant="outline" tone="neutral">top</Button>
              </Tooltip>
              <Inline gap="sm" :wrap="false">
                <Tooltip content="side = left" side="left">
                  <Button variant="outline" tone="neutral">left</Button>
                </Tooltip>
                <Tooltip content="新建条目">
                  <Button icon-only aria-label="新建"><PlusIcon /></Button>
                </Tooltip>
                <Tooltip content="side = right" side="right">
                  <Button variant="outline" tone="neutral">right</Button>
                </Tooltip>
              </Inline>
              <Tooltip content="side = bottom" side="bottom">
                <Button variant="outline" tone="neutral">bottom</Button>
              </Tooltip>
            </Stack>
            <Inline gap="sm">
              <Tooltip
                content="较长的一段说明文字会在 max-w-xs 处换行,保持小体形态不变成一条横幅。"
              >
                <Button variant="ghost" tone="neutral">长文案</Button>
              </Tooltip>
            </Inline>
            <Text tone="muted">
              组间移动共享跳过延迟(Provider 已挂在工作台根部);聚焦触发同样生效,Esc 关闭。
            </Text>
          </section>

          <section id="popover" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              popover · 驻留型小浮层(surface 面 · 发丝线 + 浮层阴影 · 点击触发可交互)
            </h2>
            <Inline gap="sm">
              <Popover>
                <Button variant="outline" tone="neutral">筛选</Button>
                <template #content>
                  <Stack gap="sm">
                    <Heading :level="3" size="base">筛选条件</Heading>
                    <Text tone="muted">驻留可交互:点里面不会关,Esc 或点外才收。</Text>
                    <Inline gap="sm">
                      <Button size="sm" variant="soft" tone="neutral">重置</Button>
                      <Button size="sm">应用</Button>
                    </Inline>
                  </Stack>
                </template>
              </Popover>
              <Popover side="right" align="start" class="w-56">
                <Button variant="ghost" tone="neutral">side = right</Button>
                <template #content>
                  <Text tone="muted">side / align 与 Tooltip 同一套定位词汇。</Text>
                </template>
              </Popover>
            </Inline>
            <Text tone="muted">
              与 Tooltip 的身份区分:悬停说明是反色小体带箭头,点击面板是 surface 面不带箭头;动效同为
              pop,时长驻留档 base(Tooltip 是 fast)。
            </Text>
          </section>

          <section id="dialog" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              dialog · 大面积浮层(scrim + 第三海拔卡面 · slow 档 modal 动效 · 锁滚)
            </h2>
            <Inline gap="sm">
              <Dialog
                title="删除这本轻小说?"
                description="删除后不可恢复,关联的卷与章节将一并移除。"
              >
                <Button variant="outline" tone="danger">删除条目</Button>
                <template #content>
                  <Text tone="muted">
                    正文区是自由插槽;标题与描述由组件排版并自动接好 aria 关联,Esc / 点外 /
                    右上角都能关,焦点困在框内、关闭后归还触发器。
                  </Text>
                </template>
                <template #footer="{ close }">
                  <Button variant="soft" tone="neutral" @click="close()">取消</Button>
                  <Button tone="danger" @click="close()">确认删除</Button>
                </template>
              </Dialog>
              <Dialog
                title="服务条款"
                description="超高内容:头脚钉住,正文交给 ScrollArea。"
                size="lg"
              >
                <Button variant="outline" tone="neutral">超长内容</Button>
                <template #content>
                  <Stack gap="sm">
                    <Text v-for="n in 24" :key="n" tone="muted">
                      第 {{ n }} 条:正文在框内滚动,滚动条与边缘投影提示都来自
                      ScrollArea,标题与动作行钉在原位不跟着跑。
                    </Text>
                  </Stack>
                </template>
                <template #footer="{ close }">
                  <Button @click="close()">我已阅读</Button>
                </template>
              </Dialog>
              <Dialog
                title="移动端形态"
                description="placement='bottom' 的贴底 sheet;未指定时窄屏(<640px)自动如此。"
                placement="bottom"
              >
                <Button variant="ghost" tone="neutral">贴底形态</Button>
                <template #content>
                  <Text tone="muted">
                    同一身份换停靠位:落底但不贴死——四周均匀留白、圆角全留(贴死切角是 Drawer
                    的词汇),从底边整张滑入,scrim
                    与锁滚不变。缩窄窗口后,左边两个对话框也会自动进入这个形态。
                  </Text>
                </template>
                <template #footer="{ close }">
                  <Button @click="close()">知道了</Button>
                </template>
              </Dialog>
            </Inline>
            <Text tone="muted">
              面板同样是一张卡,海拔升到 shadow-lg;进场 slow 450 + enter-strong,出场统一 exit
              200;开着时锁滚与 Popover 同源。
            </Text>
          </section>

          <section id="drawer" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              drawer · 边缘工具面(贴死边 · 切直角 · 与 dialog 浮卡相对)
            </h2>
            <Inline gap="sm">
              <Drawer title="筛选条件" description="按标签、年份与状态过滤列表。">
                <Button variant="outline" tone="neutral">筛选(end)</Button>
                <template #content>
                  <Stack gap="sm">
                    <Text v-for="n in 18" :key="n" tone="muted">
                      条件组 {{ n }}:抽屉正文全高,滚动交给 ScrollArea,页脚钉底。
                    </Text>
                  </Stack>
                </template>
                <template #footer="{ close }">
                  <Button variant="soft" tone="neutral" @click="close()">重置</Button>
                  <Button @click="close()">应用</Button>
                </template>
              </Drawer>
              <Drawer title="目录" side="start" size="sm">
                <Button variant="ghost" tone="neutral">导航(start · sm)</Button>
                <template #content>
                  <Stack gap="none">
                    <NavLink href="#drawer" active>快速开始</NavLink>
                    <NavLink href="#drawer">设计语言</NavLink>
                    <NavLink href="#drawer">组件目录</NavLink>
                  </Stack>
                </template>
              </Drawer>
            </Inline>
            <Text tone="muted">
              身份判据的另一半:贴死屏幕边、四角全直是 Drawer 的词汇,Dialog 到哪都是悬浮圆角卡。side
              只有 start / end——bottom 的岗位归 Dialog 的 placement,top
              无岗位。模态全套(scrim、锁滚、焦点)与 Dialog 同源。
            </Text>
          </section>

          <section id="toast" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              toast · 常驻通知区(非模态 · 命令式 · z 阶梯唯一例外)
            </h2>
            <Inline gap="sm">
              <Button
                variant="soft"
                tone="neutral"
                @click="
                  toast.success('已保存', { description: '条目更新成功,3 位关注者将收到推送。' })
                "
              >
                成功
              </Button>
              <Button
                variant="soft"
                tone="neutral"
                @click="toast.danger('保存失败', { description: '网络中断,改动已暂存本地。' })"
              >
                危险
              </Button>
              <Button variant="soft" tone="neutral" @click="toast.warning('登录即将过期')">
                警告
              </Button>
              <Button variant="soft" tone="neutral" @click="toast.info('有 2 条新的评论回复')">
                信息
              </Button>
              <Button variant="soft" tone="neutral" @click="toast('剪贴板已更新')">中性</Button>
              <Button
                variant="outline"
                tone="neutral"
                @click="toast.info('常驻通知,自己不会走', { duration: 0 })"
              >
                常驻
              </Button>
              <Button variant="soft" tone="neutral" @click="demoPromise()">promise</Button>
              <Button
                variant="soft"
                tone="neutral"
                @click="
                  toast('已删除 3 条评论', {
                    description: '可以立即撤销这次操作。',
                    duration: 8000,
                    action: { label: '撤销', onClick: () => toast.success('已恢复') },
                    cancel: { label: '算了' },
                  })
                "
              >
                action
              </Button>
              <Button
                variant="soft"
                tone="neutral"
                @click="toast.custom(FollowToast, { duration: 0 })"
              >
                custom
              </Button>
              <Button variant="ghost" tone="neutral" @click="toast.dismiss()">清空全部</Button>
            </Inline>
            <Inline gap="sm" align="center">
              <Text size="sm" tone="muted">position</Text>
              <Button
                v-for="p in toastPositions"
                :key="p"
                size="sm"
                :variant="toastPos === p ? 'soft' : 'ghost'"
                tone="neutral"
                @click="((toastPos = p), toast.info(`position = ${p}`))"
              >
                {{ p }}
              </Button>
            </Inline>
            <Text tone="muted">
              命令式 API:toast() / .success / .loading / .promise / 同 id 原地更新 / action 与
              cancel 按钮 / onDismiss 回调。堆叠收拢露 3
              张(背卡缩位、取前卡高度),悬停或聚焦展开全列并暂停计时;右滑扫走、hover 渐显关闭钮;上限
              5 条丢最旧。
            </Text>
          </section>

          <section id="overlay-stack" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              浮层嵌套 · 栈序(z 不取号 · 后开者恒在上 · toast 恒顶)
            </h2>
            <Inline gap="sm">
              <Dialog
                title="嵌套演练场"
                description="所有浮层同一个 z=100,层序由挂载序自动决定,嵌套深度无上限。"
              >
                <Button variant="outline" tone="neutral">进入演练场</Button>
                <template #content>
                  <Stack gap="sm">
                    <Text tone="muted">
                      在这个对话框里继续开:驻留面板、内层对话框——后开的永远压在上面,Esc
                      逐层往回收。先发一条通知再开这些,通知永远浮在最顶(110 档;
                      模态开着时它只可见不可点,这是模态语义)。
                    </Text>
                    <Inline gap="sm">
                      <Popover>
                        <Button variant="soft" tone="neutral">开驻留面板</Button>
                        <template #content>
                          <Stack gap="sm">
                            <Text tone="muted">同 z 100,靠 DOM 序压在对话框上。</Text>
                            <Popover side="right">
                              <Button size="sm" variant="soft" tone="neutral">再套一层</Button>
                              <template #content>
                                <Text tone="muted">第三层,依旧后来者居上。</Text>
                              </template>
                            </Popover>
                          </Stack>
                        </template>
                      </Popover>
                      <Dialog title="内层对话框" description="后挂载,压住外层。" size="sm">
                        <Button variant="soft" tone="neutral">开内层对话框</Button>
                        <template #content>
                          <Text tone="muted">Esc 或点外只收我,外层还在。</Text>
                        </template>
                        <template #footer="{ close }">
                          <Button size="sm" @click="close()">收起</Button>
                        </template>
                      </Dialog>
                      <Button
                        variant="soft"
                        tone="neutral"
                        @click="toast.info('我在 110 档,谁也压不住', { duration: 0 })"
                      >
                        发常驻通知
                      </Button>
                    </Inline>
                  </Stack>
                </template>
              </Dialog>
            </Inline>
            <Text tone="muted">
              对应跨组件回归 overlay-stack:elementFromPoint 实测绘制序、Esc 逐层判定、toast
              先挂载仍恒顶,三条都有断言把守。
            </Text>
          </section>

          <section id="icon-button" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              icon button · 图标钮(label 必填兼 aria-label · 自带 tooltip · 无 provider 静默降级)
            </h2>
            <Inline gap="sm" align="center">
              <IconButton label="收藏"><Star /></IconButton>
              <IconButton label="新建条目" variant="solid" tone="accent"><PlusIcon /></IconButton>
              <IconButton label="更多操作" variant="outline"><ChevronRight /></IconButton>
              <IconButton label="胶囊形态" pill variant="soft"><PlusIcon /></IconButton>
              <IconButton label="小档" size="sm"><ChevronRight /></IconButton>
              <IconButton label="大档" size="lg"><PlusIcon /></IconButton>
              <IconButton label="保存中" :loading="loading"><PlusIcon /></IconButton>
              <IconButton label="无提示(tooltip=false)" :tooltip="false">
                <ChevronRight />
              </IconButton>
              <Divider orientation="vertical" class="h-6 self-center" />
              <CloseButton @click="toast('关掉了点什么')" />
              <CloseButton size="md" @click="toast('中档关闭')" />
              <CloseButton disabled />
              <Divider orientation="vertical" class="h-6 self-center" />
              <CopyButton text="#34A2D5" />
              <CopyButton text="pnpm add @hina-ui/vue" label="复制安装命令" size="md" />
            </Inline>
            <Text tone="muted">
              惯例内置:label 必填,同一份词供 aria-label 与 Tooltip;默认 ghost/neutral
              工具位形态;loading 白拿 Button 的图标交接;顶栏 loading 开关可看交接。
            </Text>
          </section>

          <section id="button-group" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              button group · 拼接组(几何归容器 · 组内禁按下缩放 · 形态一致性归调用方)
            </h2>
            <Inline gap="lg" align="center">
              <ButtonGroup label="对齐方式">
                <IconButton label="左对齐" variant="outline"><AlignLeft /></IconButton>
                <IconButton label="居中对齐" variant="outline"><AlignCenter /></IconButton>
                <IconButton label="右对齐" variant="outline"><AlignRight /></IconButton>
              </ButtonGroup>
              <ButtonGroup label="分页">
                <IconButton label="上一页" variant="outline" size="sm"><ChevronLeft /></IconButton>
                <Button variant="outline" tone="neutral" size="sm">1</Button>
                <Button variant="outline" tone="neutral" size="sm">2</Button>
                <Button variant="outline" tone="neutral" size="sm">3</Button>
                <IconButton label="下一页" variant="outline" size="sm"><ChevronRight /></IconButton>
              </ButtonGroup>
              <ButtonGroup label="保存方式" divider>
                <Button @click="toast.success('已保存')">保存</Button>
                <Popover v-model:open="saveMenu" align="end" :padded="false" class="w-44">
                  <IconButton label="更多保存方式" variant="solid" tone="accent">
                    <ChevronDown />
                  </IconButton>
                  <template #content>
                    <div class="flex flex-col p-1">
                      <Button
                        variant="ghost"
                        tone="neutral"
                        size="sm"
                        class="justify-start"
                        @click="pickSave('已另存为副本')"
                      >
                        另存为副本
                      </Button>
                      <Button
                        variant="ghost"
                        tone="neutral"
                        size="sm"
                        class="justify-start"
                        @click="pickSave('已导出 Markdown')"
                      >
                        导出 Markdown
                      </Button>
                      <Button
                        variant="ghost"
                        tone="neutral"
                        size="sm"
                        class="justify-start"
                        @click="pickSave('已保存并锁定')"
                      >
                        保存并锁定
                      </Button>
                    </div>
                  </template>
                </Popover>
              </ButtonGroup>
              <ButtonGroup label="删除方式" divider>
                <Button tone="danger" @click="toast.danger('已删除')">删除</Button>
                <Popover v-model:open="deleteMenu" align="end" :padded="false" class="w-40">
                  <IconButton label="更多删除方式" variant="solid" tone="danger">
                    <ChevronDown />
                  </IconButton>
                  <template #content>
                    <div class="flex flex-col p-1">
                      <Button
                        variant="ghost"
                        tone="neutral"
                        size="sm"
                        class="justify-start"
                        @click="pickDelete('已移入回收站')"
                      >
                        移入回收站
                      </Button>
                      <Button
                        variant="ghost"
                        tone="danger"
                        size="sm"
                        class="justify-start"
                        @click="pickDelete('已彻底删除')"
                      >
                        彻底删除
                      </Button>
                    </div>
                  </template>
                </Popover>
              </ButtonGroup>
              <ButtonGroup label="历史" divider>
                <IconButton label="撤销" variant="solid" tone="neutral" @click="toast('已撤销')">
                  <Undo2 />
                </IconButton>
                <IconButton label="重做" variant="solid" tone="neutral" @click="toast('已重做')">
                  <Redo2 />
                </IconButton>
              </ButtonGroup>
              <ButtonGroup label="周期" divider>
                <Button variant="soft" tone="neutral" pill>日</Button>
                <Button variant="soft" tone="neutral" pill>周</Button>
                <Button variant="soft" tone="neutral" pill>月</Button>
              </ButtonGroup>
            </Inline>
            <Text tone="muted">
              接缝侧圆角清零、边框叠 1px,首尾外角自动保留(pill 组免费成胶囊);focus 提 z 防 ring
              被邻居盖;solid/soft 默认浑然一体,静止要分界时 opt-in divider——非全高 currentColor
              细线,白字组出浅白线、深字组出灰线,同一方案通吃。拆分钮的箭头是组内嵌的 Popover
              触发器:Root 是 fragment,真按钮仍是组的直接子,几何不破;开面板期间触发钮保持按下墨。
            </Text>
          </section>

          <section id="tag" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              tag · 静态标注(名词不可交互 · soft/solid/outline 三变体 · 要 X 请找未来的 Chip)
            </h2>
            <Inline gap="sm" align="center">
              <Tag>默认中性</Tag>
              <Tag tone="accent">Galgame</Tag>
              <Tag tone="success">连载中</Tag>
              <Tag tone="warning">审核中</Tag>
              <Tag tone="danger">已下架</Tag>
              <Tag tone="info">公告</Tag>
            </Inline>
            <Inline gap="sm" align="center">
              <Tag variant="outline">v3.2.0</Tag>
              <Tag variant="outline" tone="accent">轻小说</Tag>
              <Tag variant="outline" tone="success">已完结</Tag>
              <Tag variant="outline" tone="danger">R-18</Tag>
              <Tag tone="accent">
                <Star />
                精选
              </Tag>
              <Tag pill tone="info">pill</Tag>
              <Tag size="md" tone="success">md 档</Tag>
              <Tag size="md" pill variant="outline">md · pill</Tag>
            </Inline>
            <Inline gap="sm" align="center">
              <Tag variant="solid" tone="danger">R-18</Tag>
              <Tag variant="solid" tone="accent">独家</Tag>
              <Tag variant="solid" tone="neutral">完结</Tag>
              <Tag variant="solid" tone="warning">删修版</Tag>
              <Tag variant="solid" tone="info" pill>NEW</Tag>
              <div
                class="relative h-24 w-40 overflow-hidden rounded-lg bg-neutral-300 dark:bg-neutral-600"
              >
                <Tag variant="solid" tone="danger" class="absolute top-1.5 start-1.5">R-18</Tag>
                <Tag variant="solid" tone="info" pill class="absolute bottom-1.5 end-1.5">NEW</Tag>
              </div>
            </Inline>
            <Text tone="muted">
              族内分工:Tag 静态标注;Chip 可交互实体(可删可点);Indicator 状态点原子;Badge
              锚定层(把数字或 Indicator 钉到宿主角上,自己不造点)。sm 档吃 xs 字(微标签岗位),md 档吃
              sm 字;透明 border 占位,三变体同尺寸。solid 的岗位是注目位/贴图位——封面角标那类 soft
              压不住的地方;内文流默认仍是 soft。
            </Text>
          </section>

          <section id="tabs" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              tabs · 分页签(underline/soft 两形态 · 滑块走 Highlight · sm/md 两档)
            </h2>
            <Tabs default-value="preview" class="max-w-xl">
              <TabsList label="示例形态">
                <TabsTrigger value="preview">预览</TabsTrigger>
                <TabsTrigger value="code">代码</TabsTrigger>
                <TabsTrigger value="design">设计裁定</TabsTrigger>
                <TabsTrigger value="locked" disabled>锁定</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" class="pt-3">
                <Text tone="muted">underline 默认形态:List 下边线 + accent 圆头滑块。</Text>
              </TabsContent>
              <TabsContent value="code" class="pt-3">
                <Text tone="muted">滑块与 Anchor 竖条、Sidebar 收展同一条运动曲线。</Text>
              </TabsContent>
              <TabsContent value="design" class="pt-3">
                <Text tone="muted">trigger 吃薄墨与波纹,成列不弹缩放;键盘方向键循焦跳禁用。</Text>
              </TabsContent>
            </Tabs>
            <Inline gap="lg" align="center">
              <Tabs default-value="a" variant="soft">
                <TabsList label="soft 形态">
                  <TabsTrigger value="a">总览</TabsTrigger>
                  <TabsTrigger value="b">评论</TabsTrigger>
                  <TabsTrigger value="c">收藏</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs default-value="a" variant="soft" size="sm">
                <TabsList label="soft 小档">
                  <TabsTrigger value="a">日</TabsTrigger>
                  <TabsTrigger value="b">周</TabsTrigger>
                  <TabsTrigger value="c">月</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs default-value="a" size="sm">
                <TabsList label="underline 小档">
                  <TabsTrigger value="a">pnpm</TabsTrigger>
                  <TabsTrigger value="b">npm</TabsTrigger>
                  <TabsTrigger value="c">yarn</TabsTrigger>
                </TabsList>
              </Tabs>
            </Inline>
            <Tabs default-value="t0" class="max-w-60">
              <TabsList label="溢出滚动">
                <TabsTrigger v-for="i in 8" :key="i" :value="`t${i - 1}`">第{{ i }}卷</TabsTrigger>
              </TabsList>
            </Tabs>
            <Inline gap="lg" align="start">
              <Tabs default-value="profile" orientation="vertical" class="max-w-md">
                <TabsList label="竖排设置">
                  <TabsTrigger value="profile">个人资料</TabsTrigger>
                  <TabsTrigger value="notify">通知偏好</TabsTrigger>
                  <TabsTrigger value="security">账号安全</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <Text tone="muted">竖排 underline:accent 竖条贴列缘滑动。</Text>
                </TabsContent>
                <TabsContent value="notify">
                  <Text tone="muted">上下方向键循焦,reka 自动换轴。</Text>
                </TabsContent>
                <TabsContent value="security">
                  <Text tone="muted">内容区在右侧。</Text>
                </TabsContent>
              </Tabs>
              <Tabs default-value="a" orientation="vertical" variant="soft">
                <TabsList label="竖排 soft">
                  <TabsTrigger value="a">概览</TabsTrigger>
                  <TabsTrigger value="b">成员</TabsTrigger>
                  <TabsTrigger value="c">权限</TabsTrigger>
                </TabsList>
              </Tabs>
            </Inline>
            <Text tone="muted">
              结构式四件族;滑块是 Highlight 原语的消费方(Motion 布局动画,可打断);变体与尺寸由根
              provide 下发;页签溢出时 List 横向滚动;内容切换瞬换防动画疲劳。
            </Text>
          </section>

          <section id="callout" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              callout · 提示块(role=note · 六 tone 语义对 · soft 底扁平块)
            </h2>
            <div class="flex max-w-2xl flex-col gap-3">
              <Callout title="备注">中性档,默认形态。图标、soft 底、可选标题,正文走插槽。</Callout>
              <Callout tone="accent" title="小技巧">
                accent 档是文档里的 TIP:品牌色引导,不承担状态语义。
              </Callout>
              <Callout tone="info">info 档,无标题也成立——只有一句话的提示很常见。</Callout>
              <Callout tone="warning" title="注意">
                warning 档:改这个 token 之前先跑一遍机检。
              </Callout>
              <Callout tone="danger" title="危险">
                danger 档:该操作不可逆,提交前确认迁移已备份。
              </Callout>
              <Callout tone="success" :icon="false" title="无图标形态">
                icon=false 收起图标;#icon 插槽可整体替换。
              </Callout>
            </div>
            <Text tone="muted">
              六 tone 与 Tag 同构,零新 token;图标映射沿用 Toast 的语义图标语言;静态文档标注取
              role=note,不用 alert(那是动态通知的语义)。
            </Text>
          </section>

          <section id="table" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              table · 样式表族(发丝线无斑马 · tabular-nums · 与 prose 裸表同源)
            </h2>
            <Table caption="Button 的属性" class="max-w-2xl">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-32">属性</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead class="w-24" align="end">默认值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><Code>variant</Code></TableCell>
                  <TableCell>solid | soft | outline | ghost | link</TableCell>
                  <TableCell align="end">solid</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Code>tone</Code></TableCell>
                  <TableCell>accent | neutral | danger</TableCell>
                  <TableCell align="end">accent</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Code>size</Code></TableCell>
                  <TableCell>sm | md | lg</TableCell>
                  <TableCell align="end">md</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Code>ripple</Code></TableCell>
                  <TableCell>boolean</TableCell>
                  <TableCell align="end">true</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table class="max-w-72" caption="窄容器横滚">
              <TableBody>
                <TableRow>
                  <TableCell v-for="i in 8" :key="i" class="whitespace-nowrap">
                    第 {{ i }} 列的较宽内容
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Inline gap="lg" align="start">
              <Table class="max-w-72" caption="无保底:窄容器把列挤扁折行">
                <TableBody>
                  <TableRow>
                    <TableCell v-for="i in 3" :key="i">第 {{ i }} 列的较宽内容</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table class="max-w-72" caption="min-w-36 保底:转为横滚">
                <TableBody>
                  <TableRow>
                    <TableCell v-for="i in 3" :key="i" class="min-w-36">
                      第 {{ i }} 列的较宽内容
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Inline>
            <Inline gap="lg" align="start">
              <Table sticky-header class="max-h-56 max-w-80" caption="吸顶表头:容器内滚,表头钉住">
                <TableHeader>
                  <TableRow>
                    <TableHead>卷</TableHead>
                    <TableHead align="end">章节数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="i in 16" :key="i">
                    <TableCell>第 {{ i }} 卷</TableCell>
                    <TableCell align="end">{{ 8 + (i % 5) }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table class="max-w-96" caption="吸首列:横滚时标识列钉住">
                <TableHeader>
                  <TableRow>
                    <TableHead sticky class="min-w-24">属性</TableHead>
                    <TableHead v-for="i in 6" :key="i" class="min-w-32">场景 {{ i }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="r in 3" :key="r">
                    <TableCell sticky>指标 {{ r }}</TableCell>
                    <TableCell v-for="i in 6" :key="i">值 {{ r }}-{{ i }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Inline>
            <Table
              sticky-header
              class="max-h-64 max-w-2xl"
              caption="双向滚:吸顶 + 吸首列 + 四缘阴影"
            >
              <TableHeader>
                <TableRow>
                  <TableHead sticky class="min-w-24">卷</TableHead>
                  <TableHead v-for="i in 8" :key="i" align="end" class="min-w-28">
                    指标 {{ i }}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="r in 14" :key="r">
                  <TableCell sticky>第 {{ r }} 卷</TableCell>
                  <TableCell v-for="i in 8" :key="i" align="end">
                    {{ (r * 37 + i * 13) % 97 }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table
              variant="secondary"
              class="max-w-xl"
              caption="secondary:没有 surface 的地方,不起面的轻表"
            >
              <TableHeader>
                <TableRow>
                  <TableHead>档位</TableHead>
                  <TableHead align="end">时长</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>fast</TableCell>
                  <TableCell align="end">200ms</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>base</TableCell>
                  <TableCell align="end">300ms</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>slow</TableCell>
                  <TableCell align="end">450ms</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Text tone="muted">
              六件结构族,不带数据逻辑(排序/筛选归将来的 DataTable);样式收在 hn-table utility,prose
              裸 markdown 表同源 @apply,机检比对计算样式;横向溢出由 ScrollArea
              接管(滚轮重定向白拿);th 默认 scope=col,caption 即表格可达名;列宽即 class——上表属性列
              w-32、默认值列 w-24,th 一处定整列;对照组:同一窄容器,无保底的列被挤扁折行, min-w-36
              保底后转为横滚。不设 width API。
            </Text>
          </section>

          <section id="prev-next" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              prev next · 上下页导航(nav 地标 · rel 语义 · 整卡可点 · 窄屏单列)
            </h2>
            <PrevNext class="max-w-2xl">
              <PrevNextLink direction="prev" href="#table">Table · 样式表</PrevNextLink>
              <PrevNextLink direction="next" href="#button">Button · 变体阵列</PrevNextLink>
            </PrevNext>
            <PrevNext class="max-w-2xl">
              <PrevNextLink direction="next" href="#tabs" label="下一章">
                第二章 · 分页签
              </PrevNextLink>
            </PrevNext>
            <Text tone="muted">
              两件结构族:容器是 nav 地标(locale 兜底名),链接卡走 as/asChild
              承接路由;只有一侧时仍落在对应列;方向词默认取 pagination
              的上一页/下一页,阅读器场景可覆写为上一章/下一章。
            </Text>
          </section>

          <section id="badge" class="flex scroll-mt-16 flex-col gap-4">
            <h2 class="text-muted font-mono text-sm tracking-wide uppercase">
              badge · 锚定徽标(钉在宿主角上 · 恒圆 · 六 tone solid · 四角与圆宿主内收)
            </h2>
            <Inline gap="lg" align="center">
              <Badge :content="unread" label="条未读通知">
                <IconButton label="通知" variant="outline" @click="unread = 0"><Bell /></IconButton>
              </Badge>
              <Badge :content="120">
                <IconButton label="收件箱" variant="soft" tone="neutral"><Bell /></IconButton>
              </Badge>
              <Badge content="NEW" tone="accent" size="md">
                <Button variant="outline" tone="neutral">更新日志</Button>
              </Badge>
              <Badge :content="3" tone="info" shape="circle" placement="bottom-end">
                <span class="bg-inset inline-block size-10 rounded-full" aria-hidden="true" />
              </Badge>
              <Badge :content="9" tone="success" placement="top-start" :outline="false">
                <span class="bg-inset inline-block size-10 rounded-md" aria-hidden="true" />
              </Badge>
              <Button size="sm" variant="ghost" tone="neutral" @click="unread = 5">重置未读</Button>
            </Inline>
            <Text tone="muted">
              锚定层:content
              钉在宿主角上,0/空不渲染且出现消失走进出过渡(点第一颗铃铛清零看出场);超过 max 显示
              99+;circle 宿主角点内收;outline 用 surface 色描边把徽标从边缘切出;label
              走视觉隐藏给读屏语境。侧栏 NEW 那种行内小标是 Tag 的岗位,不用它。
            </Text>
          </section>
        </main>
      </div>
      <Toaster :position="toastPos === 'auto' ? undefined : toastPos" />
    </div>
  </TooltipProvider>
</template>
