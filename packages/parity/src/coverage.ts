export const RENAMED: Record<string, string> = {
  provideUiLocale: 'UiLocaleProvider',
  provideImageResolver: 'ImageResolverProvider',
}

export const EXCEPTIONS: Record<string, string> = {
  vTooltip: 'Vue directive; React wraps the element in Tooltip instead',
}

export const REACT_ONLY: Record<string, string> = {
  ConfigProvider:
    'Vue users configure dir, teleportTo and scrollBody with reka-ui ConfigProvider; React users cannot import Reka, so the package provides the equivalent',
  useConfig: 'Reader for ConfigProvider, the counterpart of reka-ui injectConfigProviderContext',
}
