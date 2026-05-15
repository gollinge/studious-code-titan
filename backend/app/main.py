from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    result = execute_python_code(request.code)
    return ExecuteResponse(
        stdout=result.stdout,
        stderr=result.stderr,
        error_type=result.error_type,
        timed_out=result.timed_out,
        exit_code=result.exit_code,
    )
