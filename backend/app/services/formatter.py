from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt


def format_docx(input_path: str, output_path: str) -> None:
    document = Document(input_path)

    for paragraph in document.paragraphs:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        paragraph.paragraph_format.line_spacing = 1.5

        for run in paragraph.runs:
            run.font.name = "Arial"
            run.font.size = Pt(12)

            # Ensures Word keeps the font family consistently.
            if run._element.rPr is not None:
                run._element.rPr.rFonts.set(
                    "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii",
                    "Arial",
                )
                run._element.rPr.rFonts.set(
                    "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}hAnsi",
                    "Arial",
                )

    document.save(output_path)
