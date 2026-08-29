import type { UiMessages } from './types'

export const enUS: UiMessages = {
  tag: 'en-US',
  common: {
    close: 'Close',
    clear: 'Clear',
    loading: 'Loading',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  pagination: {
    prev: 'Previous page',
    next: 'Next page',
    first: 'First page',
    last: 'Last page',
    pageLabel: n => `Page ${n}`,
    totalLabel: n => `${n} items`,
  },
  table: {
    empty: 'No data',
    loading: 'Loading',
    sortAsc: 'Sort ascending',
    sortDesc: 'Sort descending',
    sortNone: 'Clear sorting',
    selectRow: 'Select row',
    selectAll: 'Select all',
  },
  select: {
    placeholder: 'Select',
    empty: 'No matches',
    optionCountLabel: n => `${n} options available`,
  },
  upload: {
    choose: 'Choose file',
    dropHint: 'Drop files here, or click to browse',
    tooLargeLabel: readableSize => `File exceeds the ${readableSize} limit`,
    remove: 'Remove',
  },
  time: {
    justNow: 'Just now',
    unknown: 'Unknown time',
  },
  scroll: {
    regionLabel: 'Scrollable region',
  },
  spoiler: {
    revealLabel: 'Spoiler, click to reveal',
    hideLabel: 'Hide spoiler',
  },
  codeblock: {
    copy: 'Copy code',
    copied: 'Copied',
  },
  splitter: {
    handleLabel: 'Resize panel',
  },
}
