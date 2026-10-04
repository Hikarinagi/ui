'use client'

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { TreeItem, TreeRoot } from '../../primitives/tree'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { useFieldControl } from '../form-field/context'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { TreeCheck } from './TreeCheck'
import { TreeRows } from './TreeRows'
import { useTree, type TreeModel } from './hooks/useTree'
import { tree, treeEmpty, treeRow, treeToggle } from './tree.variants'
import type { TreeNode, TreeNodeSlot, TreeValue } from './types'

export interface TreeProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'dir'
> {
  items: TreeNode[]
  dir?: 'ltr' | 'rtl'
  multiple?: boolean
  defaultExpanded?: TreeValue[]
  disabled?: boolean
  invalid?: boolean
  virtualize?: VirtualizeOptions
  maxHeight?: string | number
  value?: TreeModel
  defaultValue?: TreeModel
  onValueChange?: (value: TreeModel) => void
  expanded?: TreeValue[]
  onExpandedChange?: (value: TreeValue[]) => void
  renderNode?: (props: TreeNodeSlot) => ReactNode
  renderTrailing?: (props: TreeNodeSlot) => ReactNode
  empty?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Tree({
  items,
  multiple,
  defaultExpanded = [],
  disabled: disabledProp,
  invalid: invalidProp,
  virtualize,
  maxHeight = 320,
  value,
  defaultValue,
  onValueChange,
  expanded: expandedProp,
  onExpandedChange,
  renderNode,
  renderTrailing,
  empty,
  className,
  ref,
  ...attrs
}: TreeProps) {
  const t = useUiLocale()
  const { id, labelledBy, describedBy, disabled, invalid } = useFieldControl(
    { disabled: disabledProp, invalid: invalidProp },
    attrs,
  )
  const { selected, expanded, setExpanded, key, getChildren, state, select, toggle, keepRowClick } =
    useTree({
      items,
      multiple,
      defaultExpanded,
      value,
      defaultValue,
      onValueChange,
      expanded: expandedProp,
      onExpandedChange,
      disabled,
    })

  if (items.length === 0)
    return (
      <div
        {...attrs}
        ref={ref as Ref<HTMLDivElement>}
        id={id}
        role="status"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        data-hn-tree=""
        className={cn(treeEmpty(), className)}
      >
        {hasContent(empty) ? empty : t.tree.empty}
      </div>
    )

  return (
    <TreeRoot<TreeNode>
      {...attrs}
      ref={ref}
      id={id}
      expanded={expanded}
      onExpandedChange={setExpanded}
      items={items}
      as={virtualize ? 'div' : 'ul'}
      getKey={key}
      getChildren={getChildren}
      value={multiple ? selected : selected[0]}
      multiple={multiple}
      disabled={disabled}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      data-hn-tree=""
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      className={cn(tree(), className)}
    >
      {({ flattenItems }) => (
        <TreeRows<TreeNode>
          items={flattenItems}
          virtualize={virtualize}
          maxHeight={virtualize ? maxHeight : undefined}
          disabled={node => state(node).disabled}
        >
          {({ item }) => {
            const current = state(item.value)
            return (
              <TreeItem<TreeNode>
                {...item.bind}
                disabled={current.disabled}
                asChild
                onSelect={select}
                onToggle={keepRowClick}
              >
                {({ isExpanded }) => {
                  const slot: TreeNodeSlot = { node: item.value, expanded: isExpanded, ...current }
                  const custom = renderNode?.(slot)
                  const Tag = virtualize ? 'div' : 'li'
                  return (
                    <Tag
                      aria-selected={multiple ? undefined : current.selected}
                      aria-checked={
                        multiple ? (current.indeterminate ? 'mixed' : current.selected) : undefined
                      }
                      style={{ '--hn-tree-level': item.level - 1 } as CSSProperties}
                      className={treeRow()}
                    >
                      {item.hasChildren ? (
                        <span
                          className={treeToggle()}
                          aria-hidden="true"
                          data-hn-tree-toggle=""
                          onClick={event => {
                            event.stopPropagation()
                            toggle(item.value)
                          }}
                        >
                          <DisclosureIcon direction="end" open={isExpanded} />
                        </span>
                      ) : (
                        <span className="size-5 shrink-0" aria-hidden="true" />
                      )}
                      {multiple && (
                        <TreeCheck
                          selected={current.selected}
                          indeterminate={current.indeterminate}
                        />
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
                      {renderTrailing?.(slot)}
                    </Tag>
                  )
                }}
              </TreeItem>
            )
          }}
        </TreeRows>
      )}
    </TreeRoot>
  )
}
