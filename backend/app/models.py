from pydantic import BaseModel, Field


class ExecuteRequest(BaseModel):
    code: str = Field(default="", max_length=10000)
    stdin: str = Field(default="")


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    error_type: str | None = None
    timed_out: bool = False
    exit_code: int | None = None
