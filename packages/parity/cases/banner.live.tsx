import { h, type Component } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { Sparkles as VSparkles } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Sparkles } from '@hina-ui/react/../node_modules/lucide-react'
import VBannerComponent from '@hina-ui/vue/components/banner/Banner.vue'
import VLink from '@hina-ui/vue/components/link/Link.vue'
import { Banner } from '@hina-ui/react/components/banner/Banner'
import { Link } from '@hina-ui/react/components/link/Link'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const VBanner = VBannerComponent as unknown as Component
const SparklesIcon = lucide(Sparkles)

type Notice = { text: string; tone?: 'warning'; link?: string }
const notices: Notice[] = [
  { text: 'Hina UI 1.2 已发布。', link: '查看更新说明' },
  { text: '本站将于 3 月 1 日 02:00 至 04:00 停机维护。', tone: 'warning' },
  { text: '周年活动进行中，全站图书限时八折。', link: '了解详情' },
]
const vueNotices = [notices[0], notices[1], { ...notices[2], icon: VSparkles }]
const reactNotices = [notices[0], notices[1], { ...notices[2], icon: SparklesIcon }]

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await frames(4)
}

function counter(text: string) {
  return async () => {
    await vi.waitFor(() => {
      const counterNode = document.querySelector('.tabular-nums')
      if (counterNode?.textContent?.replace(/\s+/g, ' ') !== text) throw new Error('not yet')
    })
    await idle()
  }
}

function items(name: string, props: Record<string, unknown>, extra: Partial<LiveCase>): LiveCase {
  return {
    name,
    vue: () =>
      h(
        VBanner,
        { items: vueNotices, ...props },
        {
          item: ({ item }: { item: Notice }) => [
            item.text,
            item.link ? h(VLink, { href: '#', underline: true }, () => item.link) : null,
          ],
        },
      ),
    react: () => (
      <Banner
        items={reactNotices}
        {...props}
        renderItem={({ item }) => (
          <>
            {item.text}
            {item.link ? (
              <Link href="#" underline>
                {item.link}
              </Link>
            ) : null}
          </>
        )}
      />
    ),
    settle: idle,
    ...extra,
  }
}

async function parkPointer() {
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
  park.remove()
}

const button = (label: string) => (container: HTMLElement) =>
  container.querySelector<HTMLElement>(`button[aria-label="${label}"]`)!

export default defineLiveCases('Banner', [
  items('mounted rotation', { closable: true }, {}),
  items(
    'next rotates to the warning notice',
    { closable: true },
    {
      interact: async container => {
        await userEvent.click(button('下一条')(container))
      },
      settle: counter('2 / 3'),
    },
  ),
  items(
    'previous wraps to the last notice with its own icon',
    {},
    {
      interact: async container => {
        await userEvent.click(button('上一条')(container))
      },
      settle: counter('3 / 3'),
    },
  ),
  items(
    'two steps forward then one back',
    {},
    {
      interact: async container => {
        await userEvent.click(button('下一条')(container))
        await counter('2 / 3')()
        await userEvent.click(button('下一条')(container))
        await counter('3 / 3')()
        await userEvent.click(button('上一条')(container))
      },
      settle: counter('2 / 3'),
    },
  ),
  items(
    'keyboard activation of the next control',
    {},
    {
      interact: async container => {
        button('下一条')(container).focus()
        await userEvent.keyboard('{Enter}')
      },
      settle: counter('2 / 3'),
    },
  ),
  items(
    'autoplay advances and pauses on hover',
    { autoplay: 600, tone: 'info' },
    {
      interact: async container => {
        await parkPointer()
        await vi.waitFor(
          () => {
            if (!container.textContent?.includes('2 / 3')) throw new Error('not rotated')
          },
          { timeout: 3000 },
        )
        await userEvent.hover(container.querySelector<HTMLElement>('[data-tone]')!)
      },
      settle: counter('2 / 3'),
    },
  ),
  items(
    'close button removes the rotating banner',
    { closable: true },
    {
      interact: async container => {
        await userEvent.click(button('关闭')(container))
      },
      settle: async () => {
        await vi.waitFor(() => {
          if (document.querySelector('[data-hn-banner]')) throw new Error('still mounted')
        })
        await idle()
      },
    },
  ),
  {
    name: 'closable plain banner closes',
    vue: () => h(VBanner, { tone: 'success', closable: true }, () => '你的邮箱已完成验证。'),
    react: () => (
      <Banner tone="success" closable>
        你的邮箱已完成验证。
      </Banner>
    ),
    interact: async container => {
      await userEvent.click(button('关闭')(container))
    },
    settle: async () => {
      await vi.waitFor(() => {
        if (document.querySelector('[data-hn-banner]')) throw new Error('still mounted')
      })
      await idle()
    },
  },
])
