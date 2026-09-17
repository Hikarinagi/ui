import type { CSSProperties } from 'vue'

export const rekaSelectStyle = {
  '--hn-overlay-anchor-width': 'var(--reka-select-trigger-width)',
  '--hn-overlay-available-height': 'var(--reka-select-content-available-height)',
} satisfies CSSProperties

export const rekaComboboxStyle = {
  '--hn-overlay-anchor-width': 'var(--reka-combobox-trigger-width)',
  '--hn-overlay-available-height': 'var(--reka-combobox-content-available-height)',
} satisfies CSSProperties

export const rekaPopoverStyle = {
  '--hn-overlay-anchor-width': 'var(--reka-popover-trigger-width)',
  '--hn-overlay-available-height': 'var(--reka-popover-content-available-height)',
} satisfies CSSProperties

export const rekaAccordionStyle = {
  '--hn-collapse-h': 'var(--reka-accordion-content-height)',
} satisfies CSSProperties

export const rekaCollapsibleStyle = {
  '--hn-collapse-h': 'var(--reka-collapsible-content-height)',
} satisfies CSSProperties

export const rekaRatingStepStyle = {
  '--hn-rating-step-width': 'var(--reka-rating-item-step-width)',
  '--hn-rating-step-opacity': 'var(--reka-rating-item-step-opacity)',
  '--hn-rating-step-z-index': 'var(--reka-rating-item-step-z-index)',
} satisfies CSSProperties

export const rekaSliderThumbStyle = {
  '--reka-slider-thumb-transform': 'var(--hn-slider-thumb-transform)',
} satisfies CSSProperties

export const rekaToastStyle = {
  '--hn-toast-swipe-end-x': 'var(--reka-toast-swipe-end-x)',
  '--hn-toast-swipe-move-x': 'var(--reka-toast-swipe-move-x)',
} satisfies CSSProperties

export const rekaNavigationViewportStyle = {
  '--hn-navigation-width': 'var(--reka-navigation-menu-viewport-width)',
  '--hn-navigation-height': 'var(--reka-navigation-menu-viewport-height)',
  '--hn-navigation-left': 'var(--reka-navigation-menu-viewport-left)',
  '--hn-navigation-top': 'var(--reka-navigation-menu-viewport-top)',
} satisfies CSSProperties
