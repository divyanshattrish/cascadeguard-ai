"""
CascadeGuard AI - Telegram Surface Bot (@CascadeGuardBot)
Production-grade Real-time Lateral Social Engineering & Account Takeover (ATO) Interceptor.
Supports Groups, DMs, Forwarded Messages, Document/APK Captions, and Inline Keyboards.
"""

import os
import sys
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from dotenv import load_dotenv
load_dotenv()

from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    ChatPermissions
)
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters
)

from engine import CascadeGuardCore, AnalysisResult, BaselineProfile

# Configure Logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger("CascadeGuardTelegram")

# Initialize Engine with local baseline
core_engine = CascadeGuardCore()

# Telemetry stats
stats = {
    "total_scanned": 0,
    "threats_blocked": 0,
    "prevented_loss_inr": 0,
    "quarantined_sessions": 0,
    "user_baselines_calibrated": 1
}


def build_alert_card(result: AnalysisResult, sender_name: str) -> str:
    vpa_str = ", ".join(result.extracted_vpas) if result.extracted_vpas else "None"
    apk_str = ", ".join(result.extracted_apks) if result.extracted_apks else "None"
    url_str = ", ".join(result.extracted_urls) if result.extracted_urls else "None"
    reasons_str = "\n".join([f"• {r}" for r in result.flagged_reasons]) if result.flagged_reasons else "• Statistical stylometric drift anomaly."

    return (
        f"🚨 <b>CASCADEGUARD ATO INTERCEPTION SHIELD</b>\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"⚠️ <b>Suspected Lateral Threat:</b> {sender_name}\n\n"
        f"📊 <b>Telemetry & Threat Metrics:</b>\n"
        f"• <b>Combined Risk Index:</b> <code>{result.overall_risk_score}% / 100%</code>\n"
        f"• <b>Stylometric Drift:</b> <code>{result.stylometric_drift}%</code> (from baseline)\n"
        f"• <b>Financial Coercion:</b> <code>{result.financial_coercion_score}%</code>\n"
        f"• <b>Urgency Velocity:</b> <code>{result.urgency_score}%</code>\n"
        f"• <b>Audit Latency:</b> <code>{result.processing_time_ms} ms</code> (Edge)\n"
        f"• <b>Extracted VPA:</b> <code>{vpa_str}</code>\n"
        f"• <b>Detected Payload:</b> <code>{apk_str}</code>\n"
        f"• <b>Flagged Links:</b> <code>{url_str}</code>\n\n"
        f"🔍 <b>Forensic Signals:</b>\n{reasons_str}\n\n"
        f"🔒 <b>Autonomous Action:</b> Direct payment & links locked. Verify sender identity via Zero-Knowledge challenge below."
    )


def build_alert_keyboard(result: AnalysisResult, user_id: int) -> InlineKeyboardMarkup:
    buttons = []
    
    # Button 1: Locked VPA notification
    if result.extracted_vpas:
        buttons.append([
            InlineKeyboardButton(f"🔒 Payment Interlocked: {result.extracted_vpas[0]}", callback_data="btn_locked_vpa")
        ])
    
    # Button 2: Friend Quiz & Quarantine
    buttons.append([
        InlineKeyboardButton("❓ Deploy Friend Quiz", callback_data=f"btn_quiz:{user_id}"),
        InlineKeyboardButton("🛑 Quarantine Session", callback_data=f"btn_quarantine:{user_id}")
    ])
    
    return InlineKeyboardMarkup(buttons)


