import { LineClamp } from '@hina-ui/react'

export default function Demo() {
  return (
    <LineClamp
      expandLabel="Read the full review"
      collapseLabel="Fold the review"
      className="w-full max-w-md"
    >
      It took me until volume three to notice that the offhand weather notes in the first two were
      all groundwork. The author never spells it out; the same radio call simply repeats three
      times, in three different seasons. When I closed the book I went back through volume one, and
      this time every page read like a different book. Recommended for readers who like a story that
      takes its time.
    </LineClamp>
  )
}
