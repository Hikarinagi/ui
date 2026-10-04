import clsx from 'clsx'
import type { LucideIcon, LucideProps } from 'lucide-react'

function kebab(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export type IconComponent = (props: LucideProps) => React.JSX.Element

export function lucide(Icon: LucideIcon): IconComponent {
  const iconClass = `lucide-${kebab(Icon.displayName ?? '')}-icon`
  return function HinaIcon({ className, ...props }: LucideProps) {
    return <Icon aria-hidden={undefined} {...props} className={clsx(iconClass, className)} />
  }
}