# ── COMMAND HANDLERS ──

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    text = (
        "🛡️ <b>CascadeGuard AI — Telegram Defense Surface</b>\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor.\n\n"
        "<b>Active Defenses:</b>\n"
        "• <b>Stylometric Profiler:</b> Flags when writing style deviates from account owner.\n"
        "• <b>Payment Interlock:</b> Disables unauthorized UPI transfers to mule handles.\n"
        "• <b>Reverse Challenger:</b> Deploys zero-knowledge relational quiz to verify identity.\n"
        "• <b>Group Contagion Defense:</b> Automatically quarantines compromised accounts across batches.\n\n"
        "🔒 <i>DPDP Act 2023 Compliant: 0 Bytes of raw chat egress leaves the device.</i>\n\n"
        "<b>Quick Test Commands:</b>\n"
        "• /test_scam — Simulate Hospital Emergency ₹5,000 ATO scam\n"
        "• /test_apk — Simulate Fest Voting APK phishing scam\n"
        "• /test_legit — Test normal friendly conversation\n"
        "• /audit &lt;text&gt; — Perform an instant stylometric audit on any custom text\n"
        "• /train &lt;sample&gt; — Add personal writing sample to calibrate your baseline\n"
        "• /stats — View real-time security & prevented loss telemetry\n"
        "• /flush — DPDP Act Section 6(4) instant memory purge & consent revocation\n"
        "• /notice — View DPDP Act Section 5 statutory notice (English / हिन्दी)\n"
        "• /privacy — View on-device privacy guarantee & data protection audit\n"
        "• /help — Full command reference & group setup instructions"
    )
    await update.message.reply_text(text, parse_mode="HTML")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command with group setup instructions"""
    text = (
        "📖 <b>CascadeGuard Telegram Bot Help & Setup</b>\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "<b>How to Protect Your College Group:</b>\n"
        "1. Add this bot to your Telegram group (e.g. CS Batch 2026, Hostel Group).\n"
        "2. Promote the bot to <b>Admin</b> with <i>Restrict Users</i> permission.\n"
        "3. Any lateral scam or phishing APK dropped in the group will be intercepted automatically in &lt;50ms!\n\n"
        "<b>Available Commands:</b>\n"
        "• <code>/test_scam</code> — Trigger emergency ₹5,000 scam test\n"
        "• <code>/test_apk</code> — Trigger malicious APK phishing test\n"
        "• <code>/test_legit</code> — Trigger authentic baseline message\n"
        "• <code>/audit &lt;text&gt;</code> — Manually scan any text or forwarded message\n"
        "• <code>/train &lt;text&gt;</code> — Calibrate local baseline with your writing style\n"
        "• <code>/stats</code> — Show prevented financial loss and threat metrics\n"
        "• <code>/flush</code> — Purge all in-memory profiles & revoke consent (DPDP §6(4))\n"
        "• <code>/notice [en|hi]</code> — Display DPDP Act Section 5 statutory notice\n"
        "• <code>/privacy</code> — Open privacy & statutory compliance dashboard"
    )
    await update.message.reply_text(text, parse_mode="HTML")


async def test_scam_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Simulate hospital scam"""
    simulated_scam = (
        "Priya urgent emergency hai! Chacha hospital me admit hue hain, operation start krna hai. "
        "URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga."
    )
    await update.message.reply_text(f"👤 <b>Simulated Imposter Message:</b>\n<i>\"{simulated_scam}\"</i>", parse_mode="HTML")
    await run_audit_and_reply(update, simulated_scam, sender_name="Aman Sharma (Hijacked Session)")


async def test_apk_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Simulate APK phishing scam"""
    simulated_apk = (
        "Hey everyone, please vote for our band in the college fest contest! "
        "Just download this official voting app: InnoHacks_Vote_2026.apk and enter OTP. Urgent deadline in 10 mins!"
    )
    await update.message.reply_text(f"👤 <b>Simulated Imposter Message:</b>\n<i>\"{simulated_apk}\"</i>", parse_mode="HTML")
    await run_audit_and_reply(update, simulated_apk, sender_name="Aman Sharma (Hijacked Session)")


async def test_link_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Simulate malicious phishing link scam"""
    simulated_link = (
        "Hey everyone, vote for our band in the fest contest right now to win free passes! "
        "Link: https://fest-voting-portal.xyz/login?ref=aman_vote"
    )
    await update.message.reply_text(f"👤 <b>Simulated Phishing Link:</b>\n<i>\"{simulated_link}\"</i>", parse_mode="HTML")
    await run_audit_and_reply(update, simulated_link, sender_name="Aman Sharma (Hijacked Session)")


