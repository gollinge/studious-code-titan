import type { ContentCard } from '../types'

// Split prose text on `backticks` so `print()` style spans render as inline code.
// Odd-indexed segments are the backtick-wrapped code.
function ProseBody({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g)
  return (
    <p className="content-card-body" style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <code key={i} className="content-card-inline-code">{part}</code>
          : part,
      )}
    </p>
  )
}

// ── ContentCardView ────────────────────────────────────────────────────────────

export function ContentCardView({ card }: { card: ContentCard }) {
  // Legacy 'code' cards put the code straight into `body` with no separate
  // `codeBlock`. For those, keep the whole-body <pre> rendering until the
  // curriculum data is migrated. Once a card has its own codeBlock, the body
  // is treated as prose like every other card type.
  const legacyCodeBody = card.type === 'code' && !card.codeBlock

  return (
    <div className={`content-card content-card--${card.type}`}>
      {card.type === 'callout' && (
        <span className="content-card-callout-label">💡 Remember this!</span>
      )}
      {card.title && <h3 className="content-card-title">{card.title}</h3>}
      {legacyCodeBody ? (
        <pre className="content-card-code"><code>{card.body}</code></pre>
      ) : (
        <ProseBody text={card.body} />
      )}
      {card.codeBlock && (
        <pre className="content-card-code"><code>{card.codeBlock}</code></pre>
      )}
      {card.note && <ProseBody text={card.note} />}
    </div>
  )
}

// ── CardReader ─────────────────────────────────────────────────────────────────

type CardReaderProps = {
  cards: ContentCard[]
  cardIndex: number
  /** Label for the primary next/advance button. */
  nextLabel: string
  /** Optional hint shown above the next button on the last card. */
  hintText?: string
  onPrev: () => void
  onNext: () => void
}

export function CardReader({
  cards,
  cardIndex,
  nextLabel,
  hintText,
  onPrev,
  onNext,
}: CardReaderProps) {
  const isLastCard = cardIndex === cards.length - 1

  return (
    <>
      <div className="reading-lesson-header">
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
