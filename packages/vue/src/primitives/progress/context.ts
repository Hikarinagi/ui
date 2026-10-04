import type { ComputedRef, Ref } from 'vue'
import type { ProgressState } from '../../../../shared/src/primitives/progress'
import { createContext } from '../utils/createContext'

export interface ProgressRootContext {
  modelValue?: Readonly<Ref<number | null | undefined>>
  max: Readonly<Ref<number>>
  progressState: ComputedRef<ProgressState>
}

export const [injectProgressRootContext, provideProgressRootContext] =
  createContext<ProgressRootContext>('ProgressRoot')
