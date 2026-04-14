import json
import sys
import os
from datetime import datetime


def write_error(run_path, message):
    error_path = os.path.join(run_path, "error.json")
    with open(error_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "status": "error",
                "stage": "finalize_output",
                "message": message
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

    output_path = os.path.join(run_path, "10_finalize_output.json")

    start_time = datetime.now()
    print(f"[START] FinalizeOutputPY at {start_time.strftime('%H:%M:%S')}")

    # 🔥 USER REGISTRY (DEIN SYSTEM STATE)
    user_registry = {
    "items": [
        "settings",
        "archive",
        "new_chat",
        "csv_download",
        "json_download"
    ],
    "updated_at": datetime.utcnow().isoformat()
}

    # 🔥 FINAL TEXT (UI + USER GUIDANCE)
    final_text = """
Your system is now ready.

Your workspace has been initialized and your tools are available on the left.

To activate deeper analysis immediately, type:

echo-m13-research-modus
""".strip()

    output = {
        "final_text_with_questions": final_text,
        "user_registry": user_registry,
        "meta": {
            "stage": "onboarding_complete",
            "timestamp": datetime.utcnow().isoformat()
        }
    }

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
    except Exception as e:
        write_error(run_path, f"Failed to write output: {e}")

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"[END] FinalizeOutputPY in {duration:.2f}s")
    print("FinalizeOutput written:", output_path)


if __name__ == "__main__":
    main()