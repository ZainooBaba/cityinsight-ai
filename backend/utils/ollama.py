import httpx
import json

async def summarize_with_ollama(text: str) -> dict:
    prompt = f"""
You are an assistant that summarizes city council meeting transcripts.

Summarize this transcript in 3-5 sentences. Also list 3-5 key topics or issues discussed.

Transcript:
{text[:4000]}
"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": "mistral", "prompt": prompt, "stream": False},
                timeout=60
            )
            response.raise_for_status()
            result = response.json()
            return {"response": result.get("response", "").strip()}
    except Exception as e:
        return {"response": "", "error": str(e)}

# optional: also make sure this one is here too
async def extract_metadata_with_ollama(summary: str) -> dict:
    prompt = f"""
You are a helpful assistant that extracts structured information from city council summaries.

Given the summary below, extract:
- The city the meeting is about
- The department(s) involved
- 3 to 5 key topics or issues (each topic should be a single word or very short phrase)

Respond in this exact JSON format:
{{
  "city": "...",
  "department": "...",
  "topics": ["...", "..."]
}}

Summary:
{summary}
"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": "mistral", "prompt": prompt, "stream": False},
                timeout=60
            )
            response.raise_for_status()
            raw = response.json()
            result_text = raw.get("response", "")
            json_start = result_text.find("{")
            return json.loads(result_text[json_start:])
    except Exception as e:
        print("❌ Metadata extraction error:", str(e))
        return {}
