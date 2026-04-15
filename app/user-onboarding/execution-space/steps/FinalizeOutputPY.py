import json
import sys
import os
from datetime import datetime, UTC


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

    output_path = os.path.join(run_path, "02_llm_artifact.json")
    user_registry_path = os.path.join(run_path, "01_user_registry.json")

    start_time = datetime.now()
    print(f"[START] FinalizeOutputPY at {start_time.strftime('%H:%M:%S')}")

    if not os.path.exists(user_registry_path):
        write_error(run_path, f"Missing user registry artifact: {user_registry_path}")

    try:
        with open(user_registry_path, "r", encoding="utf-8") as f:
            user_registry = json.load(f)
    except Exception as e:
        write_error(run_path, f"Failed to read user registry artifact: {e}")

    items = user_registry.get("items", [])
    if not isinstance(items, list):
        write_error(run_path, "Invalid user registry artifact: items must be a list")

    output = {
        "artifact_type": "llm_render_payload",
        "artifact_version": "1.0",
        "render_target": "onboarding_complete",
        "data": {
            "user_registry_ref": "01_user_registry.json",
            "available_items": items,
            "research_command": "echo-m13-research-modus"
        },
        "meta": {
            "stage": "onboarding_complete",
            "timestamp": datetime.now(UTC).isoformat()
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