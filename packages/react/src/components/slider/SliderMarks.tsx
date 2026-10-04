import { sliderMark, sliderMarkLabels, sliderMarks } from './slider.variants'

export interface SliderMarksProps {
  marks: Array<{ value: number; label?: string }>
  min: number
  max: number
  labels?: boolean
}

export function SliderMarks({ marks, min, max, labels }: SliderMarksProps) {
  function percent(value: number) {
    const span = max - min
    return span > 0 ? ((value - min) / span) * 100 : 0
  }

  if (labels)
    return (
      <span aria-hidden="true" className={sliderMarkLabels()}>
        {marks.map(mark => (
          <span
            key={mark.value}
            className="absolute top-0 flex w-0 justify-center whitespace-nowrap"
            style={{ insetInlineStart: `${percent(mark.value)}%` }}
          >
            {mark.label}
          </span>
        ))}
      </span>
    )

  return (
    <span aria-hidden="true" className={sliderMarks()}>
      {marks.map(mark => (
        <span
          key={mark.value}
          className="absolute top-0 flex h-0 w-0 items-center justify-center"
          style={{ insetInlineStart: `${percent(mark.value)}%` }}
        >
          <span className={sliderMark()} />
        </span>
      ))}
    </span>
  )
}
