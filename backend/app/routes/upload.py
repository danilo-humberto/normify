from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.exceptions import InvalidFileTypeError, ProcessingError, StorageError
from app.services.document_pipeline import process_document


router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> dict[str, object]:
    try:
        return await process_document(file)
    except InvalidFileTypeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ProcessingError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except StorageError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
