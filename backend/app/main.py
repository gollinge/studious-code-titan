import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .executor import execute_python_code
from .models import ExecuteRequest, ExecuteResponse

app = FastAPI(title="Local Python Learning App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
    ],
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/execute", response_model=ExecuteResponse)
def execute(request: ExecuteRequest) -> ExecuteResponse:
    result = execute_python_code(request.code, stdin=request.stdin)
    return ExecuteResponse(
        stdout=result.stdout,
        stderr=result.stderr,
        error_type=result.error_type,
        timed_out=result.timed_out,
        exit_code=result.exit_code,
    )


# Packaged builds (see packaging/windows) serve the built frontend from here so
# the whole app runs from one process on one origin. Must be registered last.
_frontend_dir = os.environ.get("STUDIOUS_FRONTEND_DIR")
if _frontend_dir and Path(_frontend_dir, "index.html").is_file():
    frontend_root = Path(_frontend_dir).resolve()

    @app.get("/{full_path:path}", include_in_schema=False)
    def frontend(full_path: str) -> FileResponse:
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        candidate = (frontend_root / full_path).resolve()
        if candidate.is_file() and frontend_root in candidate.parents:
            return FileResponse(candidate)
        # Client-side routes (BrowserRouter) fall back to the SPA shell.
        return FileResponse(frontend_root / "index.html")
