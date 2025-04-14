import os
import json
import requests

SUPABASE_URL = "https://vjmjwkulzqdbjkkzzhxv.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbWp3a3VsenFkYmpra3p6aHh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU3Nzk0MywiZXhwIjoyMDYwMTUzOTQzfQ.6vSbQ8dX2_MadSN2CxsQOYUwrqDAc-ea9dUoPuAGNoo"


def save_to_supabase(user_id: str, file_name: str, summary: str, topics=None, city=None, department=None):
    url = f"{SUPABASE_URL}/rest/v1/summaries"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "user_id": user_id,
        "file_name": file_name,
        "summary": summary,
        "topics": topics or [],
        "city_detected": city,
        "department_detected": department,
    }

    print("📤 Supabase Payload:", json.dumps(payload, indent=2))
    try:
        response = requests.post(url, headers=headers, json=payload)
        print("📥 Supabase response:", response.status_code, response.text)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to save to Supabase: {e}")
