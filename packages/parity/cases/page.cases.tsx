import { h } from 'vue'
import VPage from '@hina-ui/vue/components/page/Page.vue'
import VPageHeader from '@hina-ui/vue/components/page/PageHeader.vue'
import VPageBody from '@hina-ui/vue/components/page/PageBody.vue'
import VPageAside from '@hina-ui/vue/components/page/PageAside.vue'
import VSection from '@hina-ui/vue/components/section/Section.vue'
import VCard from '@hina-ui/vue/components/card/Card.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import VInline from '@hina-ui/vue/components/inline/Inline.vue'
import VTag from '@hina-ui/vue/components/tag/Tag.vue'
import { Page } from '@hina-ui/react/components/page/Page'
import { PageHeader } from '@hina-ui/react/components/page/PageHeader'
import { PageBody } from '@hina-ui/react/components/page/PageBody'
import { PageAside } from '@hina-ui/react/components/page/PageAside'
import { Section } from '@hina-ui/react/components/section/Section'
import { Card } from '@hina-ui/react/components/card/Card'
import { Text } from '@hina-ui/react/components/text/Text'
import { Button } from '@hina-ui/react/components/button/Button'
import { Inline } from '@hina-ui/react/components/inline/Inline'
import { Tag } from '@hina-ui/react/components/tag/Tag'
import { defineCases } from '../src/cases'

const links = ['简介', '角色', '制作人员']

