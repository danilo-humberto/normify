from __future__ import annotations

"""
pipeline.py — Orchestrates the full document processing flow.

Steps:
  1. Validate file type
  2. Remove existing cover (if requested)
  3. Format body (styles, headings, section breaks)
  4. Format references via Gemini
  5. Apply ABNT margins
  6. Add page numbers
  7. Generate and prepend cover page
  8. Save and upload to Supabase
"""

import logging
from pathlib import Path
from tempfile import NamedTemporaryFile

from docx import Document
from fastapi import UploadFile

from app.core.exceptions import InvalidFileTypeError, ProcessingError, StorageError
from app.schemas.document import CoverData, TitlePageData
from app.services.body import format_body, remove_existing_cover
from app.services.cover import generate_cover
from app.services.page_numbers import add_page_numbers
from app.services.references import format_references
from app.services.storage import upload_file
from app.services.title_page import generate_title_page, remove_existing_title_page
from app.utils.docx_helpers import MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_RIGHT, MARGIN_TOP

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".docx"}


async def process_document(file: UploadFile, cover: CoverData, title_page: TitlePageData) -> dict[str, object]:
    """Full pipeline: receive upload → format → upload to Supabase → return URL."""

    filename = file.filename or "documento.docx"
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise InvalidFileTypeError("Apenas arquivos .docx são suportados.")

    content = await file.read()

    # Write upload to a temp file
    with NamedTemporaryFile(delete=False, suffix=".docx") as tmp_in:
        input_path = Path(tmp_in.name)
        tmp_in.write(content)

    output_name = f"{Path(filename).stem}_normificado.docx"

    with NamedTemporaryFile(delete=False, suffix=".docx") as tmp_out:
        output_path = Path(tmp_out.name)

    try:
        doc = Document(str(input_path))

        # ── Step 1: Remove existing cover if user said so ──────────────────
        if cover.has_existing_cover:
            remove_existing_cover(doc)

        # ── Step 1b: Remove existing title page if user said so ────────────
        if title_page.include and title_page.has_existing_title_page:
            remove_existing_title_page(doc)

        # ── Step 2: Format body paragraphs ────────────────────────────────
        format_body(doc, cover)

        # ── Step 3: Format references ─────────────────────────────────────
        try:
            format_references(doc, cover.font.value)
        except Exception as exc:
            # Non-fatal: log and continue without reference formatting
            logger.warning("Reference formatting skipped: %s", exc)

        # ── Step 4: Apply ABNT margins ────────────────────────────────────
        for section in doc.sections:
            section.top_margin = MARGIN_TOP
            section.bottom_margin = MARGIN_BOTTOM
            section.left_margin = MARGIN_LEFT
            section.right_margin = MARGIN_RIGHT

        # ── Step 5: Add page numbers ──────────────────────────────────────
        add_page_numbers(doc, font_name=cover.font.value)

        # ── Step 6: Generate and prepend cover ────────────────────────────
        generate_cover(doc, cover)

        # ── Step 7: Generate title page (after cover) ─────────────────────
        if title_page.include:
            generate_title_page(doc, cover, title_page)

        doc.save(str(output_path))
        logger.debug("Document saved to %s", output_path)

    except Exception as exc:
        raise ProcessingError(f"Falha ao processar o documento: {exc}") from exc
    finally:
        if input_path.exists():
            input_path.unlink()

    # ── Step 7: Upload to Supabase ─────────────────────────────────────────
    try:
        file_url = upload_file(str(output_path), output_name)
    except Exception as exc:
        raise StorageError(f"Falha ao enviar para o Supabase: {exc}") from exc
    finally:
        if output_path.exists():
            output_path.unlink()

    return {
        "success": True,
        "filename": output_name,
        "file_url": file_url,
    }
