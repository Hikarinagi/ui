'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type ImageVariant = 'image' | 'preview'

export type ImageResolver = (src: string, variant: ImageVariant) => string

const identity: ImageResolver = (src: string) => src

const ImageResolverContext = createContext<ImageResolver>(identity)

export interface ImageResolverProviderProps {
  resolver: ImageResolver
  children?: ReactNode
}

export function ImageResolverProvider({ resolver, children }: ImageResolverProviderProps) {
  return <ImageResolverContext value={resolver}>{children}</ImageResolverContext>
}

export function useImageResolver(): ImageResolver {
  return useContext(ImageResolverContext)
}
