import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { Slot } from './Slot'

export type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string)

export interface PrimitiveProps {
  asChild?: boolean
  as?: AsTag | Component
}

const SELF_CLOSING_TAGS = ['area', 'img', 'input']

export const Primitive = defineComponent({
  name: 'Primitive',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
    as: { type: [String, Object] as PropType<AsTag | Component>, default: 'div' },
  },
  setup(props, { attrs, slots }) {
    const tag = props.asChild ? 'template' : props.as
    if (typeof tag === 'string' && SELF_CLOSING_TAGS.includes(tag)) return () => h(tag, attrs)
    if (tag !== 'template') return () => h(props.as, attrs, { default: slots.default })
    return () => h(Slot, attrs, { default: slots.default })
  },
})
