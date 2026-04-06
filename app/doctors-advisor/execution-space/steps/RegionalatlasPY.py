def classify_region(location):
    city = location.get("city", "")
    state = location.get("state", "")
    country = location.get("country", "")

    # --- Density ---
    urban_cities = [
        "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main",
        "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen",
        "Bremen", "Dresden", "Hannover", "Nürnberg"
    ]

    if city in urban_cities:
        density = "urban_high_density"
    else:
        density = "unknown"

    # --- Region Type (alle Bundesländer) ---
    developed_states = [
        "Baden-Württemberg",
        "Bayern",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hessen",
        "Mecklenburg-Vorpommern",
        "Niedersachsen",
        "Nordrhein-Westfalen",
        "Rheinland-Pfalz",
        "Saarland",
        "Sachsen",
        "Sachsen-Anhalt",
        "Schleswig-Holstein",
        "Thüringen"
    ]

    if state in developed_states:
        region_type = "developed_region"
    else:
        region_type = "unknown"

    # --- Regulatory ---
    if country in ["Deutschland", "Germany"]:
        regulatory = "eu_regulated"
    else:
        regulatory = "unknown"

    return {
        "density": density,
        "region_type": region_type,
        "regulatory_zone": regulatory
    }