from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import auth, solicitacoes

app = FastAPI(
    title="Portal de Solicitações Internas",
    description="API para registro e acompanhamento de solicitações internas.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",  # vite dev server (npm run dev)
    "http://localhost:4173",  # build de produção (docker / vite preview)
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Dados inválidos", "erros": exc.errors()},
    )


app.include_router(auth.router)
app.include_router(solicitacoes.router)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
