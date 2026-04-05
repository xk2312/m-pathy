import json
import sys
import os
import re
from datetime import datetime

def write_error(run_path, message):
    error_path = os.path.join(run_path, "error_log.json")

    error_data = {
        "run_id": os.path.basename(run_path),
        "status": "error",
        "errors": [
            {
                "stage": "ValidateInputPY",
                "code": "input_invalid",
                "message": message,
                "timestamp": datetime.utcnow().isoformat()
            }
        ]
    }

    with open(error_path, "w", encoding="utf-8") as f:
        json.dump(error_data, f, ensure_ascii=False, indent=2)

    sys.exit(1)

def main():
    if len(sys.argv) != 2:
        print("Usage: python ValidateInputPY.py <run_path>")
        sys.exit(1)

    run_path = sys.argv[1]

    input_path = os.path.join(run_path, "01_input.json")
    output_path = os.path.join(run_path, "02_validated_input.json")

    if not os.path.exists(input_path):
        write_error(run_path, "01_input.json not found")

    try:
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        write_error(run_path, "Invalid JSON format in input file")

    # Validate structure
    try:
        practice = data["practice"]
        name = practice["name"]
        specialization = practice["specialization"]
        address = practice["address"]
        street = address["street"]
        postal_code = address["postal_code"]
        city = address["city"]
        country = address["country"]
    except Exception:
        write_error(run_path, "Missing required fields")

    # Validate values
    if not all([
        isinstance(name, str) and name.strip(),
        isinstance(specialization, str) and specialization.strip(),
        isinstance(street, str) and street.strip(),
        isinstance(postal_code, str) and postal_code.strip(),
        isinstance(city, str) and city.strip(),
        isinstance(country, str) and country.strip()
    ]):
        write_error(run_path, "Fields must be non empty strings")

    if not re.fullmatch(r"\d{5}", postal_code):
        write_error(run_path, "postal_code must be exactly 5 digits")

    if country != "Deutschland":
        write_error(run_path, "country must be 'Deutschland'")

    validated_output = {
        "practice": {
            "name": name.strip(),
            "specialization": specialization.strip(),
            "address": {
                "street": street.strip(),
                "postal_code": postal_code,
                "city": city.strip(),
                "country": "Deutschland"
            }
        }
    }

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(validated_output, f, ensure_ascii=False, indent=2)
    except Exception:
        write_error(run_path, "Failed to write output file")

    sys.exit(0)

if __name__ == "__main__":
    main()