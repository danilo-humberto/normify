import os
from pathlib import Path
from uuid import uuid4
from dotenv import load_dotenv

from supabase import Client, create_client

load_dotenv()

BUCKET_NAME = "processed-files"


def _get_client() -> Client:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        raise ValueError("As variaveis SUPABASE_URL e SUPABASE_KEY precisam estar definidas")

    return create_client(supabase_url, supabase_key)


def upload_file(file_path: str) -> str:
    client = _get_client()
    path = Path(file_path)
    storage_path = f"{uuid4().hex}_{path.name}"

    with path.open("rb") as file_handle:
        upload_result = client.storage.from_(BUCKET_NAME).upload(
            storage_path,
            file_handle,
            {
                "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "upsert": "true",
            },
        )

    if isinstance(upload_result, dict) and upload_result.get("error"):
        raise ValueError(str(upload_result["error"]))

    public_url = client.storage.from_(BUCKET_NAME).get_public_url(storage_path)
    if isinstance(public_url, dict):
        return public_url.get("publicURL") or public_url.get("publicUrl") or ""

    return public_url
