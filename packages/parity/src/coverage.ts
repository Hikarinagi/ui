export const RENAMED: Record<string, string> = {
  provideUiLocale: 'UiLocaleProvider',
  provideImageResolver: 'ImageResolverProvider',
}

export const EXCEPTIONS: Record<string, string> = {
  vTooltip: 'Vue directive; React wraps the element in Tooltip instead',
}

export const REACT_ONLY: Record<string, string> = {
  useFormHandle:
    'Vue reads reactive form state from the Form template ref; a React ref is not reactive, so a hook returns the state and is passed to Form through the form prop',
}
