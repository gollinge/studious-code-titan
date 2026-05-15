from app.executor import execute_python_code


def test_executes_print_output() -> None:
    result = execute_python_code('print("hi")')

    assert result.stdout == "hi\n"
    assert result.stderr == ""
    assert result.error_type is None
    assert result.timed_out is False


def test_reports_syntax_error() -> None:
    result = execute_python_code("if True print('oops')")

    assert "SyntaxError" in result.stderr
    assert result.error_type == "SyntaxError"


def test_times_out_infinite_loop() -> None:
    result = execute_python_code("while True:\n    pass")

    assert result.timed_out is True
    assert result.error_type == "TimeoutError"


def test_blocks_dangerous_imports() -> None:
    result = execute_python_code("import os\nprint('nope')")

    assert "ImportError" in result.stderr
    assert result.error_type == "ImportError"
