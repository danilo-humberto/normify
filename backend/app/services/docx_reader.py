from docx import Document


def read_docx(file_path: str) -> list[str]:
    document = Document(file_path)
    paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs]
    return [paragraph for paragraph in paragraphs if paragraph]
