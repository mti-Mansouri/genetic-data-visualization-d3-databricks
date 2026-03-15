from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Clinical Evidence Synthesizer API",
    description = "Backend for genetic Analysis",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Clinical Evidence Synthesizer API!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy" , "version": "1.0.0"}