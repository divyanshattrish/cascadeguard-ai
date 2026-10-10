"""
CascadeGuard AI - Telegram MTProto One-Time Session Login
Authenticates your personal Telegram client session using your API ID & HASH.
Saves 'cascadeguard_session.session' locally so the companion can run automatically.
"""

import os
import sys

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from dotenv import load_dotenv
load_dotenv()

from telethon import TelegramClient

api_id = os.getenv("TELEGRAM_API_ID")
api_hash = os.getenv("TELEGRAM_API_HASH")

if not api_id or not api_hash:
    print("[-] Error: TELEGRAM_API_ID or TELEGRAM_API_HASH missing in .env")
    sys.exit(1)

client = TelegramClient("cascadeguard_session", int(api_id), api_hash)

async def main():
    print("=" * 65)
    print("CASCADEGUARD AI — MTPROTO CLIENT ONE-TIME AUTHENTICATION")
    print("=" * 65)
    print("[*] Connecting to Telegram MTProto...")
    await client.start()
    me = await client.get_me()
    print("\n[✓] Successfully Authenticated as:")
    print(f"    • Name     : {me.first_name} {me.last_name or ''}")
    print(f"    • Username : @{me.username or 'No username set'}")
    print(f"    • Phone    : {me.phone}")
    print(f"    • User ID  : {me.id}")
    print("\n[✓] Session file 'cascadeguard_session.session' created successfully!")
    print("You can now run 'python mtproto_companion.py --live' in the background anytime.\n")

if __name__ == "__main__":
    with client:
        client.loop.run_until_complete(main())
