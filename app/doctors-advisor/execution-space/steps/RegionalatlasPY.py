import json
import sys
from pathlib import Path


def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def classify_region(location):
    city = location.get("city", "")
    state = location.get("state", "")
    country = location.get("country", "")

    if city == "München":
        density = "urban_high_density"
    else:
        density = "unknown"

    if state == "Bayern":
        region_type = "developed_region"
    else:
        region_type = "unknown"

    if country == "Deutschland":
        regulatory = "eu_regulated"
    else:
        regulatory = "unknown"

    return {
        "density": density,
        "region_type": region_type,
        "regulatory_zone": regulatory
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python RegionalatlasPY.py <run_path>")
        sys.exit(1)

    run_path = Path(sys.argv[1])

    input_file = run_path / "04_reverse_geocode.json"
    output_file = run_path / "05_regionalatlas.json"

    data = read_json(input_file)

    location = data.get("location", {})

    regional_data = classify_region(location)

    output = {
        "coordinates": data.get("coordinates"),
        "location": location,
        "regional_context": regional_data
    }

    write_json(output_file, output)

    print("Regional enrichment complete")


if __name__ == "__main__":
    main()