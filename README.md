# PDF Insight

Upload a PDF (up to 10 MB) and get a 3-5 sentence summary plus structured JSON
(type, key points, entities, amounts, dates, keywords).

- **Frontend:** React + Vite + strict TypeScript, deployed to GitHub Pages by GitHub Actions.
- **Backend:** FastAPI proxy (`main.py`) that holds the Gemini API key. The browser never sees it.

## How it works

1. The browser sends the PDF to `POST /api/analyze`.
2. The backend validates the file (magic bytes, size) and extracts the text layer with `pypdf`.
   Scans without a text layer are rejected.
3. The text is sent to Gemini as delimited data. Output is constrained by a response schema and
   validated again with pydantic (ISO 8601 dates, ISO 4217 currencies). The file name and page
   count come from the server, not the model.
4. The frontend validates the response with zod before rendering.

## Security

- `GEMINI_API_KEY` lives only in the backend environment. `.env` is git-ignored.
- CORS allows only `ALLOWED_ORIGIN` (default `https://mwaveff.github.io`), no credentials.
- Prompt injection: the document is wrapped in a random boundary marker, the system instruction
  declares it untrusted data, the file name is never put in the prompt, and the output is
  schema-validated.
- Upstream errors are logged server-side and never returned to the client.

## Run locally

```bash
# backend
python -m venv .venv && .venv/Scripts/activate   # source .venv/bin/activate on Linux/macOS
pip install -r requirements.txt
cp .env.example .env                              # set GEMINI_API_KEY (and ALLOWED_ORIGIN=http://localhost:5173)
uvicorn main:app --reload

# frontend
cd frontend
npm ci
echo VITE_API_URL=http://localhost:8000/api/analyze > .env.local
npm run dev
```

Checks: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`.

## Deployment

- Frontend: push to `main`; `.github/workflows/deploy.yml` lints, builds and publishes to Pages.
- Backend: any Python host (the demo uses Render). Set `GEMINI_API_KEY` and `ALLOWED_ORIGIN`
  as environment variables there. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
