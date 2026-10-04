import type { ElementType, OlHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { timeline, timelineMarker } from './timeline.variants'
import type {
  TimelineAlign,
  TimelineItem,
  TimelineOrientation,
  TimelineSize,
  TimelineSlotProps,
  TimelineTone,
} from './types'

type TimelineRender<T extends TimelineItem> = (props: TimelineSlotProps<T>) => ReactNode

export interface TimelineProps<
  T extends TimelineItem = TimelineItem,
> extends OlHTMLAttributes<HTMLOListElement> {
  items: T[]
  orientation?: TimelineOrientation
  align?: TimelineAlign
  size?: TimelineSize
  tone?: TimelineTone
  timePosition?: 'content' | 'opposite'
  reverse?: boolean
  renderMarker?: TimelineRender<T>
  renderTitle?: TimelineRender<T>
  renderDescription?: TimelineRender<T>
  renderTime?: TimelineRender<T>
  renderContent?: TimelineRender<T>
  renderOpposite?: TimelineRender<T>
  ref?: Ref<HTMLOListElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Timeline<T extends TimelineItem = TimelineItem>({
  items,
  orientation = 'vertical',
  align = 'start',
  size,
  tone,
  timePosition = 'content',
  reverse = false,
  renderMarker,
  renderTitle,
  renderDescription,
  renderTime,
  renderContent,
  renderOpposite,
  className,
  ...attrs
}: TimelineProps<T>) {
  const entries = reverse ? [...items].reverse() : items
  const hasOpposite =
    !!renderOpposite ||
    (timePosition === 'opposite' && (!!renderTime || items.some(item => item.time)))

  return (
    <ol
      data-hn-timeline=""
      role="list"
      data-orientation={orientation}
      data-align={align}
      data-opposite={hasOpposite || undefined}
      {...attrs}
      className={cn(timeline({ size }), className)}
    >
      {entries.map((item, index) => {
        const scope = { item, index }
        const Time: ElementType = item.dateTime ? 'time' : 'span'
        return (
          <li
            key={item.id ?? index}
            className="hn-timeline-item min-w-0"
            data-side={
              align === 'end' || (align === 'alternate' && index % 2 === 1) ? 'end' : 'start'
            }
          >
            {hasOpposite ? (
              <div className="hn-timeline-opposite text-muted min-w-0 wrap-anywhere">
                {renderOpposite ? (
                  renderOpposite(scope)
                ) : timePosition === 'opposite' ? (
                  renderTime ? (
                    renderTime(scope)
                  ) : item.time ? (
                    <Time dateTime={item.dateTime} className="text-xs tabular-nums">
                      {item.time}
                    </Time>
                  ) : null
                ) : null}
              </div>
            ) : null}
            <div className="hn-timeline-separator" aria-hidden="true">
              <span className={timelineMarker({ tone: item.tone ?? tone })}>
                {renderMarker ? (
                  renderMarker(scope)
                ) : (
                  <span className="bg-surface size-2.5 rounded-full border-2 border-current" />
                )}
              </span>
              {index < entries.length - 1 ? (
                <span className="hn-timeline-connector bg-line" />
              ) : null}
            </div>
            <div className="hn-timeline-content min-w-0 wrap-anywhere">
              {renderContent ? (
                renderContent(scope)
              ) : (
                <>
                  {timePosition === 'content' && (item.time || renderTime) ? (
                    <div className="text-muted mb-1 text-xs tabular-nums">
                      {renderTime ? (
                        renderTime(scope)
                      ) : (
                        <Time dateTime={item.dateTime}>{item.time}</Time>
                      )}
                    </div>
                  ) : null}
                  {item.title || renderTitle ? (
                    <div className="font-medium">
                      {renderTitle ? renderTitle(scope) : item.title}
                    </div>
                  ) : null}
                  {item.description || renderDescription ? (
                    <div className="text-muted mt-1">
                      {renderDescription ? renderDescription(scope) : item.description}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
