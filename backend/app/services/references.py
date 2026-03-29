from __future__ import annotations

"""
references.py — Detects and reformats bibliographic references using Gemini.

Flow:
  1. Extract all paragraphs from the references section.
  2. Send raw text to Gemini, which returns structured JSON.
  3. Reformat each reference according to NBR 6023.
  4. Replace the original paragraphs in the document.
"""

import json
import logging
import re

import google as genai

from app.core.config import get_settings
from app.core.exceptions import ReferencesError
from app.utils.docx_helpers import is_references_heading

logger = logging.getLogger(__name__)

_SUPPORTED_TYPES = ("book", "article", "thesis", "website", "chapter", "other")

_SYSTEM_PROMPT = """
Você é um especialista em normas bibliográficas ABNT NBR 6023.
Receberá uma lista de referências bibliográficas em formato livre.

Retorne SOMENTE um array JSON válido. Nenhum texto antes ou depois.
Cada objeto deve ter:
  - "type": um de ["book", "article", "thesis", "website", "chapter", "other"]
  - "authors": lista de strings no formato "SOBRENOME, Nome"
  - "title": string
  - "year": string (apenas o ano)
  - Para "article": "journal", "volume", "number", "pages", "city" (strings, null se ausente)
  - Para "thesis": "degree", "institution", "city", "pages" (strings, null se ausente)
  - Para "book": "edition", "city", "publisher", "pages" (strings, null se ausente)
  - Para "chapter": "book_title", "organizers", "edition", "city", "publisher", "pages" (strings, null se ausente)
  - Para "website": "url", "access_date" (strings, null se ausente)
  - Para "other": "raw" (a referência original como string)
""".strip()


def format_references(doc: object, font_name: str) -> None:
    """
    Find the references section in *doc*, reformat entries via Gemini,
    and replace them in place.
    """
    settings = get_settings()
    client = genai.Client(api_key=settings.gemini_api_key)

    paragraphs = list(doc.paragraphs)
    ref_start = _find_references_start(paragraphs)

    if ref_start is None:
        logger.info("No references section found — skipping.")
        return

    ref_paragraphs = [
        p for p in paragraphs[ref_start + 1:] if p.text.strip()
    ]

    if not ref_paragraphs:
        logger.info("References section is empty — skipping.")
        return

    raw_text = "\n".join(p.text.strip() for p in ref_paragraphs)
    structured = _parse_with_gemini(raw_text, client)
    formatted_lines = [_format_reference(ref) for ref in structured]

    _replace_reference_paragraphs(ref_paragraphs, formatted_lines, font_name)
    logger.debug("Formatted %d references.", len(formatted_lines))


# ---------------------------------------------------------------------------
# Gemini interaction
# ---------------------------------------------------------------------------

