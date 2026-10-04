'use client'

import type { CSSProperties } from 'react'
import { DialogPortal } from '../../primitives/dialog'
import type { DataTableDragging } from './hooks/useTableDrag'
import type { DataTableResizeGuide } from './hooks/useTableResize'

export interface DataTableDragPreviewProps {
  dragging: DataTableDragging | undefined
  guide: DataTableResizeGuide | undefined
}

export function DataTableDragPreview({ dragging, guide }: DataTableDragPreviewProps) {
  return (
    <DialogPortal>
      {guide && (
        <div
          className="hn-table-drop-line"
          aria-hidden="true"
          data-hn-resize-guide=""
          style={{
            left: `${guide.x}px`,
            top: `${guide.y}px`,
            height: `${guide.height}px`,
            width: '2px',
          }}
        />
      )}
      {guide && (
        <div
          className="hn-table-resize-label"
          data-hn-resize-label=""
          aria-hidden="true"
          style={{
            left: `${guide.labelX}px`,
            top: `${Math.max(4, guide.y - 12 - guide.columns.length * 18)}px`,
          }}
        >
          {guide.columns.map(column => (
            <div key={column.key}>
              <span>{column.label}</span>
              <span>{column.width}px</span>
            </div>
          ))}
        </div>
      )}
      {dragging && (
        <>
          {dragging.marker && (
            <div
              className="hn-table-drop-line"
              aria-hidden="true"
              data-hn-drop-line=""
              style={{
                left: `${dragging.marker.x}px`,
                top: `${dragging.marker.y}px`,
                width: `${dragging.marker.width}px`,
                height: `${dragging.marker.height}px`,
              }}
            />
          )}
          <div
            className="hn-table-drag-preview"
            aria-hidden="true"
            data-hn-drag-preview=""
            style={
              {
                ...dragging.appearance,
                left: `${dragging.x - dragging.offsetX}px`,
                top: `${dragging.y - dragging.offsetY}px`,
                width: dragging.kind === 'column' ? `${dragging.width}px` : undefined,
              } as CSSProperties
            }
          >
            <div className="hn-table-drag-label">{dragging.label}</div>
            {dragging.samples.map((sample, index) => (
              <div key={index} className="hn-table-drag-cell">
                {sample}
              </div>
            ))}
          </div>
        </>
      )}
    </DialogPortal>
  )
}
