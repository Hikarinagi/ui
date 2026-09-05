import { ref, type Ref } from 'vue'

export function useFileDrop(disabled: Ref<boolean>, onFiles: (files: File[]) => void) {
  const dragging = ref(false)
  let depth = 0

  function onDragEnter(event: DragEvent) {
    if (disabled.value) return
    event.preventDefault()
    depth += 1
    dragging.value = true
  }

  function onDragOver(event: DragEvent) {
    if (disabled.value) return
    event.preventDefault()
  }

  function onDragLeave() {
    if (disabled.value) return
    depth = Math.max(depth - 1, 0)
    if (depth === 0) dragging.value = false
  }

  function onDrop(event: DragEvent) {
    if (disabled.value) return
    event.preventDefault()
    depth = 0
    dragging.value = false
    const files = Array.from(event.dataTransfer?.files ?? [])
    if (files.length) onFiles(files)
  }

  function onChange(event: Event) {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files ?? [])
    input.value = ''
    if (files.length) onFiles(files)
  }

  return { dragging, onDragEnter, onDragOver, onDragLeave, onDrop, onChange }
}
