import json
import sys
import os
import requests


def main():
    run_path = sys.argv[1]

    base_prompt_path = os.path.join(run_path, "06_base_prompt.json")
    first_call_path = os.path.join(run_path, "07_first_call_output.json")

    with open(base_prompt_path) as f:
        base_prompt_data = json.load(f)

    with open(first_call_path) as f:
        first_call_data = json.load(f)

    full_prompt = base_prompt_data["prompt"]
    first_response = first_call_data["response"]

    # Split data block and instruction
    split_index = full_prompt.find("\n\n")
    data_block = full_prompt[:split_index]

    challenge_instruction = f"""
    Du erhältst einen bestehenden Beratungstext sowie die zugrunde liegenden Falldaten.

    Deine Aufgabe ist nicht, einen neuen Text zu schreiben, sondern die bestehende Fassung einer echten C6 Challenge zu unterziehen und sie anschließend präzise zu überarbeiten.

    Ziel der Überarbeitung:
    Der Text soll datenstrenger, ableitungsfester und fachlich sauberer werden, ohne an Struktur, Vollständigkeit, Lesbarkeit oder Gesprächsnähe zu verlieren.

    C6 Arbeitsmodus:
    Arbeite nicht kreativ.
    Arbeite nicht ausschmückend.
    Arbeite nicht werblich.
    Arbeite prüfend, verdichtend und korrektiv.
    Prüfe jede Aussage auf Datenbindung, Ableitungsstärke und unnötige Behauptungslast.

    Verbindliche Regeln:

    1. Behalte die bestehende Dreiteilung exakt bei:
    1. Standortanalyse
    2. Relevante Praxisrisiken am Standort
    3. Passende Versicherungskategorien

    2. Behalte die Überschriften, die Reihenfolge und die Grundlänge des Textes bei.

    3. Kürze den Text nicht substanziell.
    Der überarbeitete Text soll in etwa gleich lang bleiben und inhaltlich mindestens gleich vollständig sein.

    4. Schreibe den Text nicht von Grund auf neu.
    Überarbeite gezielt die bestehende Fassung.

    5. Prüfe jede einzelne Aussage intern streng nach drei Klassen:
    a direkt aus den Falldaten ableitbar
    b plausibel aus den Falldaten herleitbar
    c nicht belegt

    6. Aussagen der Klasse a dürfen stehen bleiben.

    7. Aussagen der Klasse b dürfen nur stehen bleiben, wenn sie sprachlich klar vorsichtig formuliert sind.

    8. Aussagen der Klasse c müssen entfernt oder durch eine strengere, datennähere Formulierung ersetzt werden.
    Es reicht nicht, sie nur minimal abzuschwächen.

    9. Prüfe insbesondere jede Risikoaussage hart:
    Wenn sie nicht direkt aus den Daten folgt oder nicht zwingend plausibel aus Standort, Fachrichtung und typischer betrieblicher Struktur herleitbar ist, darf sie nicht in der Endfassung bleiben.

    10. Prüfe jede Kausalität hart:
        Entferne oder entschärfe Aussagen, die so klingen, als sei ein Zusammenhang sicher belegt, obwohl er nur möglich oder naheliegend ist.

    11. Prüfe jeden Satz darauf, ob er nur allgemeines Branchenwissen wiederholt, ohne aus dem konkreten Fall zu folgen.
        Solche Aussagen sind zu entfernen oder enger auf den Fall zurückzuführen.

    12. Erfinde keine neuen Tatsachen.
        Füge nichts hinzu, das nicht direkt aus den Daten oder streng plausibel aus ihnen ableitbar ist.

    13. Behalte den Ton:
        professionell, ruhig, empathisch, gesprächsnah, präzise, gut lesbar.

    14. Keine Meta Kommentare.
        Keine Vorbemerkung.
        Keine Begründung der Änderungen.
        Gib ausschließlich die überarbeitete Endfassung zurück.

    Wichtige Priorität:
    Strenge vor Eleganz.
    Datennähe vor rhetorischer Schönheit.
    Korrektur vor Ausschmückung.

    Falldaten:
    {data_block}

    Bestehende Fassung:
    {first_response}
    """

    # Azure OpenAI Config
    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    api_key = os.environ.get("AZURE_OPENAI_API_KEY")
    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT")

    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions?api-version=2024-02-15-preview"

    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }

    body = {
        "messages": [
            {"role": "system", "content": "You are a precise and careful analyst."},
            {"role": "user", "content": challenge_instruction}
        ],
        "temperature": 0.2,
        "max_tokens": 1500
    }

    response = requests.post(url, headers=headers, json=body)
    result = response.json()

    try:
        output_text = result["choices"][0]["message"]["content"]
    except:
        output_text = str(result)

    output_path = os.path.join(run_path, "08_c6_challenge1.json")

    with open(output_path, "w") as f:
        json.dump({
            "challenge_prompt": challenge_instruction,
            "response_before": first_response,
            "response_after": output_text,
            "meta": {
                "model": deployment,
                "status_code": response.status_code
            }
        }, f, ensure_ascii=False, indent=2)

    print("C6 Challenge 1 complete")


if __name__ == "__main__":
    main()