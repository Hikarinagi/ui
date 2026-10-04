import type { ComputedRef, Ref } from 'vue'
import type {
  SliderOrientation,
  SliderThumbAlignment,
} from '../../../../shared/src/primitives/slider'
import { createContext } from '../utils/createContext'

export interface SliderRootContext {
  orientation: Ref<SliderOrientation>
  disabled: Ref<boolean>
  min: Ref<number>
  max: Ref<number>
  modelValue?: Readonly<Ref<number[] | null | undefined>>
  currentModelValue: ComputedRef<number[]>
  valueIndexToChangeRef: Ref<number>
  thumbElements: Ref<HTMLElement[]>
  thumbAlignment: Ref<SliderThumbAlignment>
}

export const [injectSliderRootContext, provideSliderRootContext] =
  createContext<SliderRootContext>('SliderRoot')

export interface SliderOrientationContext {
  startEdge: ComputedRef<'left' | 'right' | 'bottom' | 'top'>
  endEdge: ComputedRef<'left' | 'right' | 'bottom' | 'top'>
  size: 'width' | 'height'
  direction: ComputedRef<1 | -1>
}

export const [injectSliderOrientationContext, provideSliderOrientationContext] =
  createContext<SliderOrientationContext>(['SliderVertical', 'SliderHorizontal'])
