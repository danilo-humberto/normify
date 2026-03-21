from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import UploadFile

from app.core.exceptions import InvalidFileTypeError, ProcessingError, StorageError
from app.services.docx_reader import read_docx
from app.services.formatter import format_docx
from app.services.storage import upload_file as upload_to_storage


ALLOWED_EXTENSIONS = {".docx"}


async def process_document(file: UploadFile) -> dict[str, object]:
    filename = file.filename or "uploaded-file.docx"
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise InvalidFileTypeError("Apenas arquivos .docx sao suportados")

    content = await file.read()

    with NamedTemporaryFile(delete=False, suffix=extension) as input_file:
        input_path = Path(input_file.name)
        input_file.write(content)

    output_name = f"{Path(filename).stem}_formatted.docx"
    with NamedTemporaryFile(delete=False, suffix="_formatted.docx") as output_file:
        output_path = Path(output_file.name)

    try:
        read_docx(str(input_path))
        format_docx(str(input_path), str(output_path))
    except Exception as exc:
        raise ProcessingError("Nao foi possivel ler e formatar o arquivo DOCX") from exc
    finally:
        if input_path.exists():
            input_path.unlink()

    try:
        file_url = upload_to_storage(str(output_path))
    except Exception as exc:
        raise StorageError(f"Nao foi possivel enviar o arquivo processado para o Supabase: {exc}") from exc
    finally:
        if output_path.exists():
            output_path.unlink()

    return {
        "success": True,
        "filename": output_name,
        "file_url": file_url,
    }
