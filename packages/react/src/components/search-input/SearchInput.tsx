'use client'

import type { KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { InputBase, type InputBaseProps } from '../input/InputBase'

const SearchIcon = lucide(Search)

export interface SearchInputProps extends Omit<InputBaseProps, 'leading' | 'trailing' | 'action'> {
  onSearch?: (value: string) => void
}

export function SearchInput({
  clearable = true,
  value,
  defaultValue = '',
  onValueChange,
  onSearch,
  onClear,
  onKeyDown,
  className,
  ...props
}: SearchInputProps) {
  const [model, setModel] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'SearchInput',
  })

  function onKeys(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event)
    if (event.key === 'Enter') onSearch?.(model)
    if (event.key === 'Escape') {
      if (!model) return
      event.preventDefault()
      setModel('')
      onClear?.()
    }
  }

  return (
    <InputBase
      type="search"
      enterKeyHint="search"
      {...props}
      value={model}
      onValueChange={setModel}
      clearable={clearable}
      className={cn(
        '[&_input]:appearance-none [&_input::-webkit-search-cancel-button]:appearance-none [&_input::-webkit-search-decoration]:appearance-none',
        className,
      )}
      onKeyDown={onKeys}
      onClear={onClear}
      leading={<SearchIcon />}
    />
  )
}
