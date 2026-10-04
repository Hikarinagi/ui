import { House } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, VisuallyHidden } from '@hina-ui/react'

export default function Demo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#" className="inline-flex items-center">
        <House className="size-4" aria-hidden="true" />
        <VisuallyHidden>Home</VisuallyHidden>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#">Galgame</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>ATRI -My Dear Moments-</BreadcrumbItem>
    </Breadcrumb>
  )
}
