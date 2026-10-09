'use client'

import { useId, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react'
import { Check } from 'lucide-react'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  type PopoverTriggerProps,
} from '../../primitives/popover'
import { TreeItem, TreeRoot } from '../../primitives/tree'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { radixPopoverStyle } from '../../lib/radix/styles'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { Card } from '../card/Card'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import {
  inputAdornment,
  inputEmbedded,
  inputHost,
  type InputVariants,
} from '../input/input.variants'
import { TreeRows } from '../tree/TreeRows'
import { selectEmpty, selectTrigger } from '../select/select.variants'
import {
  treeSelectContent,
  treeSelectList,
  treeSelectRow,
  treeSelectToggle,
} from './tree-select.variants'
import type { TreeSelectNode } from './types'
import { TreeSelectSearch } from './TreeSelectSearch'
import { useTreeSelect, type TreeSelectValue } from './hooks/useTreeSelect'
import { useControllableState } from '../../primitives/utils/controllable-state'

const CheckIcon = lucide(Check)

export type { TreeSelectValue } from './hooks/useTreeSelect'

export interface TreeSelectProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'disabled' | 'children'
> {
  items: TreeSelectNode[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  defaultExpanded?: Array<string | number>
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  virtualize?: VirtualizeOptions
  value?: TreeSelectValue
  defaultValue?: TreeSelectValue
  onValueChange?: (value: TreeSelectValue) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  search?: string
  defaultSearch?: string
  onSearchChange?: (search: string) => void
  renderNode?: (props: { node: TreeSelectNode }) => ReactNode
  ref?: Ref<HTMLButtonElement>
  [attribute: `data-${string}`]: string | undefined
}

export function TreeSelect({
  items: itemsProp,
  placeholder,
  searchable,
  searchPlaceholder,
  defaultExpanded = [],
  variant,
  size,
  disabled: disabledProp,
  invalid: invalidProp,
  virtualize,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  search: searchProp,
  defaultSearch = '',
  onSearchChange,
  renderNode,
  className,
  ...attrs
}: TreeSelectProps) {
  const [model, setModel] = useControllableState<TreeSelectValue>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'TreeSelect',
  })
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'TreeSelect',
  })
  const [search = '', setSearch] = useControllableState<string>({
    prop: searchProp,
    defaultProp: defaultSearch,
    onChange: onSearchChange,
    caller: 'TreeSelect',
  })
  const treeId = useId()
  const triggerId = useId()
  const t = useUiLocale()
  const group = useInputGroup()
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
    labelledBy,
  } = useFieldControl(
    {
      invalid: invalidProp || !!group?.invalid,
      disabled: disabledProp || !!group?.disabled,
    },
    attrs,
  )
  const {
    selected,
    items,
    expanded,
    setExpanded,
    input,
    tree,
    rows,
    getChildren,
    key,
    choose,
    keepRowClick,
    focusSearch,
    clearSearch,
    onEscape,
    onSearchKeydown,
    onTreeKeydown,
  } = useTreeSelect(
    { items: itemsProp, defaultExpanded, searchable, virtualize },
    model,
    setModel,
    open,
    setOpen,
    search,
    setSearch,
  )
  const ariaLabel = attrs['aria-label']

  return (
    <PopoverRoot open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        {...(attrs as PopoverTriggerProps)}
        id={fieldId ?? triggerId}
        aria-describedby={describedBy}
        data-hn-tree-select=""
        role="combobox"
        aria-expanded={open}
        {...{ disabled }}
        data-placeholder={selected ? undefined : ''}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          group ? inputEmbedded() : inputHost({ variant, size }),
          selectTrigger(),
          className,
        )}
      >
        <span className="min-w-0 flex-1 truncate">
          {selected ? selected.label : (placeholder ?? t.select.placeholder)}
        </span>
        <span className={inputAdornment()}>
          <DisclosureIcon />
        </span>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          asChild
          align="start"
          sideOffset={8}
          onOpenAutoFocus={focusSearch}
          onEscapeKeyDown={onEscape}
        >
          <Card
            padded={false}
            data-hn-tree-select-content=""
            aria-label={ariaLabel}
            aria-labelledby={labelledBy ?? (ariaLabel ? undefined : (fieldId ?? triggerId))}
            className={treeSelectContent()}
            style={radixPopoverStyle}
          >
            {searchable && (
              <TreeSelectSearch
                ref={input}
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder ?? t.treeSelect.search}
                controls={treeId}
                onClear={clearSearch}
                onKeyDown={onSearchKeydown}
              />
            )}
            <TreeRoot<TreeSelectNode>
              as="div"
              id={treeId}
              ref={tree}
              expanded={expanded}
              onExpandedChange={setExpanded}
              items={items}
              getKey={key}
              getChildren={getChildren}
              value={selected}
              aria-label={ariaLabel}
              aria-labelledby={labelledBy}
              className="flex flex-col p-1 outline-none"
              onValueChange={choose}
              onKeyDownCapture={onTreeKeydown}
            >
              {({ flattenItems }) => (
                <TreeRows<TreeSelectNode>
                  ref={rows}
                  items={flattenItems}
                  virtualize={virtualize}
                  initialScrollToSelected
                  scrollable
                  className={treeSelectList()}
                  empty={
                    <div role="none" className={selectEmpty()}>
                      <span role="status">{t.select.empty}</span>
                    </div>
                  }
                >
                  {({ item }) => (
                    <TreeItem<TreeSelectNode>
                      as="div"
                      {...item.bind}
                      value={item.value}
                      level={item.level}
                      disabled={item.value.disabled}
                      className={treeSelectRow()}
                      style={{
                        paddingInlineStart: `calc(0.375rem + ${(item.level - 1) * 1.25}rem)`,
                      }}
                      onToggle={keepRowClick}
                    >
                      {({ isExpanded, isSelected, handleToggle }) => {
                        const custom = renderNode?.({ node: item.value })
                        return (
                          <>
                            {item.hasChildren ? (
                              <span
                                className={treeSelectToggle()}
                                onClick={event => {
                                  event.stopPropagation()
                                  handleToggle()
                                }}
                              >
                                <DisclosureIcon direction="end" open={isExpanded} />
                              </span>
                            ) : (
                              <span className="size-5 shrink-0" />
                            )}
                            <span className="min-w-0 flex-1">
                              {hasContent(custom) ? (
                                custom
                              ) : (
                                <>
                                  <span className="block truncate">{item.value.label}</span>
                                  {item.value.description && (
                                    <span className="text-muted block truncate text-xs">
                                      {item.value.description}
                                    </span>
                                  )}
                                </>
                              )}
                            </span>
                            <span className="flex size-4 shrink-0 items-center justify-center">
                              {isSelected && <CheckIcon />}
                            </span>
                          </>
                        )
                      }}
                    </TreeItem>
                  )}
                </TreeRows>
              )}
            </TreeRoot>
          </Card>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}
