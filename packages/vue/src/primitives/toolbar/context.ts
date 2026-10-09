import type { Ref } from 'vue'
import type { Orientation } from '../../../../shared/src/primitives/roving-focus'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface ToolbarRootContext {
  orientation: Ref<Orientation>
  dir: Ref<Direction>
}

export const [injectToolbarRootContext, provideToolbarRootContext] =
  createContext<ToolbarRootContext>('ToolbarRoot')
