import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.route import router as text_router
import os
from dotenv import load_dotenv


load_dotenv()


app = FastAPI(
    title="medirag",
    description="Medical AI assistant APP",
    version="1.0.0"
)


# CORS setup

frontend_url = os.getenv("FRONTEND_URL")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://medirag.vercel.app",
    "https://medirag-git-main-abhi1202803s-projects.vercel.app",
]

if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes

app.include_router(text_router, prefix="/input", tags=["Text Processing"])

@app.get("/")
def root():
    return {"message": "Server is running!"}


# run

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
