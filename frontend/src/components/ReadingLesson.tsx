import { useState } from 'react'
import type { LessonConfig, ContentCard } from '../types'

type Phase = 'cards' | 'quiz'

type Props = {
  lesson: LessonConfig
  moduleTitle: string
  onComplete: () => void
  onBack: () => void
}

export function ReadingLesson({ lesson, moduleTitle, onComplete, onBack }: Props) {
  const [cardIndex, setCardIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('cards')
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  const cards = lesson.content
  const quiz = lesson.quiz ?? []
  const currentCard = cards[cardIndex]
  const isLastCard = cardIndex === cards.length - 1
  const currentQuestion = quiz[quizIndex]
  const isLastQuestion = quizIndex === quiz.length - 1

  const handleCardNext = () => {
    if (!isLastCard) {
      setCardIndex(cardIndex + 1)
    } else if (quiz.length > 0) {
      setPhase('quiz')
    } else {
      onComplete()
    }
  }

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptionId !== null) return
    setSelectedOptionId(optionId)
  }

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setQuizIndex(quizIndex + 1)
      setSelectedOptionId(null)
    } else {
      onComplete()
    }
  }

  return (
    <div className="reading-lesson">
      <div className="reading-lesson-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <span className="breadcrumb">
          {moduleTitle} › {lesson.title}
        </span>
      </div>

      {phase === 'cards' && (
        <div className="card-reader">
          <p className="card-progress">
            {cardIndex + 1} / {cards.length}
          </p>
          <ContentCardView card={currentCard} />
          <div className="card-nav">
            {cardIndex > 0 && (
              <button
                type="button"
                className="secondary"
                onClick={() => setCardIndex(cardIndex - 1)}
              >
                ← Previous
              </button>
            )}
            <button type="button" onClick={handleCardNext}>
              {isLastCard
                ? quiz.length > 0
                  ? 'Take the Quiz →'
                  : 'Finish Lesson ✓'
                : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {phase === 'quiz' && currentQuestion && (
        <div className="quiz-view">
          <p className="quiz-counter">
            Question {quizIndex + 1} of {quiz.length}
          </p>
          <p className="quiz-question">{currentQuestion.question}</p>
          <div className="quiz-options">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id
              const isCorrect = option.id === currentQuestion.correctOptionId
              const hasAnswered = selectedOptionId !== null
              let cls = 'quiz-option'
              if (hasAnswered) {
                if (isCorrect) cls += ' correct'
                else if (isSelected) cls += ' wrong'
              }
              return (
                <button
                  key={option.id}
                  type="button"
                  className={cls}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={hasAnswered}
                >
                  {option.text}
                </button>
              )
            })}
          </div>
          {selectedOptionId !== null && (
            <div
              className={`quiz-explanation ${selectedOptionId === currentQuestion.correctOptionId ? 'correct' : 'wrong'}`}
            >
              {selectedOptionId === currentQuestion.correctOptionId ? '✅ ' : '❌ '}
              {currentQuestion.explanation}
            </div>
          )}
          {selectedOptionId !== null && (
            <button type="button" className="quiz-next-btn" onClick={handleNextQuestion}>
              {isLastQuestion ? 'Finish Lesson ✓' : 'Next Question →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function ContentCardView({ card }: { card: ContentCard }) {
  return (
    <div className={`content-card content-card--${card.type}`}>
      {card.title && <h3 className="content-card-title">{card.title}</h3>}
      {card.type === 'code' ? (
        <pre className="content-card-code">{card.body}</pre>
      ) : (
        <p className="content-card-body">{card.body}</p>
      )}
    </div>
  )
}