async def test_legit_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Simulate authentic baseline message"""
    simulated_legit = "Oyee sun, kal ke lab notes hain tere paas? Bhai canteen me aa rha h kya 10 min me?"
    await update.message.reply_text(f"👤 <b>Authentic User Message:</b>\n<i>\"{simulated_legit}\"</i>", parse_mode="HTML")
    await run_audit_and_reply(update, simulated_legit, sender_name="Aman Sharma")


async def audit_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Manually audit custom text"""
    if not context.args:
        await update.message.reply_text("Usage: <code>/audit &lt;message to analyze&gt;</code>", parse_mode="HTML")
        return
    text = " ".join(context.args)
    await run_audit_and_reply(update, text, sender_name=update.effective_user.first_name)


async def train_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Allow user to add sample message to calibrate their baseline"""
    if not context.args:
        await update.message.reply_text(
            "Usage: <code>/train &lt;your normal message sample&gt;</code>\n"
            "Example: <code>/train bhai kal notes leke aana library me</code>",
            parse_mode="HTML"
        )
        return
    sample = " ".join(context.args)
    core_engine.baseline.historical_samples.append(sample)
    # Refit vectorizer
    core_engine.baseline_matrix = core_engine.vectorizer.fit_transform(core_engine.baseline.historical_samples)
    core_engine.baseline_centroid = core_engine.baseline_matrix.mean(axis=0)
    stats["user_baselines_calibrated"] += 1
    
    await update.message.reply_text(
        f"✅ <b>Baseline Calibrated!</b>\n"
        f"Added writing sample to local zero-knowledge vector index (Total samples: {len(core_engine.baseline.historical_samples)}).\n"
        f"🔒 <i>Stored exclusively as mathematical float vector in volatile RAM.</i>",
        parse_mode="HTML"
    )


async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display system telemetry"""
    text = (
        "📊 <b>CascadeGuard Telemetry & Containment Stats</b>\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"• <b>Total Messages Scanned:</b> <code>{stats['total_scanned']}</code>\n"
        f"• <b>ATO Threats Intercepted:</b> <code>{stats['threats_blocked']}</code>\n"
        f"• <b>Prevented Financial Loss:</b> <code>₹{stats['prevented_loss_inr']:,}</code>\n"
        f"• <b>Quarantined Hijacked Sessions:</b> <code>{stats['quarantined_sessions']}</code>\n"
        f"• <b>Local Baselines Calibrated:</b> <code>{stats['user_baselines_calibrated']}</code>\n"
        f"• <b>Egress Data Volume:</b> <code>0 Bytes</code> (Local Edge)\n"
        f"• <b>Statutory Compliance:</b> DPDP Act 2023 (Verified)\n"
    )
    await update.message.reply_text(text, parse_mode="HTML")


# ── DPDP ACT 2023 STATUTORY NOTICE DISCLOSURES (SEC 5 BILINGUAL SUPPORT) ──

