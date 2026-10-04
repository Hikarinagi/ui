import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VEditable from '@hina-ui/vue/components/editable/Editable.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { Editable as REditable } from '@hina-ui/react/components/editable/Editable'
import { FormField as RFormField } from '@hina-ui/react/components/form-field/FormField'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(a => a.playState === 'running' && !(a.timeline && 'source' in a.timeline))
      if (running.length) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await new Promise(resolve => setTimeout(resolve, 400))
  await frames(4)
}

const preview = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-editable] > button')!

const failing = () => Promise.reject(new Error('Name already in use'))

export default defineLiveCases('Editable', [
  {
    name: 'click enters edit mode with the text selected',
    vue: () => h(VEditable, { modelValue: 'Project title', 'aria-label': 'Title', name: 'title' }),
    react: () => <REditable defaultValue="Project title" aria-label="Title" name="title" />,
    interact: async container => {
      await userEvent.click(preview(container))
    },
    settle: idle,
  },
  {
    name: 'Enter commits the draft and returns to preview',
    vue: () => h(VEditable, { modelValue: 'Project title', 'aria-label': 'Title' }),
    react: () => <REditable defaultValue="Project title" aria-label="Title" />,
    interact: async container => {
      await userEvent.click(preview(container))
      await userEvent.keyboard('New title{Enter}')
    },
    settle: idle,
  },
  {
    name: 'Escape cancels the draft',
    vue: () => h(VEditable, { modelValue: 'Project title', 'aria-label': 'Title' }),
    react: () => <REditable defaultValue="Project title" aria-label="Title" />,
    interact: async container => {
      await userEvent.click(preview(container))
      await userEvent.keyboard('Discard{Escape}')
    },
    settle: idle,
  },
  {
    name: 'multiline editing inside a field',
    vue: () =>
      h(VFormField, { label: '简介', description: '公开' }, () =>
        h(VEditable, { modelValue: '第一行\n第二行', multiline: true, rows: 3 }),
      ),
    react: () => (
      <RFormField label="简介" description="公开">
        <REditable defaultValue={'第一行\n第二行'} multiline rows={3} />
      </RFormField>
    ),
    interact: async container => {
      await userEvent.click(preview(container))
      await vi.waitFor(() => {
        if (!container.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('init')
      })
    },
    settle: idle,
  },
  {
    name: 'failed save shows the error and keeps the draft',
    vue: () =>
      h(VEditable, { modelValue: 'Project title', 'aria-label': 'Title', onSave: failing }),
    react: () => <REditable defaultValue="Project title" aria-label="Title" onSave={failing} />,
    interact: async container => {
      await userEvent.click(preview(container))
      await userEvent.keyboard('Taken{Enter}')
      await vi.waitFor(() => {
        if (!container.querySelector('[role=alert]')) throw new Error('no alert')
      })
    },
    settle: idle,
  },
  {
    name: 'manual activation through the edit action',
    vue: () =>
      h(VEditable, {
        modelValue: '手动',
        activationMode: 'manual',
        submitMode: 'manual',
        'aria-label': 'Title',
      }),
    react: () => (
      <REditable
        defaultValue="手动"
        activationMode="manual"
        submitMode="manual"
        aria-label="Title"
      />
    ),
    interact: async container => {
      await userEvent.click(container.querySelector('button[aria-label="编辑"]')!)
    },
    settle: idle,
  },
])
