import type { UiMessages } from './types'

export const enUS: UiMessages = {
  tag: 'en-US',
  common: {
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied',
    clear: 'Clear',
    loading: 'Loading',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  pagination: {
    navLabel: 'Pagination',
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
  toast: {
    regionLabel: 'Notifications',
  },
  spoiler: {
    revealLabel: 'Spoiler, click to reveal',
    hideLabel: 'Hide spoiler',
  },
  codeblock: {
    copy: 'Copy code',
  },
  splitter: {
    handleLabel: 'Resize panel',
  },
  sidebar: {
    navLabel: 'Sidebar navigation',
    toggleLabel: 'Toggle sidebar',
  },
  anchor: {
    navLabel: 'On this page',
  },
  breadcrumb: {
    navLabel: 'Breadcrumb',
  },
  lightbox: {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetZoom: 'Reset zoom',
    rotate: 'Rotate',
    download: 'Download',
    loadingLarge: 'Loading HD',
  },
  chip: {
    remove: 'Remove',
  },
  numberInput: {
    increase: 'Increase',
    decrease: 'Decrease',
  },
  passwordInput: {
    show: 'Show password',
    hide: 'Hide password',
  },
  combobox: {
    placeholder: 'Type or choose',
    toggle: 'Show options',
  },
  slider: {
    minimum: 'Minimum',
    maximum: 'Maximum',
  },
  pinInput: {
    cellLabel: (index, total) => `Digit ${index} of ${total}`,
  },
  dateField: {
    year: 'Year',
    month: 'Month',
    day: 'Day',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    dayPeriod: 'AM or PM',
  },
  dateRangeField: {
    start: 'start date',
    end: 'end date',
    separator: '–',
  },
  datePicker: {
    open: 'Open calendar',
  },
  dateTimePicker: {
    time: 'Time',
  },
  calendar: {
    label: 'Calendar',
    prev: 'Previous month',
    next: 'Next month',
    prevYear: 'Previous year',
    nextYear: 'Next year',
    prevYears: 'Previous twelve years',
    nextYears: 'Next twelve years',
    pickMonth: 'Choose a month',
    pickYear: 'Choose a year',
    weekStartsOn: 0,
  },
}
