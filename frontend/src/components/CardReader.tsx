import type { ContentCard } from '../types'
import { ChoicePrompt } from './ChoicePrompt'
import { RunnerCard } from './RunnerCard'
import { renderInlineCode } from '../utils/inlineCode'

// Split text on triple-backtick code fences (```...```), rendering each
// fence as a <pre><code> block and each prose chunk through renderInlineCode.
// Switches the container from <p> to <div> so block-level <pre> is valid HTML.
function ProseBody({ text }: { text: string }) {
  const fenceRe = /```(?:[a-zA-Z0-9_-]+\n)?([\s\S]*?)```/g
  const segments: { type: 'prose' | 'fence'; text: string }[] = []
  let lastIndex = 0
  for (const m of text.matchAll(fenceRe)) {
    const idx = m.index ?? 0
    if (idx > lastIndex) {
      segments.push({ type: 'prose', text: text.slice(lastIndex, idx) })
    }
    segments.push({ type: 'fence', text: m[1].replace(/^\n+/, '').replace(/\n+$/, '') })
    lastIndex = idx + m[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'prose', text: text.slice(lastIndex) })
  }

  return (
    <div className="content-card-body" style={{ whiteSpace: 'pre-wrap' }}>
      {segments.map((seg, i) =>
        seg.type === 'fence' ? (
          <pre key={i} className="content-card-code"><code>{seg.text}</code></pre>
        ) : (
          <span key={i}>{renderInlineCode(seg.text)}</span>
        ),
      )}
    </div>
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
      {card.title && (
        <h3 className="content-card-title">{renderInlineCode(card.title)}</h3>
      )}
      {legacyCodeBody ? (
        <pre className="content-card-code"><code>{card.body}</code></pre>
      ) : (
        <ProseBody text={card.body} />
      )}
      {card.codeBlock && (
        <pre className="content-card-code"><code>{card.codeBlock}</code></pre>
      )}
      {card.type === 'puzzle' && card.puzzle && (
        <ChoicePrompt question={card.puzzle} />
      )}
      {card.type === 'runner' && card.runnerCode && (
        <RunnerCard code={card.runnerCode} />
      )}
      {card.note && <ProseBody text={card.note} />}
    </div>
  )
}

// ── ConceptBadges ──────────────────────────────────────────────────────────────

/** Small pill row showing the concepts a lesson uses (e.g. 'print()', 'while'). */
export function ConceptBadges({ badges }: { badges: string[] }) {
  if (badges.length === 0) return null
  return (
    <div className="concept-badges" aria-label="Concepts you'll use">
      <span className="concept-badges__label">You'll use:</span>
      {badges.map((b) => (
        <span key={b} className="concept-badge">{b}</span>
      ))}
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
  /** Optional concept pills shown above the card stack. */
  conceptBadges?: string[]
  onPrev: () => void
  onNext: () => void
}

export function CardReader({
  cards,
  cardIndex,
  nextLabel,
  hintText,
  conceptBadges,
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
        {conceptBadges && <ConceptBadges badges={conceptBadges} />}
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
