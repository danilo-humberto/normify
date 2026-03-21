class PipelineError(Exception):
    """Erro base da pipeline de documentos."""


class InvalidFileTypeError(PipelineError):
    """Arquivo com extensao nao suportada."""


class ProcessingError(PipelineError):
    """Falha ao ler ou formatar o arquivo."""


class StorageError(PipelineError):
    """Falha ao enviar o arquivo para o storage."""