def _parse_with_gemini(raw_text: str, client: genai.Client) -> list[dict]:
    prompt = f"{_SYSTEM_PROMPT}\n\nReferências:\n{raw_text}"

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        text = response.text.strip()
        text = re.sub(r"^```json\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        return json.loads(text)
    except Exception as exc:
        raise ReferencesError(f"Gemini failed to parse references: {exc}") from exc


# ---------------------------------------------------------------------------
# ABNT NBR 6023 formatters
# ---------------------------------------------------------------------------

def _format_reference(ref: dict) -> str:
    ref_type = ref.get("type", "other")

    if ref_type == "article":
        return _format_article(ref)
    if ref_type == "thesis":
        return _format_thesis(ref)
    if ref_type == "book":
        return _format_book(ref)
    if ref_type == "chapter":
        return _format_chapter(ref)
    if ref_type == "website":
        return _format_website(ref)

    # fallback: return as-is
    return ref.get("raw", "")


def _authors_str(authors: list[str]) -> str:
    """Format author list per ABNT: up to 3 listed, beyond that uses 'et al.'"""
    if not authors:
        return ""
    if len(authors) > 3:
        return f"{authors[0]} et al."
    return "; ".join(authors)


def _format_article(r: dict) -> str:
    authors = _authors_str(r.get("authors", []))
    title = r.get("title", "")
    journal = r.get("journal", "")
    city = r.get("city") or ""
    volume = f"v. {r['volume']}" if r.get("volume") else ""
    number = f"n. {r['number']}" if r.get("number") else ""
    pages = f"p. {r['pages']}" if r.get("pages") else ""
    year = r.get("year", "")

    vol_num_pages = ", ".join(filter(None, [volume, number, pages]))
    location_part = ", ".join(filter(None, [city, vol_num_pages]))

    return f"{authors}. {title}. **{journal}**, {location_part}, {year}.".strip()


def _format_thesis(r: dict) -> str:
    authors = _authors_str(r.get("authors", []))
    title = r.get("title", "")
    year = r.get("year", "")
    pages = f"{r['pages']} f." if r.get("pages") else ""
    degree = r.get("degree", "Trabalho de Conclusão de Curso")
    institution = r.get("institution", "")
    city = r.get("city", "")

    institution_part = f"{degree} – {institution}, {city}, {year}."
    parts = filter(None, [authors + ".", title + ".", year + ".", pages, institution_part])
    return " ".join(parts)


def _format_book(r: dict) -> str:
    authors = _authors_str(r.get("authors", []))
    title = r.get("title", "")
    edition = f"{r['edition']} ed." if r.get("edition") else ""
    city = r.get("city", "")
    publisher = r.get("publisher", "")
    year = r.get("year", "")
    pages = f"{r['pages']} p." if r.get("pages") else ""

    location = f"{city}: {publisher}" if city and publisher else city or publisher
    parts = filter(None, [f"{authors}.", f"**{title}**.", edition, f"{location},", f"{year}.", pages])
    return " ".join(parts)


def _format_chapter(r: dict) -> str:
    authors = _authors_str(r.get("authors", []))
    title = r.get("title", "")
    organizers = r.get("organizers", "")
    book_title = r.get("book_title", "")
    edition = f"{r['edition']} ed." if r.get("edition") else ""
    city = r.get("city", "")
    publisher = r.get("publisher", "")
    year = r.get("year", "")
    pages = f"p. {r['pages']}" if r.get("pages") else ""

    org_part = f"In: {organizers} (org.)." if organizers else "In:"
    location = f"{city}: {publisher}" if city and publisher else city or publisher
    parts = filter(None, [
        f"{authors}.", title + ".",
        org_part, f"**{book_title}**.", edition,
        f"{location},", f"{year}.", pages,
    ])
    return " ".join(parts)


def _format_website(r: dict) -> str:
    authors = _authors_str(r.get("authors", []))
    title = r.get("title", "")
    url = r.get("url", "")
    access = f"Acesso em: {r['access_date']}." if r.get("access_date") else ""
    year = r.get("year", "")

    author_part = f"{authors}." if authors else ""
    parts = filter(None, [author_part, title + ".", year + "." if year else "", f"Disponível em: {url}.", access])
    return " ".join(parts)


# ---------------------------------------------------------------------------
# Document mutation
# ---------------------------------------------------------------------------

def _find_references_start(paragraphs: list) -> int | None:
    for i, p in enumerate(paragraphs):
        if is_references_heading(p):
            return i
    return None


def _replace_reference_paragraphs(
    ref_paragraphs: list,
    formatted_lines: list[str],
    font_name: str,
) -> None:
    """
    Replace original reference paragraph texts with the formatted versions.
    Extra paragraphs (if original had more than formatted) are cleared.
    Missing paragraphs are not added here — formatting is in-place only.
    """
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Pt
    from app.utils.docx_helpers import apply_run_style

    for i, paragraph in enumerate(ref_paragraphs):
        # Clear existing runs
        for run in paragraph.runs:
            run.text = ""

        if i < len(formatted_lines):
            text = formatted_lines[i]
            paragraph.clear()
            run = paragraph.add_run(text)
            apply_run_style(run, font_name=font_name, font_size=Pt(12), bold=None)
            pf = paragraph.paragraph_format
            paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
            pf.line_spacing = 1.0
            pf.first_line_indent = Pt(0)
            pf.space_before = Pt(0)
            pf.space_after = Pt(6)
        else:
            paragraph.clear()
