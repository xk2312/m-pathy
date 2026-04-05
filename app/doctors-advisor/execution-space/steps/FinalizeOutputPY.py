import json
import sys
import os
import requests
from datetime import datetime


def write_error(run_path, code, message):
    error_path = os.path.join(run_path, "error.json")
    with open(error_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "status": "error",
                "stage": "finalize_output",
                "errors": [{"code": code, "message": message}]
            },
            f,
            ensure_ascii=False,
            indent=2
        )
    print(message)
    sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print("Usage: python FinalizeOutputPY.py <run_path>")
        sys.exit(1)

    run_path = sys.argv[1]

    input_path = os.path.join(run_path, "08_c6_challenge1.json")
    output_path = os.path.join(run_path, "10_finalize_output.json")

    start_time = datetime.now()
    print(f"[START] FinalizeOutputPY at {start_time.strftime('%H:%M:%S')}")

    if not os.path.exists(input_path):
        write_error(run_path, "input_invalid", "Missing 08_c6_challenge1.json")

    try:
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        write_error(run_path, "processing_failed", f"Failed to read input: {e}")

    final_text = data.get("response_after")

    if not final_text or not isinstance(final_text, str):
        write_error(run_path, "input_invalid", "Invalid or missing response_after")

    final_instruction = f"""
Du erhältst einen finalen Beratungstext für ein Erstgespräch mit einer medizinischen Praxis.

Deine Aufgabe:
Ergänze diesen Text am Ende um genau drei präzise, professionelle Einstiegsfragen für den Berater.

Wichtige Regeln:

1. Der bestehende Text darf in keiner Weise verändert werden.
2. Keine Umformulierungen, keine Kürzungen, keine Ergänzungen im bestehenden Text.

3. Die drei Fragen müssen:
- direkt an den Inhalt anschließen
- für ein reales Gespräch geeignet sein
- offen formuliert sein
- dem Berater helfen, das Gespräch zu öffnen

4. Stil:
- ruhig
- professionell
- präzise
- nicht verkäuferisch

5. Ausgabeformat:

**Mögliche Einstiegsfragen für das Beratungsgespräch**

- Frage 1
- Frage 2
- Frage 3

6. Keine Meta-Kommentare.
Keine Erklärung.

Gib ausschließlich:
→ den unveränderten Originaltext
→ gefolgt von den drei Fragen

Text:
{final_text}
"""

    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    api_key = os.environ.get("AZURE_OPENAI_API_KEY")
    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT")
    api_version = os.environ.get("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

    if not endpoint or not api_key or not deployment:
        write_error(run_path, "llm_failed", "Azure OpenAI config missing")

    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }

    body = {
        "messages": [
            {
                "role": "system",
                "content": "You are a precise assistant that strictly follows instructions and preserves given text exactly."
            },
            {
                "role": "user",
                "content": final_instruction
            }
        ],
        "temperature": 0.2,
        "max_tokens": 1200
    }

    try:
        response = requests.post(url, headers=headers, json=body, timeout=45)
    except Exception as e:
        write_error(run_path, "api_unreachable", str(e))

    if response.status_code != 200:
        write_error(run_path, "llm_failed", response.text)

    try:
        result = response.json()
        output_text = result["choices"][0]["message"]["content"]
    except Exception as e:
        write_error(run_path, "processing_failed", f"Failed to parse LLM response: {e}")

    output = {
        "final_text_with_questions": output_text,
        "meta": {
            "model": deployment,
            "status_code": response.status_code
        }
    }

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
    except Exception as e:
        write_error(run_path, "processing_failed", f"Failed to write output: {e}")

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"[END] FinalizeOutputPY in {duration:.2f}s")


if __name__ == "__main__":
    main()