export default defineCases('Page', [
  {
    name: 'unit harness with header actions sections and aside',
    vue: () =>
      h(VPage, null, {
        default: () => [
          h(
            VPageHeader,
            { title: 'Button', description: '按钮组件的用法与变体。' },
            { actions: () => h('button', '源码') },
          ),
          h(VPageBody, null, () => [
            h(VSection, { title: '变体', id: 'variants' }, () => h('p', '四种变体')),
            h(VSection, { title: '尺寸', id: 'sizes' }, () => h('p', '三档尺寸')),
          ]),
        ],
        aside: () => h(VPageAside, { label: '本页目录' }, () => h('p', '目录')),
      }),
    react: () => (
      <Page
        aside={
          <PageAside label="本页目录">
            <p>目录</p>
          </PageAside>
        }
      >
        <PageHeader
          title="Button"
          description="按钮组件的用法与变体。"
          actions={<button>源码</button>}
        />
        <PageBody>
          <Section title="变体" id="variants">
            <p>四种变体</p>
          </Section>
          <Section title="尺寸" id="sizes">
            <p>三档尺寸</p>
          </Section>
        </PageBody>
      </Page>
    ),
  },
  {
    name: 'bare page without aside',
    vue: () => h(VPage, null, () => h('p', '正文')),
    react: () => (
      <Page>
        <p>正文</p>
      </Page>
    ),
  },
  {
    name: 'basic demo',
    vue: () =>
      h(VCard, { padded: false, class: 'w-full overflow-hidden' }, () =>
        h(VPage, { size: 'sm' }, () => [
          h(VPageHeader, { title: '我的书架', description: '收录了 48 部作品。' }),
          h(VPageBody, null, () => h(VText, { size: 'sm', tone: 'muted' }, () => '页面正文。')),
        ]),
      ),
    react: () => (
      <Card padded={false} className="w-full overflow-hidden">
        <Page size="sm">
          <PageHeader title="我的书架" description="收录了 48 部作品。" />
          <PageBody>
            <Text size="sm" tone="muted">
              页面正文。
            </Text>
          </PageBody>
        </Page>
      </Card>
    ),
  },
  {
    name: 'header demo with eyebrow actions and extra content',
    vue: () =>
      h(VPage, { size: 'sm' }, () =>
        h(
          VPageHeader,
          { eyebrow: '轻小说', title: '春与修罗', description: '全三卷，连载中。' },
          {
            actions: () => [
              h(VButton, { variant: 'soft', tone: 'neutral', size: 'sm' }, () => '收藏'),
              h(VButton, { size: 'sm' }, () => '开始阅读'),
            ],
            default: () =>
              h(VInline, { gap: 'xs' }, () => [
                h(VTag, () => '奇幻'),
                h(VTag, () => '校园'),
                h(VTag, { tone: 'accent' }, () => '编辑推荐'),
              ]),
          },
        ),
      ),
    react: () => (
      <Page size="sm">
        <PageHeader
          eyebrow="轻小说"
          title="春与修罗"
          description="全三卷，连载中。"
          actions={
            <>
              <Button variant="soft" tone="neutral" size="sm">
                收藏
              </Button>
              <Button size="sm">开始阅读</Button>
            </>
          }
        >
          <Inline gap="xs">
            <Tag>奇幻</Tag>
            <Tag>校园</Tag>
            <Tag tone="accent">编辑推荐</Tag>
          </Inline>
        </PageHeader>
      </Page>
    ),
  },
  {
    name: 'hero demo with aside links',
    vue: () =>
      h(
        VPage,
        { size: 'lg' },
        {
          default: () => [
            h(VPageHeader, {
              eyebrow: 'Galgame',
              title: 'サクラノ詩',
              description: '枕 · 2015-10-23 · 剧本 すかぢ',
            }),
            h(VPageBody, null, () => [
              h(VText, { size: 'sm', tone: 'muted' }, () => '作品简介与详情放在这里。'),
              h(VText, { size: 'sm', tone: 'muted' }, () => '正文各节之间由 PageBody 统一间距。'),
            ]),
          ],
          aside: () =>
            h(VPageAside, { label: '本页目录' }, () =>
              links.map(link => h('a', { href: '#' }, link)),
            ),
        },
      ),
    react: () => (
      <Page
        size="lg"
        aside={
          <PageAside label="本页目录">
            {links.map(link => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </PageAside>
        }
      >
        <PageHeader
          eyebrow="Galgame"
          title="サクラノ詩"
          description="枕 · 2015-10-23 · 剧本 すかぢ"
        />
        <PageBody>
          <Text size="sm" tone="muted">
            作品简介与详情放在这里。
          </Text>
          <Text size="sm" tone="muted">
            正文各节之间由 PageBody 统一间距。
          </Text>
        </PageBody>
      </Page>
    ),
  },
  {
    name: 'aside without label has no landmark name',
    vue: () =>
      h(VPage, null, {
        default: () => h('p', '正文'),
        aside: () => h(VPageAside, () => h('p', '侧栏')),
      }),
    react: () => (
      <Page
        aside={
          <PageAside>
            <p>侧栏</p>
          </PageAside>
        }
      >
        <p>正文</p>
      </Page>
    ),
  },
  {
    name: 'header eyebrow only and description only',
    vue: () =>
      h(VPageBody, { class: 'gap-2' }, () => [
        h(VPageHeader, { eyebrow: '分类' }),
        h(VPageHeader, { description: '说明', class: 'border-b' }),
      ]),
    react: () => (
      <PageBody className="gap-2">
        <PageHeader eyebrow="分类" />
        <PageHeader description="说明" className="border-b" />
      </PageBody>
    ),
  },
  {
    name: 'class merge and attributes',
    vue: () =>
      h(
        VPage,
        { size: 'md', class: 'py-4', id: 'page', 'data-x': '1' },
        {
          default: () => h(VPageBody, { id: 'body', class: 'gap-2' }, () => 'x'),
          aside: () => h(VPageAside, { label: '目录', class: 'w-64', 'data-y': '2' }),
        },
      ),
    react: () => (
      <Page
        size="md"
        className="py-4"
        id="page"
        data-x="1"
        aside={<PageAside label="目录" className="w-64" data-y="2" />}
      >
        <PageBody id="body" className="gap-2">
          x
        </PageBody>
      </Page>
    ),
  },
])
