import type { ReactNode } from 'react'
import { Skeleton } from '../skeleton/Skeleton'
import {
  dataListAnatomy,
  dataListMedia,
  dataListDetails,
  dataListCopy,
  dataListTitle,
  dataListDescription,
  dataListMeta,
  dataListActions,
  dataListPlaceholder,
} from './data-list.variants'
import type { DataListLayout } from './types'

export interface DataListItemProps {
  layout: DataListLayout
  title?: string | number
  description?: string | number
  mediaRatio?: number
  placeholder?: boolean
  titlePlaceholder?: boolean
  descriptionPlaceholder?: boolean
  media?: boolean
  meta?: boolean
  actions?: boolean
  renderMedia?: () => ReactNode
  renderTitle?: () => ReactNode
  renderDescription?: () => ReactNode
  renderMeta?: () => ReactNode
  renderActions?: () => ReactNode
}

export function DataListItem({
  layout,
  title,
  description,
  mediaRatio,
  placeholder,
  titlePlaceholder,
  descriptionPlaceholder,
  media,
  meta,
  actions,
  renderMedia,
  renderTitle,
  renderDescription,
  renderMeta,
  renderActions,
}: DataListItemProps) {
  return (
    <div className={dataListAnatomy({ layout })}>
      {(media || renderMedia) && (
        <div
          className={dataListMedia({ layout })}
          style={mediaRatio ? { aspectRatio: mediaRatio } : undefined}
        >
          {placeholder ? (
            <Skeleton className={dataListPlaceholder({ part: 'media' })} />
          ) : (
            renderMedia?.()
          )}
        </div>
      )}
      <div className={dataListDetails({ layout })}>
        <div className={dataListCopy()}>
          {(titlePlaceholder || renderTitle || title !== undefined) && (
            <div className={dataListTitle()}>
              {placeholder ? (
                <Skeleton className={dataListPlaceholder({ part: 'title' })} />
              ) : renderTitle ? (
                renderTitle()
              ) : (
                title
              )}
            </div>
          )}
          {(descriptionPlaceholder || renderDescription || description !== undefined) && (
            <div className={dataListDescription()}>
              {placeholder ? (
                <Skeleton className={dataListPlaceholder({ part: 'description' })} />
              ) : renderDescription ? (
                renderDescription()
              ) : (
                description
              )}
            </div>
          )}
          {(meta || renderMeta) && (
            <div className={dataListMeta()}>
              {placeholder ? (
                <Skeleton className={dataListPlaceholder({ part: 'meta' })} />
              ) : (
                renderMeta?.()
              )}
            </div>
          )}
        </div>
        {(actions || renderActions) && (
          <div className={dataListActions({ layout })}>
            {placeholder ? (
              <Skeleton className={dataListPlaceholder({ part: 'action' })} />
            ) : (
              renderActions?.()
            )}
          </div>
        )}
      </div>
    </div>
  )
}
