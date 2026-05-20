import type { ContentCard } from '../types'

// ── ContentCardView ────────────────────────────────────────────────────────────

export function ContentCardView({ card }: { card: ContentCard }) {
  return (
    <div className={`content-card content-card--${card.type}`}>
      {card.type === 'callout' && (
        <span className="content-card-callout-label">💡 Good to know!</span>
      )}
      {card.title && <h3 className="content-card-title">{card.title}</h3>}
      {card.type === 'code' ? (
        <pre className="content-card-code">{card.body}</pre>
      ) : (
        <p className="content-card-body" style={{ whiteSpace: 'pre-wrap' }}>
          {card.body}
        </p>
      )}
    </div>
  )
}

// ── CardReader ─────────────────────────────────────────────────────────────────

type CardReaderProps = {
  cards: ContentCard[]
  cardIndex: number
  moduleTitle: string
  lessonTitle: string
  /** Label for the primary next/advance button. */
  nextLabel: string
  /** Optional hint shown above the next button on the last card. */
  hintText?: string
  /** Label for the back-to-module button. Default: "← Module" */
  backLabel?: string
  onBack: () => void
  onPrev: () => void
  onNext: () => void
}

export function CardReader({
  cards,
  cardIndex,
  moduleTitle,
  lessonTitle,
  nextLabel,
  hintText,
  backLabel = '← Module',
  onBack,
  onPrev,
  onNext,
}: CardReaderProps) {
  const isLastCard = cardIndex === cards.length - 1

  return (
    <>
      <div className="reading-lesson-header">
        <button type="button" className="back-btn" onClick={onBack}>
          {backLabel}
        </button>
        <span className="breadcrumb">
          {moduleTitle} › {lessonTitle}
        </span>
        <span className="card-progress">
          {cardIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="card-reader">
        <div className="card-progress-dots">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`card-dot${
                i === cardIndex
                  ? ' card-dot--active'
                  : i < cardIndex
                    ? ' card-dot--done'
                    : ''
              }`}
            />
          ))}
        </div>

        <ContentCardView card={cards[cardIndex]} />

        <div className="card-nav">
          {cardIndex > 0 ? (
            <button type="button" className="card-prev-btn" onClick={onPrev}>
              ← Previous
            </button>
          ) : (
            <span />
          )}
          <div className="card-nav-right">
            {isLastCard && hintText && (
              <span className="card-quiz-hint">{hintText}</span>
            )}
            <button type="button" className="card-next-btn" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
