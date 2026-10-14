"""Build a self-contained Windows (x64) package of the app.

Produces dist/StudiousCodeTitan/ and dist/StudiousCodeTitan-windows-x64.zip.
The package bundles a portable CPython from the official "python" NuGet
package, so the target machine needs nothing installed. Can be run on Windows,
macOS or Linux (wheels are fetched for win_amd64 regardless of host).

Usage: python packaging/windows/build.py [--skip-frontend-build]
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import urllib.request
import zipfile
from pathlib import Path

PYTHON_VERSION = "3.13.15"
NUGET_URL = "https://api.nuget.org/v3-flatcontainer/python/{v}/python.{v}.nupkg"
APP_NAME = "StudiousCodeTitan"

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
FRONTEND = REPO / "frontend"
BACKEND = REPO / "backend"

# Parts of the NuGet Python we don't need at runtime.
PYTHON_EXCLUDES = (
    "include/",
    "libs/",
    "Lib/test/",
    "Lib/idlelib/",
    "Lib/tkinter/",
    "Lib/turtledemo/",
    "Lib/ensurepip/",
    "Lib/site-packages/",
)
DEV_ONLY_REQUIREMENTS = {"pytest"}


def run(cmd: list[str], cwd: Path | None = None) -> None:
    print("+", " ".join(cmd))
    # npm is a .cmd shim on Windows, which needs the shell to resolve.
    subprocess.run(cmd, cwd=cwd, check=True, shell=sys.platform == "win32" and cmd[0] == "npm")


def build_frontend() -> None:
    run(["npm", "ci"], cwd=FRONTEND)
    run(["npm", "run", "build"], cwd=FRONTEND)


def fetch_python(cache: Path) -> Path:
    cache.mkdir(parents=True, exist_ok=True)
    nupkg = cache / f"python.{PYTHON_VERSION}.nupkg"
    if not nupkg.exists():
        url = NUGET_URL.format(v=PYTHON_VERSION)
        print(f"Downloading {url}")
        tmp = nupkg.with_suffix(".part")
        urllib.request.urlretrieve(url, tmp)
        tmp.replace(nupkg)
    return nupkg


def extract_python(nupkg: Path, dest: Path) -> None:
    with zipfile.ZipFile(nupkg) as archive:
        for member in archive.infolist():
            if not member.filename.startswith("tools/") or member.is_dir():
                continue
            relative = member.filename[len("tools/"):]
            if relative.startswith(PYTHON_EXCLUDES):
                continue
            target = dest / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(member) as src, open(target, "wb") as out:
                shutil.copyfileobj(src, out)


def runtime_requirements() -> list[str]:
    requirements = []
    for line in (BACKEND / "requirements.txt").read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        name = line.split("==")[0].split(">=")[0].split("[")[0].strip().lower()
        if name not in DEV_ONLY_REQUIREMENTS:
            requirements.append(line)
    # pip evaluates environment markers against the build host, so a Linux or
    # macOS build would miss click's Windows-only dependency. Add it directly.
    requirements.append("colorama")
    return requirements


def install_dependencies(site_packages: Path) -> None:
    major_minor = ".".join(PYTHON_VERSION.split(".")[:2])
    run([
        sys.executable, "-m", "pip", "install",
        "--target", str(site_packages),
        "--platform", "win_amd64",
        "--python-version", major_minor,
        "--implementation", "cp",
        "--only-binary=:all:",
        "--no-compile",
        "--disable-pip-version-check",
        *runtime_requirements(),
    ])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--skip-frontend-build", action="store_true",
                        help="reuse an existing frontend/dist")
    parser.add_argument("--out", type=Path, default=REPO / "dist")
    args = parser.parse_args()

    if not args.skip_frontend_build:
        build_frontend()
    dist = FRONTEND / "dist"
    if not (dist / "index.html").is_file():
        print("frontend/dist is missing; run without --skip-frontend-build", file=sys.stderr)
        return 1

    out: Path = args.out.resolve()
    stage = out / APP_NAME
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)

    python_dir = stage / "python"
    extract_python(fetch_python(out / ".cache"), python_dir)
    install_dependencies(python_dir / "Lib" / "site-packages")

    ignore = shutil.ignore_patterns("__pycache__", "*.pyc")
    shutil.copytree(BACKEND / "app", stage / "server" / "app", ignore=ignore)
    shutil.copy2(HERE / "launcher.py", stage / "server" / "launcher.py")
    shutil.copytree(dist, stage / "web")
    shutil.copy2(HERE / "Start Studious Code Titan.bat", stage)
    shutil.copy2(HERE / "README.txt", stage)
    shutil.copy2(REPO / "LICENSE", stage / "LICENSE.txt")

    archive = shutil.make_archive(str(out / f"{APP_NAME}-windows-x64"), "zip", out, APP_NAME)
    print(f"\nBuilt {stage}\nZipped {archive}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
