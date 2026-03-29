class NormifyError(Exception):
    """Base error for all Normify exceptions."""


class InvalidFileTypeError(NormifyError):
    """Raised when the uploaded file is not a .docx."""


class ProcessingError(NormifyError):
    """Raised when document processing fails."""


class StorageError(NormifyError):
    """Raised when Supabase upload fails."""


class ReferencesError(NormifyError):
    """Raised when reference formatting fails."""
