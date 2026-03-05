import os
import sys


PROJECT_ROOT = os.path.dirname(__file__)
SRC_DIR = os.path.join(PROJECT_ROOT, "src")
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from lumina.app.asgi import app  # noqa: E402


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("lumina.app.asgi:app", host="0.0.0.0", port=8000, reload=True)

