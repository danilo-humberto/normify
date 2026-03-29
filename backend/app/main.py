from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router

logging.basicConfig(level=logging.DEBUG)

app = FastAPI(
    title="Normify API",
    description="Formatador de documentos acadêmicos seguindo as normas ABNT.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrinja para seu domínio em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "Normify API v2"}
