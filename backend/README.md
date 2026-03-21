# Backend

Minimal FastAPI backend for Normify.

## Project structure

```text
backend/
├── app/
│   ├── core/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── main.py
├── requirements.txt
└── README.md
```

## Setup

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate the virtual environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the server

```bash
uvicorn app.main:app --reload
```

The root endpoint `GET /` returns:

```json
{"message": "Normify API running"}
```
