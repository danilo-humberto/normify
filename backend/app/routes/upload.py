from __future__ import annotations

import json

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.exceptions import InvalidFileTypeError, ProcessingError, StorageError
from app.schemas.document import CoverData, TitlePageData
from app.services.pipeline import process_document

router = APIRouter(prefix="/api", tags=["documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    cover: str = Form(...),
    title_page: str = Form(default="{}"),
) -> dict[str, object]:
    """
    Receive a .docx file, cover data and optional title page data.

    - `cover`: JSON string with CoverData fields (required)
    - `title_page`: JSON string with TitlePageData fields (optional, defaults to not included)
    """
    try:
        cover_data = CoverData(**json.loads(cover))
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Dados da capa inválidos: {exc}") from exc

    try:
        title_page_data = TitlePageData(**json.loads(title_page))
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Dados da folha de rosto inválidos: {exc}") from exc

    try:
        return await process_document(file, cover_data, title_page_data)
    except InvalidFileTypeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ProcessingError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except StorageError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
