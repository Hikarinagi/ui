import { InputBase, type InputBaseProps } from './InputBase'

export type { InputHandle } from './InputBase'

export interface InputProps extends Omit<InputBaseProps, 'action'> {}

export function Input(props: InputProps) {
  return <InputBase {...props} />
}
