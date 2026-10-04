import { defineComponent, h } from 'vue'
import VSplitter from '@hina-ui/vue/components/splitter/Splitter.vue'
import VSplitterPanel from '@hina-ui/vue/components/splitter/SplitterPanel.vue'
import VSplitterHandle from '@hina-ui/vue/components/splitter/SplitterHandle.vue'
import { provideUiLocale, enUS as vueEnUS } from '@hina-ui/vue/locale'
import { Splitter } from '@hina-ui/react/components/splitter/Splitter'
import { SplitterPanel } from '@hina-ui/react/components/splitter/SplitterPanel'
import { SplitterHandle } from '@hina-ui/react/components/splitter/SplitterHandle'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases } from '../src/cases'

export default defineCases('Splitter', [
  {
    name: 'two panels with a handle',
    vue: () =>
      h(VSplitter, { class: 'h-32 w-[400px]' }, () => [
        h(VSplitterPanel, { defaultSize: 50, minSize: 20 }, () => h('p', '左栏')),
        h(VSplitterHandle),
        h(VSplitterPanel, { defaultSize: 50 }, () => h('p', '右栏')),
      ]),
    react: () => (
      <Splitter className="h-32 w-[400px]">
        <SplitterPanel defaultSize={50} minSize={20}>
          <p>左栏</p>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel defaultSize={50}>
          <p>右栏</p>
        </SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'panels without default sizes',
    vue: () =>
      h(VSplitter, null, () => [
        h(VSplitterPanel, null, () => 'Left'),
        h(VSplitterHandle),
        h(VSplitterPanel, null, () => 'Right'),
      ]),
    react: () => (
      <Splitter>
        <SplitterPanel>Left</SplitterPanel>
        <SplitterHandle />
        <SplitterPanel>Right</SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'vertical direction with fractional sizes',
    vue: () =>
      h(VSplitter, { direction: 'vertical', class: 'h-64' }, () => [
        h(VSplitterPanel, { defaultSize: 33.333 }, () => 'Top'),
        h(VSplitterHandle),
        h(VSplitterPanel, { defaultSize: 66.667 }, () => 'Bottom'),
      ]),
    react: () => (
      <Splitter direction="vertical" className="h-64">
        <SplitterPanel defaultSize={33.333}>Top</SplitterPanel>
        <SplitterHandle />
        <SplitterPanel defaultSize={66.667}>Bottom</SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'collapsible panel with sizes and a custom label',
    vue: () =>
      h(VSplitter, { autoSaveId: 'docs' }, () => [
        h(
          VSplitterPanel,
          { collapsible: true, collapsedSize: 0, defaultSize: 28, minSize: 18, maxSize: 40 },
          () => 'Aside',
        ),
        h(VSplitterHandle, { label: '调整目录宽度', class: 'bg-inset' }),
        h(VSplitterPanel, { defaultSize: 72, class: 'p-4' }, () => 'Main'),
      ]),
    react: () => (
      <Splitter autoSaveId="docs">
        <SplitterPanel collapsible collapsedSize={0} defaultSize={28} minSize={18} maxSize={40}>
          Aside
        </SplitterPanel>
        <SplitterHandle label="调整目录宽度" className="bg-inset" />
        <SplitterPanel defaultSize={72} className="p-4">
          Main
        </SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'collapsible panel starting collapsed',
    vue: () =>
      h(VSplitter, null, () => [
        h(VSplitterPanel, { collapsible: true }, () => 'Aside'),
        h(VSplitterHandle),
        h(VSplitterPanel, null, () => 'Main'),
      ]),
    react: () => (
      <Splitter>
        <SplitterPanel collapsible>Aside</SplitterPanel>
        <SplitterHandle />
        <SplitterPanel>Main</SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'explicit ids and fallthrough attributes',
    vue: () =>
      h(VSplitter, { id: 'outer', 'aria-label': 'Editor' }, () => [
        h(VSplitterPanel, { id: 'left', defaultSize: 40, style: { minWidth: '8rem' } }, () => 'L'),
        h(VSplitterHandle, { id: 'divider', disabled: true, tabindex: -1, 'aria-label': 'Fixed' }),
        h(VSplitterPanel, { id: 'right', defaultSize: 60, order: 2 }, () => 'R'),
      ]),
    react: () => (
      <Splitter id="outer" aria-label="Editor">
        <SplitterPanel id="left" defaultSize={40} style={{ minWidth: '8rem' }}>
          L
        </SplitterPanel>
        <SplitterHandle id="divider" disabled tabIndex={-1} aria-label="Fixed" />
        <SplitterPanel id="right" defaultSize={60} order={2}>
          R
        </SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'nested splitters',
    vue: () =>
      h(VSplitter, null, () => [
        h(VSplitterPanel, { defaultSize: 30, minSize: 20 }, () => 'Nav'),
        h(VSplitterHandle),
        h(VSplitterPanel, { defaultSize: 70 }, () =>
          h(VSplitter, { direction: 'vertical', class: 'h-full' }, () => [
            h(VSplitterPanel, { defaultSize: 65 }, () => 'Edit'),
            h(VSplitterHandle),
            h(VSplitterPanel, { defaultSize: 35 }, () => 'Preview'),
          ]),
        ),
      ]),
    react: () => (
      <Splitter>
        <SplitterPanel defaultSize={30} minSize={20}>
          Nav
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel defaultSize={70}>
          <Splitter direction="vertical" className="h-full">
            <SplitterPanel defaultSize={65}>Edit</SplitterPanel>
            <SplitterHandle />
            <SplitterPanel defaultSize={35}>Preview</SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
    ),
  },
  {
    name: 'English handle label',
    vue: () =>
      h(
        defineComponent({
          setup() {
            provideUiLocale(vueEnUS)
            return () =>
              h(VSplitter, null, () => [
                h(VSplitterPanel, null, () => 'A'),
                h(VSplitterHandle),
                h(VSplitterPanel, null, () => 'B'),
              ])
          },
        }),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <Splitter>
          <SplitterPanel>A</SplitterPanel>
          <SplitterHandle />
          <SplitterPanel>B</SplitterPanel>
        </Splitter>
      </UiLocaleProvider>
    ),
  },
])
