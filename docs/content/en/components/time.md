---
title: Time
description: Shows a moment in the current language, optionally relative to now.
links:
  - label: Source
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/time/Time.vue
  - label: NumberFormat
    href: https://github.com/Hikarinagi/hikarinagi/blob/dev/packages/ui/src/components/number-format/NumberFormat.vue
---

<Demo name="time/hero" />

## Usage {#usage}

```ts
import { Time } from '@hina-ui/vue'
```

`value` accepts a time string, a timestamp or a `Date`. The component renders a native `time` element whose `datetime` attribute holds the ISO form, while the visible text is set in the current language.

<Demo name="time/basic" />

## Examples {#examples}

### Formats {#formats}

Four of them. `datetime` shows the date and the time of day, `date` and `time` show one each, and `relative` shows the distance from now.

<Demo name="time/formats" />

### Relative time {#relative}

Within 45 seconds it reads as “just now”; anything earlier or later steps through seconds, minutes, hours, days, weeks, months and years. The wording follows the natural phrasing of the current language.

It refreshes every 30 seconds while the page is open, with no manual update. Hovering reveals the full date and time.

<Demo name="time/relative" />

### Following the language {#locale}

The order of the date, the spelling of the month and the phrasing of relative time all follow the language provided through `provideUiLocale`.

<Demo name="time/locale" />

### Values that cannot be parsed {#invalid}

When `value` is empty or cannot be parsed, the component shows “unknown time” and renders a `span` instead, so no incorrect `datetime` is emitted. A warning is printed in development.

<Demo name="time/invalid" />

## Accessibility {#a11y}

- The `datetime` attribute is always a complete ISO timestamp, giving assistive technology the exact moment.
- Relative time changes as time passes; the full moment is kept in `title`.

## API {#api}

### Props {#props}

| Prop     | Type                                           | Default      | Description                  |
| -------- | ---------------------------------------------- | ------------ | ---------------------------- |
| `value`  | `string \| number \| Date \| null`             | —            | The moment to show           |
| `format` | `'datetime' \| 'date' \| 'time' \| 'relative'` | `'datetime'` | Display format               |
| `class`  | `string`                                       | —            | Classes appended to the root |
