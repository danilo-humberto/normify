from __future__ import annotations

import logging
from pathlib import Path

from supabase import create_client

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def upload_file(local_path: str, destination_name: str) -> str:
    """
    Upload a local file to Supabase Storage and return its public URL.

    Args:
        local_path: Absolute path to the file on disk.
        destination_name: Filename to use inside the bucket.

    Returns:
        Public URL of the uploaded file.
    """
    settings = get_settings()
    client = create_client(settings.supabase_url, settings.supabase_key)

    file_bytes = Path(local_path).read_bytes()

    client.storage.from_(settings.supabase_bucket).upload(
        path=destination_name,
        file=file_bytes,
        file_options={"content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
    )

    url = client.storage.from_(settings.supabase_bucket).get_public_url(destination_name)
    logger.debug("Uploaded %s → %s", destination_name, url)
    return url
