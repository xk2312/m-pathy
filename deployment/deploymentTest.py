import os
from openai import AzureOpenAI

# API-Daten
endpoint = "https://mutah-me71x3km-eastus2.openai.azure.com/"
api_key = os.getenv("AZURE_OPENAI_KEY")  # vorher: export AZURE_OPENAI_KEY="dein_api_key"
api_version = "2024-08-01-preview"

client = AzureOpenAI(
    api_key=api_key,
    api_version=api_version,
    azure_endpoint=endpoint
)

# Anfrage
response = client.chat.completions.create(
    model="m-core-mini",  # Deployment-Name
    messages=[
        {"role": "system", "content": "You are M."},
        {"role": "user", "content": "Sag mir, ob das hier funktioniert hat."}
    ],
    temperature=0.7
)

# Korrekte Ausgabe mit .content
print(response.choices[0].message.content)
