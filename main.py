from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Football Tactics API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Player(BaseModel):
    id: int
    name: str
    position: str
    x: float
    y: float
    team: str

class Ball(BaseModel):
    id: str
    x: float
    y: float

class Formation(BaseModel):
    name: str
    players: List[Player]
    ball: Optional[Ball] = None

# @app.get("/")
# async def root():
#     return {"message": "Football Tactics API"}

@app.get("/formations")
async def get_formations():
    return {"formations": []}

@app.post("/formations")
async def save_formation(formation: Formation):
    return {"message": "Formation saved", "formation": formation}

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
