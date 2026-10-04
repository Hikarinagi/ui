'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { Button } from '@hina-ui/react'

type LinkButtonProps = Omit<ComponentProps<typeof Button>, 'as' | 'asChild'> & { href: string }

export function LinkButton(props: LinkButtonProps) {
  return <Button as={NextLink} {...props} />
}
