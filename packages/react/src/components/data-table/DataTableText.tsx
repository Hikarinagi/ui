'use client'

import { useState } from 'react'
import { TooltipTarget } from '../float-button/TooltipTarget'
import { useTableText } from './hooks/useTableText'

export interface DataTableTextProps {
  value: string | number
  truncate?: boolean
}

function TruncatedText({ value }: { value: string | number }) {
  const [element, setElement] = useState<HTMLSpanElement | null>(null)
  const { overflow, tooltip } = useTableText(element, value)
  return (
    <>
      <span ref={setElement} className="block truncate" tabIndex={overflow ? 0 : undefined}>
        {value}
      </span>
      <TooltipTarget target={element} options={{ content: tooltip || '' }} />
    </>
  )
}

export function DataTableText({ value, truncate }: DataTableTextProps) {
  return truncate ? <TruncatedText value={value} /> : <>{value}</>
}
