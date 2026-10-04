'use client'

import { useImperativeHandle, useRef } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useUiLocale } from '../../locale'
import { Empty } from '../empty/Empty'
import { LoadingOverlay } from '../loading-overlay/LoadingOverlay'
import { DataListPagination } from './DataListPagination'
import { DataListLayoutToggle } from './DataListLayoutToggle'
import { DataListContent } from './DataListContent'
import { DataListItem } from './DataListItem'
import { useDataList } from './hooks/useDataList'
import { useDataListBody } from './hooks/useDataListBody'
import {
  dataList,
  dataListHeader,
  dataListBody,
  dataListStatus,
  dataListFooter,
  dataListPager,
  dataListAnnouncement,
  dataListLoading,
} from './data-list.variants'
import type {
  DataListExpose,
  DataListItemSlot,
  DataListLayout,
  DataListProps,
  DataListState,
} from './types'

export function DataList<T>(props: DataListProps<T>) {
  const {
    items,
    itemKey,
    itemTitle,
    itemDescription,
    mediaRatio,
    layoutToggle,
    gridMin = '14rem',
    gridGap,
    size = 'md',
    divided = true,
    pagination,
    manual,
    total,
    hasNextPage,
    loading,
    placeholderCount,
    emptyText,
    label,
    virtualize,
    height,
    minHeight = 160,
    className,
    bodyClass,
    contentClass,
    itemClass,
    layout: layoutProp,
    defaultLayout = 'list',
    onLayoutChange,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    pageSize: pageSizeProp,
    defaultPageSize = 10,
    onPageSizeChange,
    onPaginationChange,
    onRangeChange,
    children,
    renderMedia,
    renderTitle,
    renderDescription,
    renderMeta,
    renderActions,
    renderPlaceholder,
    renderHeader,
    renderFooter,
    renderPagination,
    renderEmpty,
    renderLoading,
    ref,
    ...attrs
  } = props
  const options = {
    items,
    itemKey,
    itemTitle,
    itemDescription,
    mediaRatio,
    layoutToggle,
    gridMin,
    gridGap,
    size,
    divided,
    pagination,
    manual,
    total,
    hasNextPage,
    loading,
    placeholderCount,
    emptyText,
    label,
    virtualize,
    height,
    minHeight,
    className,
    bodyClass,
    contentClass,
    itemClass,
  }
  const [layout = 'list', setLayout] = useControllableState<DataListLayout>({
    prop: layoutProp,
    defaultProp: defaultLayout,
    onChange: onLayoutChange,
    caller: 'DataList',
  })
  const [page = 1, setPage] = useControllableState<number>({
    prop: pageProp,
    defaultProp: defaultPage,
    onChange: onPageChange,
    caller: 'DataList',
  })
  const [pageSize = 10, setPageSize] = useControllableState<number>({
    prop: pageSizeProp,
    defaultProp: defaultPageSize,
    onChange: onPageSizeChange,
    caller: 'DataList',
  })
  const t = useUiLocale()
  const {
    entries,
    state,
    itemClass: classOf,
    placeholderCount: placeholders,
    showPagination,
    formatItem,
  } = useDataList(
    options,
    [page, setPage],
    [pageSize, setPageSize],
    value => onPaginationChange?.(value),
    [layout, setLayout],
  )
  const { body, style } = useDataListBody(options)
  const content = useRef<DataListExpose>(null)
  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return content.current?.viewport
      },
      scrollToIndex: (...args: Parameters<DataListExpose['scrollToIndex']>) =>
        content.current?.scrollToIndex(...args),
    }),
    [],
  )

  const renderItem = (entry: DataListItemSlot<T>) => {
    const custom = children?.(entry)
    if (hasContent(custom)) return custom
    return (
      <DataListItem
        {...formatItem(entry)}
        layout={layout}
        mediaRatio={mediaRatio}
        renderMedia={renderMedia && (() => renderMedia(entry))}
        renderTitle={renderTitle && (() => renderTitle(entry))}
        renderDescription={renderDescription && (() => renderDescription(entry))}
        renderMeta={renderMeta && (() => renderMeta(entry))}
        renderActions={renderActions && (() => renderActions(entry))}
      />
    )
  }
  const renderSkeleton = (placeholder: { index: number; layout: DataListLayout }) => {
    const custom = renderPlaceholder?.(placeholder)
    if (hasContent(custom)) return custom
    return (
      <DataListItem
        layout={layout}
        placeholder
        titlePlaceholder={!!(itemTitle || renderTitle || children)}
        descriptionPlaceholder={!!(itemDescription || renderDescription)}
        mediaRatio={mediaRatio}
        media={!!renderMedia}
        meta={!!renderMeta}
        actions={!!renderActions}
      />
    )
  }
  const slotState = state as DataListState<T>
  const empty = renderEmpty?.(slotState)
  const pager = renderPagination?.(slotState)
  const pagerShown = showPagination || (!!pagination && !!renderPagination)

  return (
    <div
      data-hn-data-list=""
      data-layout={layout}
      aria-busy={loading || undefined}
      className={cn(dataList(), className)}
      {...attrs}
    >
      {(renderHeader || layoutToggle) && (
        <div className={dataListHeader()}>
          {renderHeader?.(slotState)}
          {layoutToggle && (
            <DataListLayoutToggle value={layout} onValueChange={setLayout} className="ms-auto" />
          )}
        </div>
      )}
      <div ref={body} className={cn(dataListBody(), bodyClass)} style={style}>
        {loading && !entries.length && !renderLoading && (
          <span role="status" className={dataListAnnouncement()}>
            {t.common.loading}
          </span>
        )}
        {entries.length || (loading && !renderLoading) ? (
          <DataListContent<T>
            ref={content}
            options={options}
            entries={entries}
            layout={layout}
            structured={!children}
            placeholderCount={placeholders}
            itemClass={classOf}
            onRangeChange={range => onRangeChange?.(range)}
            renderItem={renderItem}
            renderPlaceholder={renderSkeleton}
          />
        ) : (
          <div role="status" className={dataListStatus()}>
            {loading ? (
              renderLoading?.(slotState)
            ) : hasContent(empty) ? (
              empty
            ) : (
              <Empty title={emptyText ?? t.dataList.empty} icon={false} size="sm" />
            )}
          </div>
        )}
        {entries.length > 0 && (
          <LoadingOverlay
            visible={loading}
            text={t.common.loading}
            minVisible={0}
            size="sm"
            className={dataListLoading()}
          >
            {renderLoading?.(slotState)}
          </LoadingOverlay>
        )}
      </div>
      {(renderFooter || pagerShown) && (
        <div className={dataListFooter()}>
          {renderFooter?.(slotState)}
          {pagerShown && (
            <div className={dataListPager()}>
              {hasContent(pager) ? (
                pager
              ) : (
                <DataListPagination state={state as DataListState<unknown>} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
