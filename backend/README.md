# Normify Backend v2

Formatador de documentos acadêmicos seguindo as normas ABNT (NBR 14724 e NBR 6023).

## Estrutura

```
app/
├── main.py                  # FastAPI entry point
├── core/
│   ├── config.py            # Variáveis de ambiente
│   └── exceptions.py        # Exceções customizadas
├── routes/
│   └── upload.py            # POST /api/upload
├── schemas/
│   └── document.py          # Pydantic models (CoverData)
├── services/
│   ├── pipeline.py          # Orquestrador principal
│   ├── cover.py             # Gera capa ABNT do zero
│   ├── body.py              # Formata o corpo do documento
│   ├── references.py        # Formata referências via Gemini
│   ├── page_numbers.py      # Numeração de páginas ABNT
│   └── storage.py           # Upload para Supabase
└── utils/
    └── docx_helpers.py      # Funções reutilizáveis
```

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Preencha o .env com suas chaves
uvicorn app.main:app --reload
```

## Endpoint

### POST /api/upload

Recebe `multipart/form-data` com:

| Campo  | Tipo   | Descrição                        |
|--------|--------|----------------------------------|
| `file` | File   | Arquivo `.docx`                  |
| `cover`| string | JSON com os dados da capa        |

**Exemplo de `cover` (JSON string):**

```json
{
  "institution": "Universidade Federal de Pernambuco",
  "authors": ["João Silva", "Maria Souza"],
  "title": "Análise do Impacto da IA na Educação",
  "subtitle": "Um estudo de caso",
  "volume": null,
  "city": "Recife",
  "year": 2026,
  "font": "Arial",
  "has_existing_cover": false
}
```

**Resposta:**

```json
{
  "success": true,
  "filename": "documento_normificado.docx",
  "file_url": "https://..."
}
```

## Campos da Capa

| Campo                | Obrigatório | Descrição                                      |
|----------------------|-------------|------------------------------------------------|
| `institution`        | Não         | Nome da instituição                            |
| `authors`            | Sim         | Lista de autores (mínimo 1)                    |
| `title`              | Sim         | Título do trabalho                             |
| `subtitle`           | Não         | Subtítulo (dois-pontos inseridos automaticamente) |
| `volume`             | Não         | Número do volume                               |
| `city`               | Sim         | Cidade da instituição                          |
| `year`               | Sim         | Ano de depósito                                |
| `font`               | Não         | `"Arial"` (padrão) ou `"Times New Roman"`      |
| `has_existing_cover` | Não         | `true` se o .docx já tem capa a ser removida   |

## Variáveis de Ambiente

| Variável          | Descrição                      |
|-------------------|-------------------------------|
| `SUPABASE_URL`    | URL do projeto Supabase        |
| `SUPABASE_KEY`    | Chave anon do Supabase         |
| `SUPABASE_BUCKET` | Nome do bucket (default: documents) |
| `GEMINI_API_KEY`  | Chave da API do Google Gemini  |
