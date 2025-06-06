from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import uvicorn

from database import get_db, init_db
from models import Formation as DBFormation, Player as DBPlayer, Ball as DBBall

app = FastAPI(title="Football Tactics API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
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

class FormationResponse(BaseModel):
    id: int
    name: str
    players: List[Player]
    ball: Optional[Ball] = None
    created_at: str

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/formations", response_model=List[FormationResponse])
async def get_formations(db: Session = Depends(get_db)):
    formations = db.query(DBFormation).all()
    result = []
    
    for formation in formations:
        players = [
            Player(
                id=player.player_id,
                name=player.name,
                position=player.position,
                x=player.x,
                y=player.y,
                team=player.team
            )
            for player in formation.players
        ]
        
        ball = None
        if formation.ball:
            ball = Ball(
                id=formation.ball.ball_id,
                x=formation.ball.x,
                y=formation.ball.y
            )
        
        result.append(FormationResponse(
            id=formation.id,
            name=formation.name,
            players=players,
            ball=ball,
            created_at=formation.created_at.isoformat()
        ))
    
    return result

@app.post("/formations", response_model=dict)
async def save_formation(formation: Formation, db: Session = Depends(get_db)):
    print(f"Received formation: {formation}")
    print(f"Players count: {len(formation.players)}")
    print(f"Ball: {formation.ball}")
    # Create new formation
    db_formation = DBFormation(name=formation.name)
    db.add(db_formation)
    db.commit()
    db.refresh(db_formation)
    
    # Add players
    for player in formation.players:
        db_player = DBPlayer(
            formation_id=db_formation.id,
            player_id=player.id,
            name=player.name,
            position=player.position,
            x=player.x,
            y=player.y,
            team=player.team
        )
        db.add(db_player)
    
    # Add ball if present
    if formation.ball:
        db_ball = DBBall(
            formation_id=db_formation.id,
            ball_id=formation.ball.id,
            x=formation.ball.x,
            y=formation.ball.y
        )
        db.add(db_ball)
    
    db.commit()
    
    return {"message": "Formation saved successfully", "formation_id": db_formation.id}

@app.get("/formations/{formation_id}", response_model=FormationResponse)
async def get_formation(formation_id: int, db: Session = Depends(get_db)):
    formation = db.query(DBFormation).filter(DBFormation.id == formation_id).first()
    
    if not formation:
        raise HTTPException(status_code=404, detail="Formation not found")
    
    players = [
        Player(
            id=player.player_id,
            name=player.name,
            position=player.position,
            x=player.x,
            y=player.y,
            team=player.team
        )
        for player in formation.players
    ]
    
    ball = None
    if formation.ball:
        ball = Ball(
            id=formation.ball.ball_id,
            x=formation.ball.x,
            y=formation.ball.y
        )
    
    return FormationResponse(
        id=formation.id,
        name=formation.name,
        players=players,
        ball=ball,
        created_at=formation.created_at.isoformat()
    )

app.mount("/", StaticFiles(directory="frontend", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