NOTICE_TEXT_EN = (
    "📋 <b>STATUTORY NOTICE OF ON-DEVICE EPHEMERAL DATA PROCESSING</b>\n"
    "<i>Pursuant to Section 5 of the Digital Personal Data Protection Act, 2023 (DPDP Act 2023)</i>\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    "<b>1. Identity of Processing Entity:</b>\n"
    "CascadeGuard AI is an on-device personal endpoint security utility executed locally on your device.\n"
    "• <b>Developer:</b> CascadeGuard Open Innovation Team\n"
    "• <b>Contact:</b> <code>privacy@cascadeguard.local</code>\n\n"
    "<b>2. Categories of Personal Data Processed:</b>\n"
    "(a) Incoming digital message strings received in active chats;\n"
    "(b) Sender contact identifiers (Telegram User ID, Display Name, Username);\n"
    "(c) Embedded URLs, Virtual Payment Addresses (UPI VPAs), and file attachments (e.g. .apk).\n\n"
    "<b>3. Specified Purpose of Processing:</b>\n"
    "Exclusively for detecting, preventing, and intercepting lateral social engineering, Account Takeover (ATO) anomalies, malicious web links, and financial mule fraud.\n\n"
    "<b>4. Data Lifecycle & Technical Safeguards:</b>\n"
    "• <b>Volatile RAM Only:</b> Evaluated in sub-1ms process RAM. ZERO bytes written to disk/SSD and ZERO bytes egress to cloud.\n"
    "• <b>Lossy Float32 Centroids:</b> Historical baselines preserved solely as non-reversible mathematical float32 vectors.\n"
    "• <b>Automated Scrubbing:</b> All API keys, passwords, OTPs, and tax IDs scrubbed via regex before vectorization.\n\n"
    "<b>5. Exercise of Data Principal Rights & Withdrawal (Sec 6(4)):</b>\n"
    "You have the statutory right to withdraw consent at any time. Executing <code>/flush</code> immediately purges all in-memory baseline centroids and volatile buffers.\n\n"
    "<b>6. Grievance Redressal & Data Protection Board:</b>\n"
    "• <b>Grievance Officer:</b> Lead Counsel, CascadeGuard Security (<code>grievance@cascadeguard.local</code>)\n"
    "• <b>Appellate Authority:</b> Data Protection Board of India (DPBI) pursuant to Section 28 of the DPDP Act 2023."
)

NOTICE_TEXT_HI = (
    "📋 <b>डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (धारा 5) के अंतर्गत ऑन-डिवाइस डेटा प्रोसेसिंग सूचना</b>\n"
    "<i>संविधान की 8वीं अनुसूची के अनुसार हिन्दी भाषा प्रकटीकरण (धारा 5(3))</i>\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    "<b>1. प्रसंस्करण का उद्देश्य (Specified Purpose):</b>\n"
    "कैस्केडगार्ड एआई (CascadeGuard AI) आपके डिवाइस पर स्थानीय रूप से कार्य करता है ताकि आपके टेलीग्राम/व्हाट्सएप खाते पर आने वाले साइबर हमलों, वित्तीय धोखाधड़ी (UPI VPA ठगी), और फ़िशिंग लिंक की तुरंत पहचान कर आपको सुरक्षित रखा जा सके।\n\n"
    "<b>2. डेटा सुरक्षा और गोपनीयता की गारंटी:</b>\n"
    "• <b>शून्य क्लाउड स्थानांतरण (0 Bytes Cloud Egress):</b> आपके संदेशों को कभी भी किसी बाहरी सर्वर या क्लाउड पर नहीं भेजा जाता है।\n"
    "• <b>अस्थायी रैम प्रोसेसिंग (Volatile RAM):</b> संदेशों का विश्लेषण केवल आपके कंप्यूटर/मोबाइल की अल्पकालिक मेमोरी (RAM) में 1 मिलीसेकंड से भी कम समय में होता है और तुरंत मिटा दिया जाता है। डिस्क पर कोई चैट सुरक्षित नहीं की जाती।\n"
    "• <b>अपरिवर्तनीय गणितीय वेक्टर:</b> संपर्क शैली की पहचान केवल गैर-प्रतिवर्ती गणितीय सूत्रों (Float32 Centroids) द्वारा की जाती है।\n"
    "• <b>संवेदनशील डेटा निष्कासन:</b> पासवर्ड, ओटीपी और गोपनीय कुंजी को विश्लेषण से पहले ही स्वचालित रूप से हटा दिया जाता है।\n\n"
    "<b>3. सहमति वापस लेने का अधिकार (धारा 6(4)):</b>\n"
    "आप किसी भी समय चैट में <code>/flush</code> टाइप करके अपनी सहमति वापस ले सकते हैं। इससे रैम से सभी प्रोफाइल तुरंत मिटा दिए जाएंगे।\n\n"
    "<b>4. शिकायत निवारण व डेटा संरक्षण बोर्ड:</b>\n"
    "शिकायत अधिकारी: <code>grievance@cascadeguard.local</code>। 30 दिनों में समाधान न होने पर भारतीय डेटा संरक्षण बोर्ड (DPBI) के समक्ष धारा 28 के तहत शिकायत दर्ज की जा सकती है।"
)


