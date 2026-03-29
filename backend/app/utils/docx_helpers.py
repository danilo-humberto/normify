from __future__ import annotations

import unicodedata

from docx.oxml.ns import qn
from docx.shared import Cm, Pt
from docx.text.paragraph import Paragraph
from docx.text.run import Run


# ---------------------------------------------------------------------------
# ABNT margin constants (NBR 14724)
# ---------------------------------------------------------------------------
MARGIN_TOP = Cm(3)
MARGIN_BOTTOM = Cm(2)
MARGIN_LEFT = Cm(3)
MARGIN_RIGHT = Cm(2)

# ---------------------------------------------------------------------------
# ABNT section keywords (normalised, no accents)
# ---------------------------------------------------------------------------
SECTION_KEYWORDS = {
    "INTRODUCAO",
    "OBJETIVOS",
    "OBJETIVO",
    "METODOLOGIA",
    "DESENVOLVIMENTO",
    "RESULTADOS",
    "DISCUSSAO",
    "CONCLUSAO",
    "CONSIDERACOES FINAIS",
    "REFERENCIAS",
    "REFERENCIAS BIBLIOGRAFICAS",
    "BIBLIOGRAFIA",
}


def normalize(text: str) -> str:
    """Strip accents, upper-case, strip whitespace."""
    upper = text.strip().upper()
    nfkd = unicodedata.normalize("NFKD", upper)
    return nfkd.encode("ascii", "ignore").decode("ascii")


def is_section_heading(paragraph: Paragraph) -> bool:
    """Return True if the paragraph text matches a known ABNT section keyword."""
    norm = normalize(paragraph.text).rstrip(" .:-")
    # exact match or ends with the keyword (e.g. "1 INTRODUCAO")
    for keyword in SECTION_KEYWORDS:
        if norm == keyword or norm.endswith(f" {keyword}"):
            return True
    return False


def is_references_heading(paragraph: Paragraph) -> bool:
    norm = normalize(paragraph.text).rstrip(" .:-")
    for keyword in ("REFERENCIAS", "REFERENCIAS BIBLIOGRAFICAS", "BIBLIOGRAFIA"):
        if norm == keyword or norm.endswith(f" {keyword}"):
            return True
    return False


def paragraph_has_page_break(paragraph: Paragraph) -> bool:
    break_tag = qn("w:br")
    break_type = qn("w:type")
    for element in paragraph._p.iter():
        if element.tag == break_tag and element.get(break_type) == "page":
            return True
    return False


def set_run_font(run: Run, font_name: str) -> None:
    """Apply font to all four font slots so it works across all OSes."""
    run.font.name = font_name
    rpr = run._element.get_or_add_rPr()
    fonts = rpr.get_or_add_rFonts()
    ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        fonts.set(f"{{{ns}}}{attr[2:]}", font_name)


def apply_run_style(
    run: Run,
    *,
    font_name: str,
    font_size: object,
    bold: bool | None = None,
) -> None:
    set_run_font(run, font_name)
    run.font.size = font_size
    if bold is not None:
        run.font.bold = bold


def apply_margins(doc_section: object) -> None:
    """Apply ABNT margins to a document section."""
    doc_section.top_margin = MARGIN_TOP
    doc_section.bottom_margin = MARGIN_BOTTOM
    doc_section.left_margin = MARGIN_LEFT
    doc_section.right_margin = MARGIN_RIGHT
