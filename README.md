# studious-code-titan

A local-only Python learning web app for children. It includes short lessons, a free-play sandbox, and a safe local Python execution backend.

## Project Structure

- `/frontend` — React + TypeScript + Vite UI with CodeMirror 6 editor
- `/backend` — FastAPI API and subprocess-based Python executor

## Local Setup (macOS)

### Prerequisites

- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: <http://127.0.0.1:5173>

## Notes

- The app stores lesson completion and sandbox code in `localStorage`.
- Python code executes only on the local FastAPI backend.
- Execution is isolated in a temporary folder, with a 2-second timeout and basic import/network/file restrictions.
- Keyboard shortcut: `Cmd/Ctrl + Enter` runs code.
