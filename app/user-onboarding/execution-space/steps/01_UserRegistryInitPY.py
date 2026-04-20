# execution-space/steps/01_UserRegistryInitPY.py

import json
import os
import sys
from datetime import UTC, datetime

if len(sys.argv) < 2:
    print("Missing run_path")
    exit(1)

RUN_DIR = sys.argv[1]
os.makedirs(RUN_DIR, exist_ok=True)

INPUT_PATH = os.path.join(RUN_DIR, "01_input.json")
OUTPUT_PATH = os.path.join(RUN_DIR, "01_user_registry.json")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../"))
REGISTRY_PATH = os.path.join(BASE_DIR, "registry", "registry.json")

def load_json(path):
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def get_wall_entries(registry):
    return [
        entry["id"]
        for entry in registry["registry"]["entries"]
        if entry.get("ui", {}).get("ui_surface") == "wall"
        and entry.get("state") == "active"
    ]


def build_initial_registry(registry):
    wall_ids = get_wall_entries(registry)

    return {
        "meta": {
            "initialized": True,
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat()
        },
        "items": wall_ids
    }


def repair_registry(user_registry, registry):
    valid_ids = set(get_wall_entries(registry))
    current_ids = set(user_registry.get("items", []))

    missing_ids = list(valid_ids - current_ids)

    if missing_ids:
        user_registry["items"].extend(missing_ids)

    user_registry["items"] = [
        item for item in user_registry["items"] if item in valid_ids
    ]

    user_registry["meta"]["updated_at"] = datetime.now(UTC).isoformat()
    return user_registry


def main():
    registry = load_json(REGISTRY_PATH)

    if registry is None:
        raise Exception("registry.json not found")

    input_data = load_json(INPUT_PATH)

    if input_data is None:
        user_registry = build_initial_registry(registry)
    else:
        base_registry = build_initial_registry(registry)
        user = input_data.get("user", {})

        base_registry["profile"] = {
            "name": user.get("name"),
            "tone": user.get("tone")
        }

        base_registry["security"] = {
            "public_key": user.get("public_key")
        }

        base_registry["infrastructure"] = {
            "server": user.get("server"),
            "status": "none"
        }

        user_registry = repair_registry(base_registry, registry)

    save_json(OUTPUT_PATH, user_registry)

    print("STEP 01 COMPLETE: user_registry initialized")


if __name__ == "__main__":
    main()