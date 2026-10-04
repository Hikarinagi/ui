import type { ReactNode } from 'react'
import { DocsRoot, rootMetadata } from '~/lib/root-layout'
import '../globals.css'

export const metadata = rootMetadata

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsRoot locale="zh-CN">{children}</DocsRoot>
}
