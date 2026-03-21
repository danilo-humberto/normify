from fastapi import FastAPI

from app.routes.upload import router as upload_router


app = FastAPI()
app.include_router(upload_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Normify API running"}
