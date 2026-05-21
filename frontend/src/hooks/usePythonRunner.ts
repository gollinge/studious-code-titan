import { useCallback, useRef, useState } from 'react'
import type { ExecutionResponse } from '../types'
import { apiBase } from '../utils/pythonUtils'

type Options = {
  code: string
  onSuccess?: (payload: ExecutionResponse) => void
}

type Return = {
  isRunning: boolean
  output: ExecutionResponse | null
  setOutput: React.Dispatch<React.SetStateAction<ExecutionResponse | null>>
  outputRef: React.RefObject<HTMLPreElement | null>
  showHelp: boolean
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>
  runCode: (stdin?: string) => Promise<void>
}

export function usePythonRunner({ code, onSuccess }: Options): Return {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const outputRef = useRef<HTMLPreElement | null>(null)

  const runCode = useCallback(async (stdin = '') => {
    setIsRunning(true)
    setShowHelp(false)
    try {
      const response = await fetch(`${apiBase}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin }),
      })
      const payload = (await response.json()) as ExecutionResponse
      setOutput(payload)
      if (payload.error_type === null) {
        onSuccess?.(payload)
      }
    } catch {
      setOutput({
        stdout: '',
        stderr: 'Could not connect to the server. Make sure the backend is running.',
        error_type: 'ConnectionError',
        timed_out: false,
        exit_code: null,
      })
    } finally {
      setIsRunning(false)
      setTimeout(() => {
        outputRef.current?.scrollTo(0, outputRef.current.scrollHeight)
      }, 50)
    }
  }, [code, onSuccess])

  return { isRunning, output, setOutput, outputRef, showHelp, setShowHelp, runCode }
}
