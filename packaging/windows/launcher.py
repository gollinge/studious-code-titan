"""Start the packaged app: run the backend (which also serves the frontend) and
open it in the default browser. Lives at <package>/server/launcher.py."""

from __future__ import annotations

import argparse
import os
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path

HOST = "127.0.0.1"
# Fixed port on purpose: lesson progress lives in localStorage, which is keyed
# by origin (including port). A different port would look like a fresh start.
PORT = 8765
URL = f"http://{HOST}:{PORT}/"

SERVER_DIR = Path(__file__).resolve().parent
PACKAGE_ROOT = SERVER_DIR.parent


def is_running() -> bool:
    try:
        with urllib.request.urlopen(f"{URL}health", timeout=1) as response:
            return response.status == 200
    except OSError:
        return False


def open_when_ready() -> None:
    for _ in range(100):
        if is_running():
            webbrowser.open(URL)
            return
        time.sleep(0.1)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    if is_running():
        print(f"Studious Code Titan is already running at {URL}")
        if not args.no_browser:
            webbrowser.open(URL)
        return 0

    os.environ["STUDIOUS_FRONTEND_DIR"] = str(PACKAGE_ROOT / "web")
    # Started with `python -I`, so the script's own folder isn't on sys.path.
    sys.path.insert(0, str(SERVER_DIR))

    import uvicorn

    from app.main import app

    print("=" * 60)
    print("  Studious Code Titan is running!")
    print(f"  Open {URL} in your browser if it doesn't open by itself.")
    print("  Keep this window open while you learn.")
    print("  Close this window to stop the app.")
    print("=" * 60)

    if not args.no_browser:
        threading.Thread(target=open_when_ready, daemon=True).start()

    server = uvicorn.Server(uvicorn.Config(app, host=HOST, port=PORT, log_level="warning"))
    try:
        server.run()
    except SystemExit:
        pass  # uvicorn exits this way when it cannot bind the port
    if not server.started:
        print(f"\nCould not start on port {PORT}. Is another program using it?")
        input("Press Enter to close...")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
