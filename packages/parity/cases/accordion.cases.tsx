import { h } from 'vue'
import { Plus as VPlus } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Plus as RPlusIcon } from '@hina-ui/react/../node_modules/lucide-react'
import VAccordion from '@hina-ui/vue/components/accordion/Accordion.vue'
import VAccordionItem from '@hina-ui/vue/components/accordion/AccordionItem.vue'
import VAccordionTrigger from '@hina-ui/vue/components/accordion/AccordionTrigger.vue'
import VAccordionContent from '@hina-ui/vue/components/accordion/AccordionContent.vue'
import VCard from '@hina-ui/vue/components/card/Card.vue'
import VHeading from '@hina-ui/vue/components/heading/Heading.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { Accordion } from '@hina-ui/react/components/accordion/Accordion'
import { AccordionItem } from '@hina-ui/react/components/accordion/AccordionItem'
import { AccordionTrigger } from '@hina-ui/react/components/accordion/AccordionTrigger'
import { AccordionContent } from '@hina-ui/react/components/accordion/AccordionContent'
import { Card } from '@hina-ui/react/components/card/Card'
import { Heading } from '@hina-ui/react/components/heading/Heading'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { Text } from '@hina-ui/react/components/text/Text'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const RPlus = lucide(RPlusIcon)

interface Item {
  value: string
  disabled?: boolean
  trigger?: { level?: 2 | 3 | 4 | 5 | 6; icon?: boolean }
}

const pair: Item[] = [{ value: 'a' }, { value: 'b' }]

function vueHarness(root: Record<string, unknown> = {}, items: Item[] = pair) {
  return () =>
    h(VAccordion, root, () =>
      items.map(item =>
        h(VAccordionItem, { value: item.value, disabled: item.disabled }, () => [
          h(VAccordionTrigger, item.trigger ?? null, () => `标题 ${item.value}`),
          h(VAccordionContent, null, () => h('p', `内容 ${item.value}`)),
        ]),
      ),
    )
}