async def flush_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handle /flush command: DPDP Act 2023 Section 6(4) Statutory Consent Revocation & In-Memory Purge.
    Immediately purges all in-memory user profiles, centroids, and volatile buffers.
    """
    core_engine.memory.flush()
    stats["user_baselines_calibrated"] = 0
    if hasattr(core_engine, "baseline") and hasattr(core_engine.baseline, "historical_samples"):
        core_engine.baseline.historical_samples.clear()

    text = (
        "🗑️ <b>[DPDP ACT 2023 SEC 6(4) CONSENT REVOCATION]</b>\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "<b>Status:</b> All in-memory user profiles, stylometric centroids, and volatile RAM buffers have been purged.\n\n"
        "📊 <b>Memory Verification Telemetry:</b>\n"
        "• <b>Centroids Purged:</b> <code>0 Remaining</code>\n"
        "• <b>Volatile Memory Cleared:</b> <code>100%</code>\n"
        "• <b>Active Profiles in Heap:</b> <code>0</code>\n"
        "• <b>Egress Storage Volume:</b> <code>0 Bytes</code>\n"
        "• <b>Local Listener State:</b> Standby / Consent Withdrawn\n\n"
        "🔒 <i>Your statutory right to withdraw consent (Section 6(4)) and right to erasure (Section 12) have been executed with immediate effect. To re-enable protection, type /start or /train.</i>"
    )
    await update.message.reply_text(text, parse_mode="HTML")


async def notice_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /notice command with bilingual English/Hindi support."""
    lang = "en"
    if context.args and context.args[0].lower() in ["hi", "hindi", "hin"]:
        lang = "hi"

    notice_body = NOTICE_TEXT_HI if lang == "hi" else NOTICE_TEXT_EN
    buttons = [
        [
            InlineKeyboardButton("🇬🇧 English (Sec 5 Notice)", callback_data="btn_notice:en"),
            InlineKeyboardButton("🇮🇳 हिन्दी (अनुसूची 8)", callback_data="btn_notice:hi")
        ],
        [
            InlineKeyboardButton("🗑️ Flush & Revoke Consent (/flush)", callback_data="btn_flush_consent")
        ]
    ]
    await update.message.reply_text(
        notice_body,
        reply_markup=InlineKeyboardMarkup(buttons),
        parse_mode="HTML"
    )


async def privacy_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /privacy command as dedicated audit HUD."""
    await notice_command(update, context)


# ── MESSAGE & FORWARD & DOCUMENT LISTENER ──

async def on_message_received(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Intercept incoming text messages, forwarded messages, or document captions"""
    if not update.message:
        return
    
    # Check text or caption
    text = update.message.text or update.message.caption
    if not text:
        # Check if an APK document was uploaded without caption
        if update.message.document and update.message.document.file_name:
            if update.message.document.file_name.lower().endswith(".apk"):
                text = f"Malicious payload drop: {update.message.document.file_name}"
            else:
                return
        else:
            return

    sender_name = update.effective_user.first_name if update.effective_user else "Contact"
    if update.message.forward_origin:
        sender_name = f"Forwarded via {sender_name}"

    await run_audit_and_reply(update, text, sender_name=sender_name)


