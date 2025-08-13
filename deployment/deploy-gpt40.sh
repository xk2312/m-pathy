#!/bin/bash
# Auto-Deploy GPT-4o in der ersten verfügbaren Region
# Benötigt: az CLI, eingeloggte Subscription, gesetzte Variablen OAI_NAME & RESOURCE_GROUP

# === SETTINGS ===
MODEL_NAME="gpt-4o"
MODEL_VERSION="2024-05-13"
MODEL_FORMAT="OpenAI"
DEPLOYMENT_NAME="gpt4o-full"
SKU="S0"    # Anpassen falls andere SKU nötig
CAPACITY=120

# Prüfen ob Variablen gesetzt sind
if [[ -z "$OAI_NAME" || -z "$RESOURCE_GROUP" ]]; then
  echo "❌ Bitte zuerst OAI_NAME und RESOURCE_GROUP als Umgebungsvariablen setzen!"
  echo "   Beispiel: export OAI_NAME='dein-account-name'"
  echo "             export RESOURCE_GROUP='deine-resource-group'"
  exit 1
fi

# Alle Regionen abrufen
REGIONS=$(az account list-locations --query "[].name" -o tsv)

echo "🔍 Suche nach GPT-4o in allen Regionen..."
FOUND_REGION=""
for region in $REGIONS; do
  MODELS=$(az cognitiveservices model list --location "$region" \
    --query "[?name!=null && contains(name, '$MODEL_NAME')].[name,version]" -o tsv)

  if [[ -n "$MODELS" ]]; then
    echo "✅ Gefunden in: $region -> $MODELS"
    FOUND_REGION="$region"
    break
  else
    echo "… nicht in $region"
  fi
done

if [[ -z "$FOUND_REGION" ]]; then
  echo "❌ Kein GPT-4o in deiner Subscription gefunden."
  exit 1
fi

echo "🚀 Starte Deployment in $FOUND_REGION..."
az cognitiveservices account deployment create \
  --name "$OAI_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --deployment-name "$DEPLOYMENT_NAME" \
  --model-name "$MODEL_NAME" \
  --model-version "$MODEL_VERSION" \
  --model-format "$MODEL_FORMAT" \
  --sku "$SKU" \
  --capacity "$CAPACITY" \
  --location "$FOUND_REGION"

if [[ $? -eq 0 ]]; then
  echo "🎯 GPT-4o erfolgreich deployed in $FOUND_REGION"
else
  echo "❌ Deployment fehlgeschlagen."
fi