function reactHarness(root: Record<string, unknown> = {}, items: Item[] = pair) {
  return () => (
    <Accordion {...root}>
      {items.map(item => (
        <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
          <AccordionTrigger {...item.trigger}>{`标题 ${item.value}`}</AccordionTrigger>
          <AccordionContent>
            <p>{`内容 ${item.value}`}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

const harness = (name: string, root: Record<string, unknown> = {}, items: Item[] = pair) => ({
  name,
  vue: vueHarness(root, items),
  react: reactHarness(root, items),
})

const intro = '转学第一天，我在天台遇见了那个抱着旧相机的少女。'
const staff = '原作、脚本与原画均由同一位作者完成。'

function vueDemo(
  root: Record<string, unknown>,
  entries: Array<[string, string, string, boolean?]>,
) {
  return () =>
    h(VAccordion, root, () =>
      entries.map(([value, title, body, disabled]) =>
        h(VAccordionItem, { value, disabled }, () => [
          h(VAccordionTrigger, () => title),
          h(VAccordionContent, () => h(VText, { tone: 'muted', size: 'sm' }, () => body)),
        ]),
      ),
    )
}

function reactDemo(
  root: Record<string, unknown>,
  entries: Array<[string, string, string, boolean?]>,
) {
  return () => (
    <Accordion {...reactProps(root)}>
      {entries.map(([value, title, body, disabled]) => (
        <AccordionItem key={value} value={value} disabled={disabled}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              {body}
            </Text>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function reactProps({ class: className, modelValue, ...rest }: Record<string, unknown>) {
  return { ...rest, className, value: modelValue } as Record<string, unknown>
}

const demo = (
  name: string,
  root: Record<string, unknown>,
  entries: Array<[string, string, string, boolean?]>,
) => ({ name, vue: vueDemo(root, entries), react: reactDemo(root, entries) })

const two: Array<[string, string, string]> = [
  ['intro', '作品简介', intro],
  ['staff', '制作人员', staff],
]

export default defineCases('Accordion', [
  harness('closed by default with h3 headings and indicators'),
  harness('level and icon false', {}, [{ value: 'a', trigger: { level: 2, icon: false } }]),
  harness('defaultValue opens the second item', { defaultValue: 'b' }),
  {
    name: 'controlled value',
    vue: vueHarness({ modelValue: 'a' }),
    react: reactHarness({ value: 'a' }),
  },
  harness('collapsible single', { collapsible: true, defaultValue: 'a' }),
  harness('multiple with array default', { type: 'multiple', defaultValue: ['a', 'b'] }),
  harness('multiple without default', { type: 'multiple' }),
  harness('disabled item', {}, [{ value: 'a', disabled: true }, { value: 'b' }]),
  harness('disabled root', { disabled: true, defaultValue: 'a' }),
  ...([4, 5, 6] as const).map(level =>
    harness(`level ${level}`, { defaultValue: 'a' }, [{ value: 'a', trigger: { level } }]),
  ),
  {
    name: 'class and attributes on every part',
    vue: () =>
      h(VAccordion, { class: 'w-full', 'data-root': '', defaultValue: 'a' }, () =>
        h(VAccordionItem, { value: 'a', class: 'px-2', 'data-item': '' }, () => [
          h(VAccordionTrigger, { class: 'text-sm', id: 'heading', 'data-trigger': '' }, () => 'A'),
          h(
            VAccordionContent,
            { class: 'text-muted', 'data-content': '', style: { color: 'red' } },
            () => 'body',
          ),
        ]),
      ),
    react: () => (
      <Accordion className="w-full" data-root="" defaultValue="a">
        <AccordionItem value="a" className="px-2" data-item="">
          <AccordionTrigger className="text-sm" id="heading" data-trigger="">
            A
          </AccordionTrigger>
          <AccordionContent className="text-muted" data-content="" style={{ color: 'red' }}>
            body
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  demo('demo basic', { class: 'w-full max-w-md' }, two),
  demo(
    'demo collapsible',
    { collapsible: true, defaultValue: 'intro', class: 'w-full max-w-md' },
    two,
  ),
  {
    name: 'demo controlled',
    vue: vueDemo({ modelValue: 'intro' }, two),
    react: reactDemo({ modelValue: 'intro' }, two),
  },
  demo(
    'demo multiple',
    { type: 'multiple', defaultValue: ['intro', 'staff'], class: 'w-full max-w-md' },
    [...two, ['release', '发售信息', '2024 年冬季发售，支持简体中文。']],
  ),
  demo('demo disabled item', { defaultValue: 'intro' }, [
    ['intro', '作品简介', intro],
    ['staff', '制作人员', staff, true],
  ]),
  demo('demo disabled root', { disabled: true }, two),
  {
    name: 'demo hero',
    vue: () =>
      h(VCard, { class: 'w-full max-w-md' }, () =>
        vueDemo({ defaultValue: 'submit' }, [
          [
            'submit',
            '如何投稿',
            '登录后进入创作者中心，选择作品类型并填写资料，提交后进入审核队列。',
          ],
          ['review', '审核需要多久', '通常在三个工作日内完成，资料不全时会退回补充。'],
          ['edit', '可以修改已发布的内容吗', '可以。修改会生成新的版本，经审核后替换当前内容。'],
        ])(),
      ),
    react: () => (
      <Card className="w-full max-w-md">
        {reactDemo({ defaultValue: 'submit' }, [
          [
            'submit',
            '如何投稿',
            '登录后进入创作者中心，选择作品类型并填写资料，提交后进入审核队列。',
          ],
          ['review', '审核需要多久', '通常在三个工作日内完成，资料不全时会退回补充。'],
          ['edit', '可以修改已发布的内容吗', '可以。修改会生成新的版本，经审核后替换当前内容。'],
        ])()}
      </Card>
    ),
  },
  {
    name: 'demo icon slot and icon false',
    vue: () =>
      h(VAccordion, { class: 'w-full max-w-md' }, () => [
        h(VAccordionItem, { value: 'intro' }, () => [
          h(VAccordionTrigger, null, { default: () => '作品简介', icon: () => h(VPlus) }),
          h(VAccordionContent, () => h(VText, { tone: 'muted', size: 'sm' }, () => intro)),
        ]),
        h(VAccordionItem, { value: 'staff' }, () => [
          h(VAccordionTrigger, { icon: false }, () => '制作人员'),
          h(VAccordionContent, () => h(VText, { tone: 'muted', size: 'sm' }, () => staff)),
        ]),
      ]),
    react: () => (
      <Accordion className="w-full max-w-md">
        <AccordionItem value="intro">
          <AccordionTrigger icon={<RPlus />}>作品简介</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              {intro}
            </Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="staff">
          <AccordionTrigger icon={false}>制作人员</AccordionTrigger>
          <AccordionContent>
            <Text tone="muted" size="sm">
              {staff}
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: 'demo level',
    vue: () =>
      h(VStack, { class: 'w-full max-w-md' }, () => [
        h(VHeading, { level: 3, size: 'md' }, () => '常见问题'),
        h(VAccordion, () =>
          [
            ['submit', '如何投稿', '登录后进入创作者中心，选择作品类型并填写资料。'],
            ['review', '审核需要多久', '通常在三个工作日内完成。'],
          ].map(([value, title, body]) =>
            h(VAccordionItem, { value }, () => [
              h(VAccordionTrigger, { level: 4 }, () => title),
              h(VAccordionContent, () => h(VText, { tone: 'muted', size: 'sm' }, () => body)),
            ]),
          ),
        ),
      ]),
    react: () => (
      <Stack className="w-full max-w-md">
        <Heading level={3} size="md">
          常见问题
        </Heading>
        <Accordion>
          {[
            ['submit', '如何投稿', '登录后进入创作者中心，选择作品类型并填写资料。'],
            ['review', '审核需要多久', '通常在三个工作日内完成。'],
          ].map(([value, title, body]) => (
            <AccordionItem key={value} value={value!}>
              <AccordionTrigger level={4}>{title}</AccordionTrigger>
              <AccordionContent>
                <Text tone="muted" size="sm">
                  {body}
                </Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Stack>
    ),
  },
])
