import { useState } from 'react'
import type { QuizQuestion } from '../types'

type Props = {
  question: QuizQuestion
  /**
   * When true (default), renders the question's `question` string as a prompt.
   * In-card puzzles often skip this because the card title/body already sets it up.
   */
  showQuestion?: boolean
  onAnswered?: (selectedOptionId: string, isCorrect: boolean) => void
}

export function ChoicePrompt({ question, showQuestion = true, onAnswered }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const hasAnswered = selectedOptionId !== null
  const isCorrect = hasAnswered && selectedOptionId === question.correctOptionId

  const handleSelect = (optionId: string) => {
    if (hasAnswered) return
    setSelectedOptionId(optionId)
    onAnswered?.(optionId, optionId === question.correctOptionId)
  }

  return (
    <div className="quiz-prompt">
      {showQuestion && question.question && (
        <p className="quiz-question">{question.question}</p>
      )}
      <div className="quiz-options">
        {question.options.map((option) => {
          const isThisCorrect = option.id === question.correctOptionId
          const isThisSelected = selectedOptionId === option.id
          let cls = 'quiz-option'
          if (hasAnswered) {
            if (isThisCorrect) cls += ' correct'
            else if (isThisSelected) cls += ' wrong'
          }
          return (
            <button
              key={option.id}
              type="button"
              className={cls}
              onClick={() => handleSelect(option.id)}
              disabled={hasAnswered}
            >
              {option.text}
            </button>
          )
        })}
      </div>
      {hasAnswered && (
        <div className={`quiz-explanation ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? '✅ ' : '❌ '}
          {question.explanation}
        </div>
      )}
    </div>
  )
}
