import { keymap } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect, useMemo, useState } from 'react'
import { sandboxExamples } from '../data/sandboxExamples'
import { usePythonRunner } from '../hooks/usePythonRunner'
import { OutputPanel } from './OutputPanel'

const SANDBOX_CODE_KEY = 'python-play-lab.sandbox.code'
const DEFAULT_SANDBOX_CODE = sandboxExamples[0].code

export function SandboxView() {
  const [sandboxCode, setSandboxCode] = useState<string>(
    () => localStorage.getItem(SANDBOX_CODE_KEY) ?? DEFAULT_SANDBOX_CODE,
  )

  const { isRunning, output, setOutput, outputRef, runCode } = usePythonRunner({
    code: sandboxCode,
  })

  useEffect(() => {
    localStorage.setItem(SANDBOX_CODE_KEY, sandboxCode)
  }, [sandboxCode])

  const sandboxKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            void runCode()
            return true
          },
        },
      ]),
    [runCode],
  )

  return (
    <main className="panel-layout">
      <section className="panel panel-left">
        <h2>Sandbox Examples</h2>
        <p>Pick a starter, then experiment freely.</p>
        <ul className="lesson-list">
          {sandboxExamples.map((example) => (
            <li key={example.id}>
              <button type="button" onClick={() => setSandboxCode(example.code)}>
                {example.title}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel panel-center">
        <div className="editor-toolbar">
          <button type="button" onClick={() => void runCode()} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run (Cmd/Ctrl + Enter)'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => setSandboxCode(DEFAULT_SANDBOX_CODE)}
          >
            Reset
          </button>
          <button type="button" className="secondary" onClick={() => setOutput(null)}>
            Clear Output
          </button>
        </div>
        <CodeMirror
          value={sandboxCode}
          height="100%"
          theme="light"
          extensions={[python(), sandboxKeymap]}
          onChange={(val) => setSandboxCode(val)}
          basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
        />
      </section>

      <section className="panel panel-right">
        <h2>Output</h2>
        {output === null ? (
          <pre ref={outputRef} className="output">
            Run Python code to see output here.
          </pre>
        ) : (
          <OutputPanel output={output} outputRef={outputRef} helpToggle={false} />
        )}
      </section>
    </main>
  )
}
