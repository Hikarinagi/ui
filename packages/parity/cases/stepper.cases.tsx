import { defineComponent, h } from 'vue'
import VStepper from '@hina-ui/vue/components/stepper/Stepper.vue'
import { provideUiLocale, enUS as vueEnUS } from '@hina-ui/vue/locale'
import { Stepper } from '@hina-ui/react/components/stepper/Stepper'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import type { StepperItem, StepperSlotProps } from '@hina-ui/react/components/stepper/types'
import { defineCases } from '../src/cases'

const items: StepperItem[] = [
  { title: '步骤 A', description: '第一项的说明' },
  { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
  { title: '步骤 C', description: '最后一项的说明' },
]
const plain: StepperItem[] = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }]
const states: StepperItem[] = [
  { title: '已完成', completed: true },
  { title: '需要检查', description: '此步骤存在错误', error: true },
  { title: '已禁用', disabled: true },
]

export default defineCases('Stepper', [
  {
    name: 'basic',
    vue: () => h(VStepper, { items }),
    react: () => <Stepper items={items} />,
  },
  {
    name: 'default value 2',
    vue: () => h(VStepper, { items, defaultValue: 2 }),
    react: () => <Stepper items={items} defaultValue={2} />,
  },
  {
    name: 'controlled value 3 without descriptions',
    vue: () => h(VStepper, { items: plain, modelValue: 3 }),
    react: () => <Stepper items={plain} value={3} />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VStepper, { items, size, defaultValue: 2 }),
    react: () => <Stepper items={items} size={size} defaultValue={2} />,
  })),
  {
    name: 'vertical with class',
    vue: () => h(VStepper, { items, defaultValue: 2, orientation: 'vertical', class: 'max-w-md' }),
    react: () => (
      <Stepper items={items} defaultValue={2} orientation="vertical" className="max-w-md" />
    ),
  },
  {
    name: 'non-linear',
    vue: () => h(VStepper, { items, linear: false }),
    react: () => <Stepper items={items} linear={false} />,
  },
  {
    name: 'completed, error and disabled states',
    vue: () => h(VStepper, { items: states, defaultValue: 2, linear: false }),
    react: () => <Stepper items={states} defaultValue={2} linear={false} />,
  },
  {
    name: 'whole stepper disabled',
    vue: () => h(VStepper, { items: states, defaultValue: 2, linear: false, disabled: true }),
    react: () => <Stepper items={states} defaultValue={2} linear={false} disabled />,
  },
  {
    name: 'explicit rtl direction and label',
    vue: () => h(VStepper, { items, linear: false, dir: 'rtl', label: 'Checkout' }),
    react: () => <Stepper items={items} linear={false} dir="rtl" label="Checkout" />,
  },
  {
    name: 'out of range value is clamped',
    vue: () => h(VStepper, { items: plain, defaultValue: 9 }),
    react: () => <Stepper items={plain} defaultValue={9} />,
  },
  {
    name: 'empty items',
    vue: () => h(VStepper, { items: [], defaultValue: 9 }),
    react: () => <Stepper items={[]} defaultValue={9} />,
  },
  {
    name: 'content panel with navigation',
    vue: () =>
      h(
        VStepper,
        { items },
        {
          default: (scope: { step: number; canNext: boolean; canPrev: boolean }) =>
            h('p', `${scope.step}:${scope.canPrev}:${scope.canNext}`),
        },
      ),
    react: () => (
      <Stepper items={items}>
        {scope => <p>{`${scope.step}:${scope.canPrev}:${scope.canNext}`}</p>}
      </Stepper>
    ),
  },
  {
    name: 'custom indicator, title and description slots',
    vue: () =>
      h(
        VStepper,
        { items: plain, linear: false },
        {
          indicator: ({ index }: StepperSlotProps) => h('svg', { 'data-index': index }),
          title: ({ item, active }: StepperSlotProps) =>
            h('span', { 'data-active': String(active) }, item.title),
          description: ({ step }: StepperSlotProps) => `Step ${step} details`,
        },
      ),
    react: () => (
      <Stepper
        items={plain}
        linear={false}
        renderIndicator={({ index }) => <svg data-index={index} />}
        renderTitle={({ item, active }) => <span data-active={String(active)}>{item.title}</span>}
        renderDescription={({ step }) => `Step ${step} details`}
      />
    ),
  },
  {
    name: 'fallthrough attributes on the root',
    vue: () =>
      h(VStepper, { items: plain, id: 'checkout', 'data-flow': 'buy', style: 'width:20rem' }),
    react: () => <Stepper items={plain} id="checkout" data-flow="buy" style={{ width: '20rem' }} />,
  },
  {
    name: 'English locale',
    vue: () =>
      h(
        defineComponent({
          setup() {
            provideUiLocale(vueEnUS)
            return () => h(VStepper, { items: states, defaultValue: 2, linear: false })
          },
        }),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <Stepper items={states} defaultValue={2} linear={false} />
      </UiLocaleProvider>
    ),
  },
])