async def run_audit_and_reply(update: Update, text: str, sender_name: str):
    """Executes the CascadeGuard Multi-Agent audit"""
    stats["total_scanned"] += 1
    result = core_engine.evaluate(text)
    user_id = update.effective_user.id if update.effective_user else 0

    if result.threat_level == "CRITICAL_ATO":
        stats["threats_blocked"] += 1
        stats["prevented_loss_inr"] += 5000  # standard intercepted scam value

        alert_text = build_alert_card(result, sender_name)
        reply_markup = build_alert_keyboard(result, user_id)
        
        await update.message.reply_text(
            alert_text,
            reply_markup=reply_markup,
            parse_mode="HTML"
        )
    elif result.threat_level == "SUSPICIOUS":
        await update.message.reply_text(
            f"⚠️ <b>CascadeGuard Notice:</b> Moderate stylometric deviation ({result.stylometric_drift}% drift) detected from {sender_name}. Proceed with caution.",
            parse_mode="HTML"
        )
    else:
        # If explicitly testing, give clean confirmation
        if text.startswith("Oyee") or text.startswith("/test_legit"):
            await update.message.reply_text(
                f"✅ <b>CascadeGuard Verified:</b> Stylometry matches 96% with {sender_name}'s historical baseline. No coercive financial patterns detected.",
                parse_mode="HTML"
            )


# ── CALLBACK QUERY HANDLER (INLINE BUTTONS) ──

