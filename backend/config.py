import os
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "backend"


def load_environment():
    load_dotenv(ROOT_DIR / ".env")
    load_dotenv(BACKEND_DIR / ".env", override=False)


load_environment()


def get_env(name: str, default: str | None = None):
    return os.getenv(name, default)
