import json
import sys
import requests
from pathlib import Path


def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def main():
    if len(sys.argv) < 2:
        print("Usage: python ReverseGeocodePY.py <run_path>")
        sys.exit(1)

    run_path = Path(sys.argv[1])

    input_file = run_path / "03_geocode.json"
    output_file = run_path / "04_reverse_geocode.json"

    data = read_json(input_file)

    lat = data.get("lat")
    lon = data.get("lon")

    if lat is None or lon is None:
        raise ValueError("Missing lat/lon in 03_geocode.json")

    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "lat": lat,
        "lon": lon,
        "format": "json",
        "addressdetails": 1
    }

    headers = {
        "User-Agent": "m-pathy-geocoder"
    }

    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        raise Exception("Reverse geocoding failed")

    result = response.json()
    address = result.get("address", {})

    output = {
        "coordinates": {
            "lat": lat,
            "lon": lon
        },
        "location": {
            "city": address.get("city") or address.get("town"),
            "state": address.get("state"),
            "postcode": address.get("postcode"),
            "country": address.get("country"),
            "country_code": address.get("country_code")
        }
    }

    write_json(output_file, output)

    print("Reverse geocoding complete")


if __name__ == "__main__":
    main()