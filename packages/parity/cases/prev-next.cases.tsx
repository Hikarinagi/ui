import { h } from 'vue'
import VPrevNext from '@hina-ui/vue/components/prev-next/PrevNext.vue'
import VPrevNextLink from '@hina-ui/vue/components/prev-next/PrevNextLink.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { PrevNext } from '@hina-ui/react/components/prev-next/PrevNext'
import { PrevNextLink } from '@hina-ui/react/components/prev-next/PrevNextLink'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

export default defineCases('PrevNext', [
  {
    name: 'both directions',
    vue: () =>
      h(VPrevNext, null, () => [
        h(VPrevNextLink, { direction: 'prev', href: '/a' }, () => '排版与字阶'),
        h(VPrevNextLink, { direction: 'next', href: '/b' }, () => 'Button 按钮'),
      ]),
    react: () => (
      <PrevNext>
        <PrevNextLink direction="prev" href="/a">
          排版与字阶
        </PrevNextLink>
        <PrevNextLink direction="next" href="/b">
          Button 按钮
        </PrevNextLink>
      </PrevNext>
    ),
  },
  {
    name: 'next only with a nav label',
    vue: () =>
      h(VPrevNext, { label: '章节', dir: 'rtl' }, () => [
        h(VPrevNextLink, { direction: 'next', href: '/b' }, () =>
          h(VText, { truncate: true }, () => '第二章'),
        ),
      ]),
    react: () => (
      <PrevNext label="章节" dir="rtl">
        <PrevNextLink direction="next" href="/b">
          <Text truncate>第二章</Text>
        </PrevNextLink>
      </PrevNext>
    ),
  },
  {
    name: 'custom eyebrow label, class merge and attributes',
    vue: () =>
      h(
        VPrevNextLink,
        { direction: 'prev', label: '上一章', href: '/c', class: 'p-6', rel: 'nofollow', id: 'p' },
        () => '第一章',
      ),
    react: () => (
      <PrevNextLink direction="prev" label="上一章" href="/c" className="p-6" rel="nofollow" id="p">
        第一章
      </PrevNextLink>
    ),
  },
  {
    name: 'as button',
    vue: () =>
      h(VPrevNextLink, { direction: 'next', as: 'button', type: 'button' }, () => '下一步'),
    react: () => (
      <PrevNextLink direction="next" as="button" type="button">
        下一步
      </PrevNextLink>
    ),
  },
  {
    name: 'asChild lends the link attributes to the first child, as Reka Slot does',
    vue: () =>
      h(VPrevNextLink, { direction: 'prev', asChild: true, id: 'p' }, () =>
        h('a', { href: '/a' }, '第一章'),
      ),
    react: () => (
      <PrevNextLink direction="prev" asChild id="p">
        <a href="/a">第一章</a>
      </PrevNextLink>
    ),
  },
  {
    name: 'nav class merge',
    vue: () => h(VPrevNext, { class: 'gap-2' }),
    react: () => <PrevNext className="gap-2" />,
  },
])
