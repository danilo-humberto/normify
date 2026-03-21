from pathlib import Path

from fastapi import UploadFile

from app.core.exceptions import InvalidFileTypeError, ProcessingError, StorageError
from app.services.docx_reader import read_docx
from app.services.formatter import format_docx
from app.services.storage import upload_file as upload_to_storage


UPLOAD_DIR = Path("uploads")
PROCESSED_DIR = Path("processed")
ALLOWED_EXTENSIONS = {".docx"}


async def process_document(file: UploadFile) -> dict[str, object]:
    filename = file.filename or "uploaded-file.docx"
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise InvalidFileTypeError("Apenas arquivos .docx sao suportados")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    input_path = UPLOAD_DIR / filename
    output_path = PROCESSED_DIR / f"{input_path.stem}_formatted.docx"

    content = await file.read()
    input_path.write_bytes(content)

    try:
        read_docx(str(input_path))
        format_docx(str(input_path), str(output_path))
    except Exception as exc:
        raise ProcessingError("Nao foi possivel ler e formatar o arquivo DOCX") from exc

    try:
        file_url = upload_to_storage(str(output_path))
    except Exception as exc:
        raise StorageError(f"Nao foi possivel enviar o arquivo processado para o Supabase: {exc}") from exc

    return {
        "success": True,
        "file_url": file_url,
        "filename": output_path.name,
    }
