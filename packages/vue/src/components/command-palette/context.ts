import {
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
  type Ref,
  type ShallowRef,
} from 'vue'

export interface CommandPaletteContext {
  search: Ref<string>
  label: ComputedRef<string>
  placeholder: ComputedRef<string>
  autoFocus: ComputedRef<boolean | undefined>
  input: ShallowRef<HTMLElement | undefined>
}

const COMMAND_PALETTE_KEY = Symbol('hn-command-palette') as InjectionKey<CommandPaletteContext>

export function provideCommandPalette(context: CommandPaletteContext) {
  provide(COMMAND_PALETTE_KEY, context)
}

export function injectCommandPalette() {
  const context = inject(COMMAND_PALETTE_KEY, null)
  if (!context) throw new Error('CommandPaletteInput must be used inside CommandPalette')
  return context
}
