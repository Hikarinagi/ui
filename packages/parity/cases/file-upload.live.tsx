import { h } from 'vue'
import { vi } from 'vitest'
import VFileUpload from '@hina-ui/vue/components/file-upload/FileUpload.vue'
import { FileUpload as RFileUpload } from '@hina-ui/react/components/file-upload/FileUpload'
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

const png = () =>
  new File(
    [
      Uint8Array.from(
        atob(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        ),
        c => c.charCodeAt(0),
      ),
    ],
    'dot.png',
    { type: 'image/png', lastModified: 1 },
  )

const pdf = () =>
  new File([new Uint8Array(2048)], 'contract.pdf', { type: 'application/pdf', lastModified: 1 })

function choose(container: HTMLElement, files: File[]) {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const data = new DataTransfer()
  files.forEach(file => data.items.add(file))
  input.files = data.files
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

export default defineLiveCases('FileUpload', [
  {
    name: 'chosen files are listed with previews and remove buttons',
    vue: () => h(VFileUpload, { multiple: true, 'aria-label': '上传' }),
    react: () => <RFileUpload multiple aria-label="上传" />,
    interact: async container => {
      choose(container, [png(), pdf()])
      await vi.waitFor(() => {
        if (!container.querySelector('li img')) throw new Error('no preview')
      })
    },
    settle: idle,
    ignoreAttributes: ['src'],
    reason:
      'object URLs from URL.createObjectURL are unique per call, so the img src differs between runs',
  },
  {
    name: 'single mode replaces the file and the button variant keeps its label',
    vue: () => h(VFileUpload, { variant: 'button', 'aria-label': '上传' }),
    react: () => <RFileUpload variant="button" aria-label="上传" />,
    interact: async container => {
      choose(container, [pdf()])
      await vi.waitFor(() => {
        if (!container.querySelector('li')) throw new Error('no list')
      })
    },
    settle: idle,
  },
  {
    name: 'dragging over the area marks it',
    vue: () => h(VFileUpload, { 'aria-label': '上传' }),
    react: () => <RFileUpload aria-label="上传" />,
    interact: async container => {
      const area = container.querySelector('[data-hn-file-upload-area]')!
      area.dispatchEvent(
        new DragEvent('dragenter', {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        }),
      )
    },
    settle: idle,
  },
])