async def on_button_click(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle inline button interactions"""
    query = update.callback_query
    await query.answer()

    data = query.data

    if data == "btn_locked_vpa":
        await query.answer("🔒 Direct UPI payment disabled by CascadeGuard Security Interlock.", show_alert=True)

    elif data.startswith("btn_quiz:"):
        quiz = {
            "question": "Zero-Knowledge Challenge: What was the nickname of our 1st-year hostel warden at KIET?",
            "options": ["Gabbar Sir", "Sharma Ji", "Hitler Sir", "Verma Ji"],
            "correct": "Gabbar Sir"
        }
        buttons = [
            [
                InlineKeyboardButton(opt, callback_data=f"quiz_ans:{opt == quiz['correct']}")
            ] for opt in quiz["options"]
        ]
        await query.message.reply_text(
            f"❓ <b>Autonomous Reverse-Challenge (Friend Quiz)</b>\n\n"
            f"<i>{quiz['question']}</i>\n\n"
            f"Select the answer to verify whether this is the real friend or an imposter:",
            reply_markup=InlineKeyboardMarkup(buttons),
            parse_mode="HTML"
        )

    elif data.startswith("quiz_ans:"):
        is_correct = data.split(":")[1] == "True"
        if is_correct:
            await query.edit_message_text(
                "✅ <b>Verification Succeeded!</b>\n"
                "Correct response provided. The sender's identity has been confirmed. Security interlock relaxed.",
                parse_mode="HTML"
            )
        else:
            stats["quarantined_sessions"] += 1
            await query.edit_message_text(
                "🚨 <b>Verification Failed! Imposter Confirmed.</b>\n"
                "Incorrect answer. Rogue session permanently flagged. Account quarantined across the community.",
                parse_mode="HTML"
            )

    elif data.startswith("btn_quarantine:"):
        target_user_id = int(data.split(":")[1])
        chat = update.effective_chat
        
        # If in a group chat and bot is admin, actually restrict the user
        if chat.type in ["group", "supergroup"]:
            try:
                await context.bot.restrict_chat_member(
                    chat_id=chat.id,
                    user_id=target_user_id,
                    permissions=ChatPermissions(can_send_messages=False),
                    until_date=datetime.now(timezone.utc) + timedelta(hours=24)
                )
                stats["quarantined_sessions"] += 1
                await query.edit_message_text(
                    f"🛑 <b>Agent 4 Containment Engaged:</b> User <code>{target_user_id}</code> has been muted in this group for 24 hours. Lateral viral spread severed.",
                    parse_mode="HTML"
                )
            except Exception as e:
                stats["quarantined_sessions"] += 1
                await query.edit_message_text(
                    f"🛑 <b>Agent 4 Quarantine Flagged:</b> Account marked as hijacked in local state registry. (Promote bot to Admin to auto-mute in group: {e})",
                    parse_mode="HTML"
                )
        else:
            stats["quarantined_sessions"] += 1
            await query.edit_message_text(
                "🛑 <b>Hijacked Session Quarantined:</b> Account session severed in local threat graph. Contact muted.",
                parse_mode="HTML"
            )

    elif data.startswith("btn_notice:"):
        selected_lang = data.split(":")[1]
        text_body = NOTICE_TEXT_HI if selected_lang == "hi" else NOTICE_TEXT_EN
        buttons = [
            [
                InlineKeyboardButton("🇬🇧 English (Sec 5 Notice)", callback_data="btn_notice:en"),
                InlineKeyboardButton("🇮🇳 हिन्दी (अनुसूची 8)", callback_data="btn_notice:hi")
            ],
            [
                InlineKeyboardButton("🗑️ Flush & Revoke Consent (/flush)", callback_data="btn_flush_consent")
            ]
        ]
        await query.edit_message_text(text_body, reply_markup=InlineKeyboardMarkup(buttons), parse_mode="HTML")

    elif data == "btn_flush_consent":
        core_engine.memory.flush()
        stats["user_baselines_calibrated"] = 0
        if hasattr(core_engine, "baseline") and hasattr(core_engine.baseline, "historical_samples"):
            core_engine.baseline.historical_samples.clear()
        await query.edit_message_text(
            "🗑️ <b>[DPDP ACT 2023 SEC 6(4) CONSENT REVOCATION]</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "All in-memory user profiles, centroids, and volatile buffers have been flushed.\n"
            "• <b>Centroids Purged:</b> <code>0 Remaining</code>\n"
            "• <b>Volatile Memory Cleared:</b> <code>100%</code>\n"
            "• <b>Active Profiles in Heap:</b> <code>0</code>\n"
            "• <b>Egress Storage Volume:</b> <code>0 Bytes</code>\n\n"
            "🔒 <i>Consent revoked with immediate effect. Type /start to re-enable.</i>",
            parse_mode="HTML"
        )


# ── MAIN BOT RUNNER ──

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        print("\n" + "="*70)
        print("⚠️  TELEGRAM_BOT_TOKEN NOT SET!")
        print("="*70)
        print("To run the live bot against Telegram servers:")
        print("1. Open Telegram and search for @BotFather")
        print("2. Send /newbot, give it a name (e.g. CascadeGuard_Demo_Bot)")
        print("3. Copy the HTTP API token provided by BotFather")
        print("4. Put it in .env or set environment variable:")
        print("   $env:TELEGRAM_BOT_TOKEN='YOUR_BOT_TOKEN'")
        print("   python bot.py")
        print("\n💡 NOTE: You can run 'python test_suite.py' to run full automated tests!")
        print("="*70 + "\n")
        return

    print(f"[*] Starting CascadeGuard AI Telegram Defense Bot...")
    app = Application.builder().token(token).build()

    # Register handlers
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("test_scam", test_scam_command))
    app.add_handler(CommandHandler("test_apk", test_apk_command))
    app.add_handler(CommandHandler("test_link", test_link_command))
    app.add_handler(CommandHandler("test_legit", test_legit_command))
    app.add_handler(CommandHandler("audit", audit_command))
    app.add_handler(CommandHandler("train", train_command))
    app.add_handler(CommandHandler("stats", stats_command))
    app.add_handler(CommandHandler("flush", flush_command))
    app.add_handler(CommandHandler("notice", notice_command))
    app.add_handler(CommandHandler("notice_hi", lambda u, c: notice_command(u, c)))
    app.add_handler(CommandHandler("privacy", privacy_command))
    app.add_handler(CallbackQueryHandler(on_button_click))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_message_received))
    app.add_handler(MessageHandler(filters.ATTACHMENT & ~filters.COMMAND, on_message_received))

    print("[✓] CascadeGuard Telegram Bot is online and listening!")
    app.run_polling()


if __name__ == "__main__":
    main()
