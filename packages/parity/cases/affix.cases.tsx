import { h } from 'vue'
import VAffix from '@hina-ui/vue/components/affix/Affix.vue'
import { Affix } from '@hina-ui/react/components/affix/Affix'
import { defineCases } from '../src/cases'

export default defineCases('Affix', [
  {
    name: 'default top',
    vue: () => h(VAffix, null, () => h('button', 'Save')),
    react: () => (
      <Affix>
        <button>Save</button>
      </Affix>
    ),
  },
  ...(['top', 'bottom'] as const).map(position => ({
    name: `${position} as aside with offset and scoped content`,
    vue: () =>
      h(
        VAffix,
        { as: 'aside', position, offset: 16, 'aria-label': 'Actions' },
        { default: ({ affixed }: { affixed: boolean }) => h('button', `Save ${affixed}`) },
      ),
    react: () => (
      <Affix as="aside" position={position} offset={16} aria-label="Actions">
        {({ affixed }) => <button>{`Save ${affixed}`}</button>}
      </Affix>
    ),
  })),
  {
    name: 'disabled with a non-finite offset',
    vue: () => h(VAffix, { disabled: true, offset: Infinity }, () => 'Content'),
    react: () => (
      <Affix disabled offset={Infinity}>
        Content
      </Affix>
    ),
  },
  {
    name: 'negative offset, class and caller style',
    vue: () =>
      h(
        VAffix,
        { offset: -8, class: 'bg-surface', style: { paddingBlock: '4px' }, id: 'toolbar' },
        () => 'Toolbar',
      ),
    react: () => (
      <Affix offset={-8} className="bg-surface" style={{ paddingBlock: '4px' }} id="toolbar">
        Toolbar
      </Affix>
    ),
  },
])
