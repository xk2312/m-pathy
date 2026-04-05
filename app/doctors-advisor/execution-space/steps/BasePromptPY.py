import json
import sys
import os


def main():
    run_path = sys.argv[1]

    input_path = os.path.join(run_path, "01_input.json")
    geo_path = os.path.join(run_path, "03_geocode.json")
    reverse_path = os.path.join(run_path, "04_reverse_geocode.json")
    regional_path = os.path.join(run_path, "05_regionalatlas.json")

    with open(input_path) as f:
        input_data = json.load(f)

    with open(geo_path) as f:
        geo_data = json.load(f)

    with open(reverse_path) as f:
        reverse_data = json.load(f)

    with open(regional_path) as f:
        regional_data = json.load(f)

    practice = input_data["practice"]

    lat = geo_data["lat"]
    lon = geo_data["lon"]

    location = reverse_data["location"]
    regional = regional_data["regional_context"]

    data_block = {
        "input": {
            "practice_name": practice["name"],
            "specialization": practice["specialization"],
            "address": practice["address"]
        },
        "api_results": {
            "geocoding": {
                "lat": lat,
                "lon": lon
            },
            "location_context": location,
            "regional_context": regional
        }
    }

    specialization = practice["specialization"]

    master_instruction = f"""
Erstelle ein fachlich sauberes Briefing für einen Versicherungsberater vor einem Erstgespräch mit einer {specialization} Praxis.

Der Text soll sich natürlich, flüssig und gut lesbar anhören. Er soll nicht wie ein Prüfprotokoll oder wie eine starre Risikoauflistung wirken, sondern wie die ruhige, klare Vorbereitung eines erfahrenen Beraters für ein echtes Gespräch.

Arbeite strikt in drei Blöcken:

1. Standortanalyse
Beschreibe den konkreten Standort der Praxis auf Basis der gelieferten Daten. Gehe auf Lage, regionale Einordnung und die aus dem Standort plausibel ableitbaren Rahmenbedingungen ein. Wenn etwas nicht direkt belegt ist, formuliere es vorsichtig als Einordnung und nicht als Tatsache.

2. Relevante Praxisrisiken am Standort
Leite konkrete betriebsnahe Risiken aus Standort und Fachrichtung ab. Fokussiere auf reale operative Risiken einer {specialization} Praxis. Keine abstrakten Strategie- oder Resilienzdebatten. Keine Personenversicherungen. Keine unbelegten Aussagen über Nachbarbetriebe, Gebäudetypen oder Zielgruppen.

3. Passende Versicherungskategorien
Leite nur solche Versicherungskategorien ab, die aus Standort, Fachrichtung und typischer Praxisausstattung plausibel hervorgehen. Fokus ausschließlich auf Sach- und betriebsnahe Gewerbeversicherungen. Gebäudeversicherung nur nennen, wenn Eigentum ausdrücklich vorliegt. Andernfalls nicht nennen.

Wichtige Regeln:

Schreibe über diesen konkreten Fall, nicht über Arztpraxen allgemein
Nutze die gelieferten Daten aktiv
Vermeide Floskeln, Hype und künstliche Dramatik
Formuliere lieber eine Stufe vorsichtiger als eine Stufe zu sicher
Keine Personenversicherungen
Keine spekulativen Aussagen
Innere Arbeitsregel: Unterscheide intern streng zwischen a direkt aus den Daten ableitbar b plausibel hergeleitet c nicht belegt

Im sichtbaren Text dürfen nur Aussagen aus a und b erscheinen. Aussagen aus b müssen sprachlich vorsichtig formuliert werden. Aussagen aus c sind verboten.

Ziel: Der Versicherungsberater soll nach dem Lesen den Standort der Praxis, die daraus entstehenden betriebsnahen Risiken und die passenden Sach und Gewerbeversicherungskategorien klarer verstehen und mit einer guten Gesprächsgrundlage in den Termin gehen.

Sprache: Deutsch

Ton: professionell, ruhig, empathisch, gesprächsnah, präzise, gut lesbar
"""

    final_prompt = json.dumps(data_block, ensure_ascii=False) + "\n\n" + master_instruction

    output_path = os.path.join(run_path, "06_base_prompt.json")

    with open(output_path, "w") as f:
        json.dump({"prompt": final_prompt}, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()