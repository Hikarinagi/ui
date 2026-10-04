import type { ComponentType } from 'react'
import type { PlaygroundProps } from '~/components/Playground'

export type DemoMap = Record<string, ComponentType>

export type PlaygroundMap = Record<string, ComponentType<PlaygroundProps>>

export interface PageModules {
  demos: DemoMap
  playgrounds: PlaygroundMap
}
