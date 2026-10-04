'use client'

import NextLink from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem as={NextLink} href="/en/components/button">
        Button
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem as={NextLink} href="/en/components/tag">
        Tag
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
    </Breadcrumb>
  )
}
