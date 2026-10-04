'use client'

import { useImperativeHandle, type KeyboardEvent, type Ref } from 'react'
import { Search, X } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { InputAction } from '../input/InputAction'
import { useModelText } from '../input/hooks/useModelText'
import { inputAdornment, inputControl, textInputHost } from '../input/input.variants'

const SearchIcon = lucide(Search)
const XIcon = lucide(X)

export interface TreeSelectSearchHandle {
  focus: () => void
}

export interface TreeSelectSearchProps {
  placeholder: string
  controls: string
  value: string
  onValueChange: (value: string) => void
  onClear: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  ref?: Ref<TreeSelectSearchHandle>
}

export function TreeSelectSearch({
  placeholder,
  controls,
  value,
  onValueChange,
  onClear,
  onKeyDown,
  ref,
}: TreeSelectSearchProps) {
  const t = useUiLocale()
  const { element: input, bindings } = useModelText<HTMLInputElement>(value, onValueChange)

  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }))

  return (
    <div className="border-line shrink-0 border-b px-1">
      <div className={textInputHost({ variant: 'bare', size: 'sm' })}>
        <span className={inputAdornment()}>
          <SearchIcon />
        </span>
        <input
          ref={input}
          {...bindings}
          data-hn-tree-select-search=""
          type="text"
          role="searchbox"
          autoComplete="off"
          aria-label={placeholder}
          aria-controls={controls}
          placeholder={placeholder}
          className={inputControl({ leading: true, trailing: !!value })}
          onKeyDown={onKeyDown}
        />
        <Transition
          show={!!value}
          enterActiveClass="hn-transition-base"
          enterFromClass="scale-90 opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="scale-90 opacity-0"
        >
          <InputAction label={t.common.clear} onClick={onClear}>
            <XIcon />
          </InputAction>
        </Transition>
      </div>
    </div>
  )
}
