import { computed, nextTick, ref } from 'vue'
import { tryOnBeforeUnmount } from '@vueuse/core'
import {
  createScrollLock,
  type ScrollBody,
} from '../../../../shared/src/primitives/body-scroll-lock'
import { injectConfigProviderContext } from './config'

export function useBodyScrollLock(initialState?: boolean) {
  const config = injectConfigProviderContext({ scrollBody: ref(true) }) as {
    scrollBody?: { value: ScrollBody | undefined }
  }
  const lock = createScrollLock(
    () => config.scrollBody?.value ?? true,
    callback => void nextTick(callback),
  )
  const state = ref(initialState ?? false)
  lock.set(state.value)

  tryOnBeforeUnmount(() => lock.release())

  return computed({
    get: () => state.value,
    set: value => {
      state.value = value
      lock.set(value)
    },
  })
}
