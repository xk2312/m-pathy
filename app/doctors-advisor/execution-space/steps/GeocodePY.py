import json
import sys
import os
import requests
from datetime import datetime

def write_error(run_path, code, message):
    error_path = os.path.join(run_path, "error_log.json")

    error_data = {
        "run_id": os.path.basename(run_path),
        "status": "error",
        "errors": [
            {
                "stage": "GeocodePY",
                "code": code,
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
        print("Usage: python3 GeocodePY.py <run_path>")
        sys.exit(1)

    run_path = sys.argv[1]

    input_path = os.path.join(run_path, "02_validated_input.json")
    output_path = os.path.join(run_path, "03_geocode.json")

    if not os.path.exists(input_path):
        write_error(run_path, "processing_failed", "02_validated_input.json not found")

    try:
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        write_error(run_path, "processing_failed", "Invalid JSON in validated input")

    try:
        address = data["practice"]["address"]
        street = address["street"]
        postal_code = address["postal_code"]
        city = address["city"]
        country = address["country"]
    except Exception:
        write_error(run_path, "processing_failed", "Invalid structure in validated input")

    query = f"{street}, {postal_code} {city}, {country}"

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "addressdetails": 1,
        "limit": 1
    }

    headers = {
        "User-Agent": "m-pathy-geocoder/1.0"
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
    except Exception:
        write_error(run_path, "api_unreachable", "Geocoding API not reachable")

    if response.status_code != 200:
        write_error(run_path, "api_unreachable", f"HTTP {response.status_code}")

    try:
        results = response.json()
    except Exception:
        write_error(run_path, "processing_failed", "Invalid JSON from API")

    if not results or len(results) == 0:
        write_error(run_path, "api_empty", "No geocoding results")

    result = results[0]

    try:
        output = {
            "lat": float(result["lat"]),
            "lon": float(result["lon"]),
            "display_name": result.get("display_name"),
            "address": result.get("address", {}),
            "category": result.get("category"),
            "type": result.get("type"),
            "importance": result.get("importance")
        }
    except Exception:
        write_error(run_path, "processing_failed", "Failed to parse geocode result")

    if output["lat"] is None or output["lon"] is None:
        write_error(run_path, "output_invalid", "Missing coordinates")

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
    except Exception:
        write_error(run_path, "processing_failed", "Failed to write output")

    sys.exit(0)

if __name__ == "__main__":
    main()