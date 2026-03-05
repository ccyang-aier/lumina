from litestar import Litestar, get
from litestar.config.cors import CORSConfig


@get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@get("/api/hello")
async def hello() -> dict[str, str]:
    return {"message": "hello, world", "service": "lumina-backend"}


cors_config = CORSConfig(
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app = Litestar(route_handlers=[health, hello], cors_config=cors_config)

