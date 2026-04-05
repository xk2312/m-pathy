import json
import sys
import os
import requests


def write_error(run_path, code, message):
    error_path = os.path.join(run_path, "error.json")
    with open(error_path, "w") as f:
        json.dump({
            "status": "error",
            "stage": "first_call",
            "errors": [{"code": code, "message": message}]
        }, f, indent=2)
    print(message)
    sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print("Usage: python FirstCallPY.py <run_path>")
        sys.exit(1)

    run_path = sys.argv[1]

    input_file = os.path.join(run_path, "06_base_prompt.json")
    output_file = os.path.join(run_path, "07_first_call_output.json")

    if not os.path.exists(input_file):
        write_error(run_path, "input_missing", "Missing 06_base_prompt.json")

    with open(input_file, "r") as f:
        data = json.load(f)

    prompt = data.get("prompt")

    if not prompt:
        write_error(run_path, "input_invalid", "Prompt missing")

    # === ENV CONFIG (aligned mit route.ts) ===
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-01")

    if not endpoint or not api_key or not deployment:
        write_error(run_path, "config_missing", "Azure OpenAI config missing")

    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }

    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are a precise, calm, professional analyst."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.4,
        "max_tokens": 1500
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=45)
    except Exception as e:
        write_error(run_path, "api_unreachable", str(e))

    if response.status_code != 200:
        write_error(run_path, "llm_failed", response.text)

    try:
        result = response.json()
        content = result["choices"][0]["message"]["content"]
    except Exception as e:
        write_error(run_path, "processing_failed", str(e))

    output = {
        "prompt": prompt,
        "response": content,
        "meta": {
            "model": deployment,
            "status_code": response.status_code
        }
    }

    with open(output_file, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("First LLM call complete")


if __name__ == "__main__":
    main()