from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class FontChoice(str, Enum):
    arial = "Arial"
    times = "Times New Roman"


class WorkType(str, Enum):
    tcc = "Trabalho de Conclusão de Curso"
    research_project = "Projeto de Pesquisa"
    report = "Relatório"


class DegreeType(str, Enum):
    bachelor = "Bacharelado"
    licentiate = "Licenciatura"
    technologist = "Tecnólogo"


class CoverData(BaseModel):
    institution: str | None = Field(default=None)
    authors: list[str] = Field(min_length=1)
    title: str
    subtitle: str | None = Field(default=None)
    volume: int | None = Field(default=None)
    city: str
    year: int
    font: FontChoice = Field(default=FontChoice.arial)
    has_existing_cover: bool = Field(default=False)


class TitlePageData(BaseModel):
    include: bool = Field(default=False)
    work_type: WorkType | None = Field(default=None)
    degree: DegreeType | None = Field(default=None)
    concentration_area: str | None = Field(default=None)
    advisor: str | None = Field(default=None)
    co_advisor: str | None = Field(default=None)
    has_existing_title_page: bool = Field(default=False)


class DocumentRequest(BaseModel):
    cover: CoverData
    title_page: TitlePageData = Field(default_factory=TitlePageData)