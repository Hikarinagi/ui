<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
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
  import Text from '../src/components/text/Text.vue'
  import type { ButtonVariants } from '../src/components/button/button.variants'
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

    <main class="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
      <section v-for="variant in variants" :key="variant" class="flex flex-col gap-4">
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
          <Button :variant="variant" :tone="tone" :loading="loading" icon-only aria-label="更多">
            ⋯
          </Button>
          <Button :variant="variant" :tone="tone" disabled>禁用</Button>
        </div>
      </section>

      <section class="flex flex-col gap-4">
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

      <section class="flex flex-col gap-4">
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

      <section class="flex flex-col gap-4">
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

      <section class="flex flex-col gap-4">
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

      <section class="flex flex-col gap-4">
        <h2 class="text-muted font-mono text-xs tracking-wide uppercase">code block · 块级代码</h2>
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

      <section class="flex flex-col gap-4">
        <h2 class="text-muted font-mono text-xs tracking-wide uppercase">prose · 接管原生标签流</h2>
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

      <section class="flex flex-col gap-4">
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

      <section class="flex flex-col gap-4">
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
              Card 只交 surface;可点视觉是调用方拼的:hn-interactive + hn-state-layer + hn-press-lg +
              Ripple。
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

      <section class="flex flex-col gap-4">
        <h2 class="text-muted font-mono text-xs tracking-wide uppercase">状态层叠加在任意底色上</h2>
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
    </main>
  </div>
</template>
