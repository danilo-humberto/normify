from __future__ import annotations

from docx.document import Document as DocumentObject
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt

from app.schemas.document import CoverData
from app.utils.docx_helpers import apply_run_style

_PAGE_HEIGHT_PT = 841.89
_MARGIN_TOP_PT = 85.04
_MARGIN_BOTTOM_PT = 56.69
_LINE_HEIGHT_PT = 18


def generate_cover(doc: DocumentObject, cover: CoverData) -> None:
    font = cover.font.value
    font_size = Pt(12)

    lines = 0
    if cover.institution:
        lines += max(1, len(cover.institution) // 60 + 1)
    lines += len(cover.authors)
    lines += max(1, len(cover.title) // 60 + 1)
    if cover.subtitle:
        lines += 1
    if cover.volume:
        lines += 1
    lines += 2

    usable_height = _PAGE_HEIGHT_PT - _MARGIN_TOP_PT - _MARGIN_BOTTOM_PT
    content_height = lines * _LINE_HEIGHT_PT
    free_space = max(usable_height - content_height, 0)

    space_before_middle = Pt(free_space * 0.40)
    space_before_bottom = Pt(free_space * 0.59)

    paragraphs: list[tuple[str, WD_ALIGN_PARAGRAPH, Pt, bool]] = []

    if cover.institution:
        paragraphs.append((cover.institution.upper(), WD_ALIGN_PARAGRAPH.CENTER, Pt(0), True))

    for i, author in enumerate(cover.authors):
        space = Pt(36) if i == 0 and cover.institution else Pt(0)
        paragraphs.append((author.upper(), WD_ALIGN_PARAGRAPH.CENTER, space, False))

    title_text = cover.title.upper()
    if cover.subtitle:
        subtitle_clean = cover.subtitle.lstrip(": ").strip()
        title_text = f"{title_text}: {subtitle_clean}"

    paragraphs.append((title_text, WD_ALIGN_PARAGRAPH.CENTER, space_before_middle, True))

    if cover.volume is not None:
        paragraphs.append((f"Volume {cover.volume}", WD_ALIGN_PARAGRAPH.CENTER, Pt(0), False))

    paragraphs.append((cover.city, WD_ALIGN_PARAGRAPH.CENTER, space_before_bottom, False))
    paragraphs.append((str(cover.year), WD_ALIGN_PARAGRAPH.CENTER, Pt(0), False))

    for i, (text, alignment, space_before, bold) in enumerate(reversed(paragraphs)):
        p = _insert_paragraph_at_start(doc)
        p.alignment = alignment
        pf = p.paragraph_format
        pf.space_before = space_before
        pf.space_after = Pt(0)
        pf.line_spacing = 1.0
        pf.first_line_indent = Pt(0)
        run = p.add_run(text)
        apply_run_style(run, font_name=font, font_size=font_size, bold=bold)

        # Page break embutido no parágrafo do ano (último da lista = índice 0 no reversed)
        if i == 0:
            from docx.oxml import OxmlElement
            from docx.oxml.ns import qn
            br = OxmlElement("w:br")
            br.set(qn("w:type"), "page")
            run._r.append(br)


def _insert_paragraph_at_start(doc: DocumentObject):
    from docx.text.paragraph import Paragraph
    body = doc.element.body
    new_p = OxmlElement("w:p")
    body.insert(0, new_p)
    return Paragraph(new_p, doc)


def _insert_page_break_at_start(doc: DocumentObject) -> None:
    body = doc.element.body
    p_el = OxmlElement("w:p")
    r_el = OxmlElement("w:r")
    br_el = OxmlElement("w:br")
    br_el.set(qn("w:type"), "page")
    r_el.append(br_el)
    p_el.append(r_el)
    body.insert(0, p_el)