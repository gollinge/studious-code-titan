from __future__ import annotations

import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

TIMEOUT_SECONDS = 2


@dataclass
class ExecutionResult:
    stdout: str
    stderr: str
    error_type: str | None
    timed_out: bool
    exit_code: int | None


RUNNER_SCRIPT = """
import builtins
import io
import os
import pathlib
import socket
import sys
import traceback

BLOCKED_IMPORTS = {
    "ctypes", "http", "importlib", "os", "pathlib", "requests", "shutil",
    "socket", "subprocess", "sys", "tempfile", "urllib", "webbrowser"
}

workspace_root = pathlib.Path.cwd().resolve()
stdlib_root = pathlib.Path(os.__file__).resolve().parent
real_import = builtins.__import__
real_open = builtins.open

def within(path: pathlib.Path, root: pathlib.Path) -> bool:
    return path == root or root in path.parents

def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    top_name = name.split(".")[0]
    if top_name in BLOCKED_IMPORTS:
        raise ImportError(f"Import '{top_name}' is blocked in this sandbox.")
    return real_import(name, globals, locals, fromlist, level)

def safe_open(file, *args, **kwargs):
    candidate = pathlib.Path(file)
    resolved = (workspace_root / candidate).resolve() if not candidate.is_absolute() else candidate.resolve()
    if within(resolved, workspace_root) or within(resolved, stdlib_root):
        return real_open(resolved, *args, **kwargs)
    raise PermissionError("File access outside this workspace is blocked.")

def blocked_network(*args, **kwargs):
    raise PermissionError("Network access is disabled in this sandbox.")

builtins.__import__ = safe_import
builtins.open = safe_open
socket.socket = blocked_network
socket.create_connection = blocked_network

source_path = pathlib.Path(sys.argv[1]).resolve()
source = source_path.read_text(encoding="utf-8")
stdout_buffer = io.StringIO()
stderr_buffer = io.StringIO()

saved_stdout = sys.stdout
saved_stderr = sys.stderr
sys.stdout = stdout_buffer
sys.stderr = stderr_buffer

scope = {"__name__": "__main__"}

try:
    compiled = compile(source, str(source_path), "exec")
    exec(compiled, scope, scope)
except BaseException:
    traceback.print_exc()
finally:
    sys.stdout = saved_stdout
    sys.stderr = saved_stderr

print(stdout_buffer.getvalue(), end="")
sys.stderr.write(stderr_buffer.getvalue())
""".strip()


def _detect_error_type(stderr: str) -> str | None:
    if not stderr.strip():
        return None

    error_match = re.search(r"([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception)):", stderr)
    if error_match:
        return error_match.group(1)

    return "ExecutionError"


def _child_env() -> dict[str, str]:
    env = {"PYTHONIOENCODING": "utf-8"}
    # Windows needs SYSTEMROOT or the child interpreter fails to start.
    if sys.platform == "win32" and "SYSTEMROOT" in os.environ:
        env["SYSTEMROOT"] = os.environ["SYSTEMROOT"]
    return env


def execute_python_code(code: str, stdin: str = "") -> ExecutionResult:
    with tempfile.TemporaryDirectory(prefix="study-python-") as temp_dir:
        temp_path = Path(temp_dir)
        user_code_path = temp_path / "main.py"
        runner_path = temp_path / "runner.py"

        user_code_path.write_text(code, encoding="utf-8")
        runner_path.write_text(RUNNER_SCRIPT, encoding="utf-8")

        try:
            completed = subprocess.run(
                [sys.executable, "-I", "-S", str(runner_path), str(user_code_path)],
                cwd=temp_path,
                capture_output=True,
                text=True,
                timeout=TIMEOUT_SECONDS,
                input=stdin,
                env=_child_env(),
            )
            stderr = completed.stderr
            return ExecutionResult(
                stdout=completed.stdout,
                stderr=stderr,
                error_type=_detect_error_type(stderr),
                timed_out=False,
                exit_code=completed.returncode,
            )
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                stdout="",
                stderr="Execution timed out after 2 seconds.",
                error_type="TimeoutError",
                timed_out=True,
                exit_code=None,
            )
