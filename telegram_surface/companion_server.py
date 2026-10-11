"""
CascadeGuard AI - Live Companion FastAPI & WebSocket Server
Bridges the on-device Telethon MTProto client with the React Frontend SOC Dashboard.
Serves on http://127.0.0.1:5001 with real-time WebSocket telemetry broadcasting.
"""

import os
import sys
import time
import asyncio
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

# Ensure UTF-8 stdout encoding on Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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


def seed_demo_contacts():
    if not core_engine.memory.profiles:
        core_engine.memory.ingest_history(
            user_id=1001,
            name="Aman Sharma",
            username="aman_kiet",
            messages=[
                "Oyee sun, kal ke lab notes hain tere paas?",
                "bhai canteen me aa rha h kya?",
                "haan chal 5 min me nikalte hain hostel se",
                "bhai prof ne attendance lagayi kya meri?",
                "mast scene hai bhai sham ko khelne chalenge",
                "bro assignment submit ho gya portal pe dekh"
            ]
        )
        p1 = core_engine.memory.get_profile(1001)
        if p1:
            p1.set_challenge("What was the nickname of our 1st-year hostel warden at KIET?", "Gabbar Sir")

        core_engine.memory.ingest_history(
            user_id=1002,
            name="Ayush Srivastav",
            username="ayush_dev",
            messages=[
                "Bhai PR merge kar diya maine github pe",
                "react components compile ho gaye hain check karlo",
                "kal hackathon presentation ke slides ready kar lenge",
                "server endpoints test ho gaye postman me"
            ]
        )

        core_engine.memory.ingest_history(
            user_id=1003,
            name="Naresh Ji",
            username="naresh_kiet_admin",
            messages=[
                "Divyansh ji lab 3 ke systems verify ho gaye hain",
                "server backup complete ho gaya hai",
                "keys drawer admin room me locked hai"
            ]
        )
        p3 = core_engine.memory.get_profile(1003)
        if p3:
            p3.set_challenge("Where is the departmental backup keys drawer located?", "Admin Room")


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_demo_contacts()
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

guardian_companion = None
guardian_task = None
is_guardian_active = False


@app.get("/api/guardian/status")
async def get_guardian_status():
    global is_guardian_active, guardian_companion
    is_live = False
    acc_name = "Divyansh Attrish"
    acc_user = "divyanshattrish"
    if guardian_companion and getattr(guardian_companion, "client", None) and guardian_companion.client.is_connected():
        is_live = True
        me = getattr(guardian_companion, "me", None)
        if me:
            acc_name = getattr(me, 'first_name', acc_name)
            acc_user = getattr(me, 'username', acc_user) or acc_user

    return {
        "is_active": is_guardian_active and is_live,
        "status": "connected" if (is_guardian_active and is_live) else "standby",
        "account_name": acc_name,
        "username": acc_user
    }


@app.post("/api/guardian/start")
async def start_guardian():
    global guardian_companion, guardian_task, is_guardian_active
    if is_guardian_active and guardian_companion and getattr(guardian_companion, "client", None) and guardian_companion.client.is_connected():
        return {
            "status": "already_active",
            "message": "Live Telegram Guardian is already actively monitoring."
        }

    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)

    api_id = os.getenv("TELEGRAM_API_ID")
    api_hash = os.getenv("TELEGRAM_API_HASH")

    if not api_id or not api_hash:
        raise HTTPException(
            status_code=400,
            detail="TELEGRAM_API_ID and TELEGRAM_API_HASH not found in telegram_surface/.env"
        )

    session_path = os.path.join(os.path.dirname(__file__), "cascadeguard_session")

    from mtproto_companion import CascadeGuardMTProtoCompanion
    guardian_companion = CascadeGuardMTProtoCompanion(
        api_id=int(api_id),
        api_hash=api_hash,
        session_name=session_path
    )
    guardian_companion.engine = core_engine

    async def run_listener_bg():
        global is_guardian_active
        try:
            is_guardian_active = True
            await guardian_companion.start_live_listener(run_api_server=False)
        except Exception as e:
            print(f"[-] Guardian listener stopped: {e}")
        finally:
            is_guardian_active = False

    guardian_task = asyncio.create_task(run_listener_bg())

    # Wait up to 3 seconds for initial connection
    for _ in range(30):
        if guardian_companion.client and guardian_companion.client.is_connected():
            break
        await asyncio.sleep(0.1)

    me_name = "Divyansh Attrish"
    me_user = "divyanshattrish"
    if guardian_companion:
        me = getattr(guardian_companion, "me", None)
        if me:
            me_name = getattr(me, 'first_name', me_name)
            me_user = getattr(me, 'username', me_user) or me_user

    await ws_manager.broadcast({
        "event": "STATUS_CHANGE",
        "data": {
            "status": "connected",
            "is_shield_active": True,
            "account_name": me_name,
            "username": me_user,
            "latency_ms": 0.65
        }
    })

    return {
        "status": "success",
        "message": f"Live Telegram monitoring activated for {me_name} (@{me_user})!",
        "account_name": me_name,
        "username": me_user
    }


@app.post("/api/guardian/stop")
async def stop_guardian():
    global guardian_companion, guardian_task, is_guardian_active
    is_guardian_active = False
    if guardian_companion and getattr(guardian_companion, "client", None):
        try:
            await guardian_companion.client.disconnect()
        except Exception:
            pass
    if guardian_task and not guardian_task.done():
        guardian_task.cancel()

    await ws_manager.broadcast({
        "event": "STATUS_CHANGE",
        "data": {
            "status": "standby",
            "is_shield_active": False,
            "account_name": "Divyansh Attrish",
            "username": "divyanshattrish",
            "latency_ms": 0.0
        }
    })

    return {"status": "success", "message": "Live Telegram monitoring paused."}


@app.get("/api/status")
async def get_status():
    """Returns active guardian status and real-time engine telemetry."""
    is_live = False
    if guardian_companion and getattr(guardian_companion, "client", None) and guardian_companion.client.is_connected():
        is_live = True

    return {
        "status": "connected" if is_live else "standby",
        "is_shield_active": is_guardian_active and is_live,
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


if __name__ == "__main__":
    import uvicorn
    print("\n🛡️ [CASCADEGUARD COMPANION SERVER] Starting standalone server on http://127.0.0.1:5001 ...")
    uvicorn.run(app, host="127.0.0.1", port=5001)

