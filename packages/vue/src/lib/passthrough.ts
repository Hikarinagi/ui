import { defineComponent } from 'vue'

export const Passthrough = defineComponent({
  name: 'HnPassthrough',
  setup:
    (_, { slots }) =>
    () =>
      slots.default?.(),
})
