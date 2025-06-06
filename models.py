from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Formation(Base):
    __tablename__ = "formations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=True)
    
    # Relationships
    players = relationship("Player", back_populates="formation", cascade="all, delete-orphan")
    ball = relationship("Ball", back_populates="formation", uselist=False, cascade="all, delete-orphan")

class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    formation_id = Column(Integer, ForeignKey("formations.id"), nullable=False)
    player_id = Column(Integer, nullable=False)  # Original player ID from frontend
    name = Column(String(50), nullable=False)
    position = Column(String(20), nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    team = Column(String(10), nullable=False)  # 'home' or 'away'
    
    # Relationships
    formation = relationship("Formation", back_populates="players")

class Ball(Base):
    __tablename__ = "balls"
    
    id = Column(Integer, primary_key=True, index=True)
    formation_id = Column(Integer, ForeignKey("formations.id"), nullable=False)
    ball_id = Column(String(10), default="ball")
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    
    # Relationships
    formation = relationship("Formation", back_populates="ball")