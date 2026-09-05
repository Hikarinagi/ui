import { onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'

export function useObjectUrls(files: Ref<File[]>, enabled: Ref<boolean>) {
  const urls = shallowRef(new Map<File, string>())

  function revokeAll() {
    for (const url of urls.value.values()) URL.revokeObjectURL(url)
    urls.value = new Map()
  }

  watch(
    [files, enabled],
    ([list, on]) => {
      const supported = typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
      if (!on || !supported) {
        if (urls.value.size) revokeAll()
        return
      }
      const next = new Map<File, string>()
      for (const file of list) {
        if (!file.type.startsWith('image/')) continue
        next.set(file, urls.value.get(file) ?? URL.createObjectURL(file))
      }
      for (const [file, url] of urls.value) if (!next.has(file)) URL.revokeObjectURL(url)
      urls.value = next
    },
    { immediate: true },
  )

  onBeforeUnmount(revokeAll)

  return { urls }
}
