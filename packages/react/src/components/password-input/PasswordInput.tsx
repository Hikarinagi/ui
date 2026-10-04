'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { InputBase, type InputBaseProps } from '../input/InputBase'
import { InputAction } from '../input/InputAction'

const EyeIcon = lucide(Eye)
const EyeOffIcon = lucide(EyeOff)

export interface PasswordInputProps extends Omit<
  InputBaseProps,
  'clearable' | 'loading' | 'onClear' | 'leading' | 'trailing' | 'action'
> {
  visible?: boolean
  defaultVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
}

export function PasswordInput({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  disabled,
  className,
  ...props
}: PasswordInputProps) {
  const t = useUiLocale()
  const [visible, setVisible] = useControllableState({
    prop: visibleProp,
    defaultProp: defaultVisible,
    onChange: onVisibleChange,
    caller: 'PasswordInput',
  })

  return (
    <InputBase
      {...props}
      type={visible ? 'text' : 'password'}
      disabled={disabled}
      className={cn('[&_input::-ms-reveal]:hidden', className)}
      action={
        <InputAction
          label={visible ? t.passwordInput.hide : t.passwordInput.show}
          disabled={disabled}
          onClick={() => setVisible(!visible)}
        >
          <span className="relative inline-flex">
            <Transition
              show={visible}
              enterActiveClass="hn-transition-base"
              enterFromClass="scale-90 opacity-0"
              leaveActiveClass="hn-transition absolute"
              leaveToClass="scale-90 opacity-0"
            >
              <EyeOffIcon />
            </Transition>
            <Transition
              show={!visible}
              enterActiveClass="hn-transition-base"
              enterFromClass="scale-90 opacity-0"
              leaveActiveClass="hn-transition absolute"
              leaveToClass="scale-90 opacity-0"
            >
              <EyeIcon />
            </Transition>
          </span>
        </InputAction>
      }
    />
  )
}
