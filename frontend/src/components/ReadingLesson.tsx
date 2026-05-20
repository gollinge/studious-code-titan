import { useState } from 'react'
import type { LessonConfig } from '../types'
import { CardReader } from './CardReader'

type Phase = 'cards' | 'quiz' | 'summary'

type Props = {
  lesson: LessonConfig
  moduleTitle: string
  onComplete: () => void
  onNext: () => void
  onBack: () => void
}

function quizSummaryMessage(correct: number, total: number): string {
  const pct = correct / total
  if (pct === 1)
    return "Perfect score — every answer right! You really paid attention. 🎉"
  if (pct >= 0.75)
    return "Really solid work. You've got the main ideas down. Any ones you missed are worth a quick re-read before moving on."
  if (pct >= 0.5)
    return "Good start! A few things to revisit, but that's exactly what learning looks like. Give those cards another glance and you'll have it."
  return "No worries — the first time through is always the hardest. Re-read the cards and try again whenever you're ready. Every programmer starts somewhere."
}

export function ReadingLesson({ lesson, moduleTitle, onComplete, onNext, onBack }: Props) {
  const [cardIndex, setCardIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('cards')
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const cards = lesson.content
  const quiz = lesson.quiz ?? []
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
      setIsCompleted(true)
    }
  }

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptionId !== null) return
    setSelectedOptionId(optionId)
    if (optionId === currentQuestion.correctOptionId) {
      setCorrectCount((n) => n + 1)
    }
  }

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setQuizIndex(quizIndex + 1)
      setSelectedOptionId(null)
    } else {
      onComplete()
      setIsCompleted(true)
      setPhase('summary')
    }
  }

  return (
    <div className="reading-lesson">
      {/* ── Card reader ── */}
      {phase === 'cards' && !isCompleted && (
        <CardReader
          cards={cards}
          cardIndex={cardIndex}
          moduleTitle={moduleTitle}
          lessonTitle={lesson.title}
          nextLabel={
            isLastCard
              ? quiz.length > 0
                ? 'Take the Quiz →'
                : 'Finish Lesson ✓'
              : 'Next →'
          }
          hintText={
            isLastCard && quiz.length > 0
              ? "That's all the reading — time for a quick check!"
              : undefined
          }
          backLabel="← Back to module"
          onBack={onBack}
          onPrev={() => setCardIndex(cardIndex - 1)}
          onNext={handleCardNext}
        />
      )}

      {/* ── Cards-only complete (no quiz) ── */}
      {phase === 'cards' && isCompleted && (
        <div className="quiz-summary">
          <span className="lesson-complete-badge">✓ Lesson Complete</span>
          <button type="button" className="continue-btn" onClick={onNext}>
            Next Lesson →
          </button>
        </div>
      )}

      {/* ── Quiz ── */}
      {phase === 'quiz' && currentQuestion && (
        <div className="quiz-view">
          <div className="quiz-progress-row">
            <span className="quiz-counter">Question {quizIndex + 1} of {quiz.length}</span>
            <div className="card-progress-dots">
              {quiz.map((_, i) => (
                <span
                  key={i}
                  className={`card-dot${i === quizIndex ? ' card-dot--active' : i < quizIndex ? ' card-dot--done' : ''}`}
                />
              ))}
            </div>
          </div>
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
              className={`quiz-explanation ${
                selectedOptionId === currentQuestion.correctOptionId ? 'correct' : 'wrong'
              }`}
            >
              {selectedOptionId === currentQuestion.correctOptionId ? '✅ ' : '❌ '}
              {currentQuestion.explanation}
            </div>
          )}
          {selectedOptionId !== null && (
            <button type="button" className="card-next-btn" onClick={handleNextQuestion}>
              {isLastQuestion ? 'See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {/* ── Quiz summary ── */}
      {phase === 'summary' && (
        <div className="quiz-summary">
          <div className="quiz-summary-score">
            <span className="quiz-summary-fraction">{correctCount} / {quiz.length}</span>
            <span className="quiz-summary-label">correct</span>
          </div>
          <p className="quiz-summary-message">
            {quizSummaryMessage(correctCount, quiz.length)}
          </p>
          <button type="button" className="continue-btn" onClick={onNext}>
            Next Lesson →
          </button>
        </div>
      )}
    </div>
  )
}
