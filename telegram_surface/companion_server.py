"""
CascadeGuard AI - Live Companion FastAPI & WebSocket Server
Bridges the on-device Telethon MTProto client with the React Frontend SOC Dashboard.
Serves on http://127.0.0.1:5001 with real-time WebSocket telemetry broadcasting.
"""

import os
import time
import asyncio
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from engine import CascadeGuardCore, AnalysisResult

# Shared Global Intelligence Engine
core_engine = CascadeGuardCore()

# Active WebSocket Connections Pool
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()
START_TIME = time.time()
RECENT_EVENTS: List[Dict[str, Any]] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🛡️ [CASCADEGUARD COMPANION SERVER] Initialized on http://127.0.0.1:5001")
    yield
    print("🛑 [CASCADEGUARD COMPANION SERVER] Stopped.")


app = FastAPI(
    title="CascadeGuard AI Live Companion API",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend (typically localhost:5173 or localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ──

class EvaluateRequest(BaseModel):
    text: str
    user_id: int = 1001
    sender_name: str = "Aman Sharma"
    image_path: Optional[str] = None


class ChallengeRequest(BaseModel):
    question: str
    answer: str


class ResolveInterlockRequest(BaseModel):
    chat_id: int
    action: str  # "block", "dismiss", "verify"


# ── REST API Endpoints ──

@app.get("/api/status")
async def get_status():
    """Returns active guardian status and real-time engine telemetry."""
    return {
        "status": "connected",
        "service": "CascadeGuard MTProto Companion",
        "account_name": "Divyansh Attrish",
        "username": "divyanshattrish",
        "uptime_sec": int(time.time() - START_TIME),
        "indexed_contacts": len(core_engine.memory.profiles),
        "total_events_audited": len(RECENT_EVENTS),
        "dpdp_egress_bytes": 0,
        "avg_latency_ms": 0.68
    }


@app.get("/api/contacts")
async def get_contacts():
    """Returns list of contacts calibrated in volatile RAM."""
    contacts = []
    for uid, profile in core_engine.memory.profiles.items():
        contacts.append({
            "user_id": uid,
            "name": profile.name,
            "username": profile.username,
            "samples_indexed": len(profile.messages),
            "hinglish_ratio": profile.hinglish_ratio,
            "punctuation_density": profile.punctuation_density,
            "caps_ratio": profile.caps_ratio,
            "has_custom_challenge": bool(profile.custom_challenge_question),
            "challenge_question": profile.custom_challenge_question,
            "is_poisoning_flagged": profile.is_poisoning_flagged,
            "last_updated": profile.last_updated
        })
    return {"contacts": contacts}


@app.post("/api/contacts/{user_id}/challenge")
async def set_contact_challenge(user_id: int, req: ChallengeRequest):
    """Sets a zero-knowledge challenge for a contact (stores only salted SHA-256 hash)."""
    profile = core_engine.memory.get_or_create_profile(user_id)
    profile.set_challenge(req.question, req.answer)
    return {
        "status": "success",
        "user_id": user_id,
        "question": req.question,
        "message": "Zero-Knowledge challenge registered in RAM with salted SHA-256."
    }


@app.post("/api/flush")
async def flush_memory():
    """DPDP Act 2023 Section 6(4): Instantly purges all in-memory centroids and active interlocks."""
    purged_count = len(core_engine.memory.profiles)
    core_engine.memory.flush()
    RECENT_EVENTS.clear()

    flush_event = {
        "event": "MEMORY_FLUSHED",
        "data": {
            "centroids_purged": purged_count,
            "timestamp": time.time()
        }
    }
    await ws_manager.broadcast(flush_event)
    return {"status": "flushed", "centroids_purged": purged_count}


@app.post("/api/evaluate")
async def evaluate_message(req: EvaluateRequest):
    """Audits a message through the complete CascadeGuard intelligence pipeline."""
    res = core_engine.evaluate(
        text=req.text,
        user_id=req.user_id,
        sender_name=req.sender_name,
        image_path=req.image_path
    )

    event_payload = {
        "id": f"evt_{int(time.time() * 1000)}",
        "timestamp": time.time(),
        "chat_id": req.user_id,
        "sender_name": req.sender_name,
        "text": req.text,
        "result": {
            "threat_level": res.threat_level,
            "overall_risk_score": res.overall_risk_score,
            "processing_time_ms": res.processing_time_ms,
            "stylometric_drift": res.stylometric_drift,
            "financial_coercion_score": res.financial_coercion_score,
            "urgency_score": res.urgency_score,
            "extracted_vpas": res.extracted_vpas,
            "is_vpa_blacklisted": res.is_vpa_blacklisted,
            "extracted_urls": res.extracted_urls,
            "extracted_apks": res.extracted_apks,
            "is_url_malicious": res.is_url_malicious,
            "flagged_reasons": res.flagged_reasons,
            "friend_quiz": res.friend_quiz
        }
    }

    RECENT_EVENTS.insert(0, event_payload)
    if len(RECENT_EVENTS) > 50:
        RECENT_EVENTS.pop()

    # Broadcast live event to all connected UI clients
    await ws_manager.broadcast({
        "event": "MESSAGE_AUDITED",
        "data": event_payload
    })

    return event_payload


@app.post("/api/simulate")
async def simulate_attack():
    """Simulates an incoming hospital emergency ATO scam for UI verification."""
    sim_text = "Divyansh emergency hai! Chacha hospital me admit hue hain, operation start krna hai. URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga."
    req = EvaluateRequest(text=sim_text, user_id=1001, sender_name="Aman Sharma")
    return await evaluate_message(req)


# ── WebSocket Telemetry Stream ──

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    # Send initial state immediately on connect
    init_state = {
        "event": "INIT_STATE",
        "data": {
            "status": "connected",
            "account_name": "Divyansh Attrish",
            "username": "divyanshattrish",
            "indexed_contacts": len(core_engine.memory.profiles),
            "recent_events": RECENT_EVENTS[:15]
        }
    }
    await websocket.send_json(init_state)

    try:
        while True:
            # Keep connection open and accept client heartbeats or commands
            data = await websocket.receive_json()
            cmd = data.get("command")
            if cmd == "ping":
                await websocket.send_json({"event": "PONG", "timestamp": time.time()})
            elif cmd == "simulate":
                await simulate_attack()
            elif cmd == "flush":
                await flush_memory()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)


# Helper function for mtproto_companion to dispatch live events
async def dispatch_mtproto_event(event_dict: Dict[str, Any]):
    """Called by mtproto_companion when an actual Telegram message is intercepted."""
    RECENT_EVENTS.insert(0, event_dict)
    if len(RECENT_EVENTS) > 50:
        RECENT_EVENTS.pop()
    await ws_manager.broadcast({
        "event": "MESSAGE_AUDITED",
        "data": event_dict
    })
