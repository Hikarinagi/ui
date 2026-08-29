<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
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
  import type { ButtonVariants } from '../src/components/button/button.variants'
  import { ChevronRight } from '@lucide/vue'
  import PlusIcon from './PlusIcon.vue'
  import ArrowIcon from './ArrowIcon.vue'

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
</script>

<template>
  <div :data-density="density" class="bg-canvas text-fg min-h-screen">
    <header
      class="border-line bg-canvas sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b px-6 py-3"
    >
      <span class="text-muted mr-auto text-sm font-medium">Hina UI 预览工作台</span>
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
            <h2 class="text-muted font-mono text-xs tracking-wide uppercase">{{ variant }}</h2>
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">block / as / type</h2>
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
            <Button pill icon-only size="lg" variant="soft" aria-label="新建"><PlusIcon /></Button>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-muted text-sm">行内混排:点这里</span>
            <Button variant="link">链接按钮</Button>
            <Button variant="link" tone="neutral">中性链接</Button>
            <Button variant="link" tone="danger" size="sm">危险动作</Button>
            <Button variant="link" disabled>禁用链接</Button>
            <span class="text-muted text-sm">继续正文</span>
          </div>
        </section>

        <section id="text" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">link · 导航链接</h2>
          <div class="flex flex-wrap items-center gap-5">
            <Link href="#">accent 导航</Link>
            <Link href="#" tone="neutral">neutral 导航</Link>
            <Link href="#" underline>正文里带下划线的</Link>
            <Link href="#" tone="neutral" underline>中性带下划线</Link>
            <Text as="span" tone="muted" size="sm">
              交互与 Button link 同一套墨:hover 压深,下划线只是身份标识
            </Text>
          </div>
        </section>

        <section id="inline" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            行内排印 · code / kbd / mark / spoiler
          </h2>
          <Text>
            行内代码混排:运行
            <Code>pnpm --filter @hikarinagi/ui dev</Code>
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <Text tone="muted" size="sm">
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
          <Text tone="muted" size="sm">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            code block · 块级代码
          </h2>
          <CodeBlock
            class="max-w-2xl"
            lang="ts"
            :code="`import { CodeBlock } from '@hikarinagi/ui'\n\n// vitesse 双主题,随暗色翻转;文法按需加载,SSR 渲染素文本\nconst greeting: string = '常驻复制钮,ghost 落墨,复制后两秒内显示已复制'\nexport const answer = 42 // 横向溢出时这一行会变得非常非常非常非常非常非常长以便测试滚动`"
          />
          <CodeBlock
            class="max-w-2xl"
            :copyable="false"
            :code="`# 无标签、不可复制的裸块\npnpm --filter @hikarinagi/ui dev`"
          />
        </section>

        <section id="prose" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
              <Input v-model="email" variant="secondary" placeholder="扁平 · 无阴影 · inset 填充" />
              <Input v-model="email" variant="secondary" invalid placeholder="secondary 错误态" />
            </div>
          </Card>
        </section>

        <section id="card" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
                Card 只交 surface;可点视觉是调用方拼的:hn-interactive + hn-state-layer + hn-press-lg
                + Ripple。
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            inline · 横向布局(md 档随密度,默认换行 + 居中对齐)
          </h2>
          <Inline class="border-line max-w-md rounded-md border p-3">
            <Button size="sm">操作一</Button>
            <Button size="sm" variant="outline" tone="neutral">操作二</Button>
            <Button size="sm" variant="soft" tone="neutral">操作三</Button>
            <Button size="sm" variant="ghost" tone="neutral">操作四</Button>
            <Button size="sm" variant="outline" tone="danger">危险操作</Button>
          </Inline>
          <Inline align="baseline" gap="sm">
            <Heading :level="3">基线对齐</Heading>
            <Text tone="muted" size="sm">大小字号沿 baseline 排,不是几何居中</Text>
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            flex · 自由布局(md 档随方向取 inline/stack 密度 token)
          </h2>
          <Flex justify="between" align="center" class="border-line max-w-md rounded-md border p-3">
            <Text weight="medium">justify between</Text>
            <Button size="sm" variant="ghost" tone="neutral">操作</Button>
          </Flex>
          <Flex direction="col-reverse" gap="md" class="border-line max-w-md rounded-md border p-3">
            <div class="bg-inset text-muted rounded-md p-2 text-xs">
              DOM 里的第一个(col-reverse 排到底)
            </div>
            <div class="bg-inset text-muted rounded-md p-2 text-xs">DOM 里的第二个</div>
          </Flex>
        </section>

        <section id="grid-layout" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            simple grid · 自动成列(拖窗口宽度看列数变化)
          </h2>
          <Text tone="muted" size="sm">auto-fill(默认):容器变宽先加空轨,子项守住 min 宽</Text>
          <SimpleGrid min="12rem">
            <div v-for="n in 3" :key="n" class="bg-inset text-muted rounded-md p-3 text-xs">
              fill {{ n }}
            </div>
          </SimpleGrid>
          <Text tone="muted" size="sm">auto-fit:空轨塌掉,子项撑满整行</Text>
          <SimpleGrid min="12rem" fit>
            <div v-for="n in 3" :key="n" class="bg-inset text-muted rounded-md p-3 text-xs">
              fit {{ n }}
            </div>
          </SimpleGrid>
        </section>

        <section id="container-layout" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
          <Text tone="muted" size="sm">
            工作台内容列本身只有 ~57rem,md 以上会被钳位 —— 这条轨道 84rem,横向滚动看真实档差。
          </Text>
        </section>

        <section id="center-layout" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">center · 双轴居中</h2>
          <Center class="border-line h-32 max-w-md rounded-md border">
            <Stack align="center" gap="xs">
              <Text weight="medium">空态占位</Text>
              <Text tone="muted" size="sm">块级 Center:定高容器里双轴居中</Text>
            </Stack>
          </Center>
          <Text>
            行内版:文字里嵌一个
            <Center inline class="bg-inset size-6 rounded-full text-xs">音</Center>
            徽标,inline-flex 不打断行盒。
          </Text>
        </section>

        <section id="space-divider" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            space · 撑开与定长 / divider · 分隔
          </h2>
          <div class="border-line flex max-w-md items-center rounded-md border p-3">
            <Text weight="medium">工具栏左侧</Text>
            <Space />
            <Button size="sm" variant="ghost" tone="neutral">被推到右边</Button>
          </div>
          <div class="border-line flex max-w-md items-center rounded-md border p-3">
            <Button size="sm" variant="soft" tone="neutral">甲</Button>
            <Space size="lg" />
            <Button size="sm" variant="soft" tone="neutral">乙(隔 lg 定长)</Button>
          </div>
          <Divider class="max-w-md" />
          <Divider class="max-w-md">第三卷</Divider>
          <div class="flex h-8 max-w-md items-center gap-3">
            <Text size="sm">左</Text>
            <Divider orientation="vertical" />
            <Text size="sm">右(竖分隔)</Text>
          </div>
        </section>

        <section id="aspect-ratio" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            aspect ratio · 比例盒(16:9 默认 / 1:1)
          </h2>
          <div class="flex max-w-2xl gap-4">
            <AspectRatio class="flex-1">
              <Center class="bg-inset size-full rounded-md">
                <Text tone="muted" size="sm">16 : 9</Text>
              </Center>
            </AspectRatio>
            <AspectRatio :ratio="1" class="w-40">
              <Center class="bg-inset size-full rounded-md">
                <Text tone="muted" size="sm">1 : 1</Text>
              </Center>
            </AspectRatio>
          </div>
        </section>

        <section id="splitter" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            splitter · 可调分栏(拖手柄或聚焦后用方向键)
          </h2>
          <Splitter class="border-line h-40 max-w-2xl rounded-md border">
            <SplitterPanel :default-size="30" :min-size="15">
              <Center class="h-full">
                <Text tone="muted" size="sm">侧栏 · min 15%</Text>
              </Center>
            </SplitterPanel>
            <SplitterHandle />
            <SplitterPanel :default-size="70">
              <Splitter direction="vertical" class="h-full">
                <SplitterPanel :default-size="60">
                  <Center class="h-full"><Text tone="muted" size="sm">内容区</Text></Center>
                </SplitterPanel>
                <SplitterHandle />
                <SplitterPanel :default-size="40" :min-size="20">
                  <Center class="h-full"><Text tone="muted" size="sm">纵向嵌套</Text></Center>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </section>

        <section id="collapsible" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
                  <Text tone="muted" size="sm">
                    content 是无约束插槽:段落、列表、表单、嵌套折叠都行,高度动画量的是实际内容高。
                  </Text>
                  <List class="text-sm">
                    <li>薄墨:一种介质三种落法</li>
                    <li>两轴动效:时长归通道,曲线归性质</li>
                    <li>surface 与阴影:纯度守在内容坐的地方</li>
                  </List>
                  <Inline gap="sm">
                    <Button size="sm" variant="soft" tone="neutral">也能放控件</Button>
                    <Kbd>Esc</Kbd>
                  </Inline>
                </Stack>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </section>

        <section id="sidebar-nav" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
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
                <Text tone="muted" size="sm">v0.1.0 · dev</Text>
              </template>
            </Sidebar>
          </div>
        </section>

        <section id="app-shell" class="flex scroll-mt-16 flex-col gap-4">
          <h2 class="text-muted font-mono text-xs tracking-wide uppercase">
            app shell · 页面骨架(固定壳,内容滚动交给 ScrollArea —— 盒内可直接滚)
          </h2>
          <div class="border-line h-96 max-w-3xl overflow-hidden rounded-md border shadow-sm">
            <AppShell class="h-full">
              <template #header>
                <Text weight="medium">Hina Docs</Text>
                <Space />
                <Button size="sm" variant="outline" tone="neutral">搜索</Button>
              </template>
              <template #sidebar>
                <Sidebar class="h-full">
                  <SidebarGroup label="组件">
                    <NavLink href="#app-shell" active>Button</NavLink>
                    <NavLink href="#app-shell">Input</NavLink>
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
                    <Button size="sm" variant="outline" tone="neutral">源码</Button>
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
      </main>
    </div>
  </div>
</template>
