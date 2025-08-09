from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import os

app = Flask(__name__)
CORS(app)  # Erlaubt Cross-Origin-Requests (wichtig für Browserzugriff vom Frontend)

@app.route('/upload', methods=['POST'])
def upload_audio_url():
    data = request.get_json()
    audio_url = data.get('url')

    if not audio_url:
        return jsonify({'error': 'No URL received'}), 400

    # Logging der URL mit Zeitstempel
    timestamp = datetime.datetime.now().isoformat()
    log_entry = f"[{timestamp}] Received voice: {audio_url}\n"

    with open('voice_log.txt', 'a') as f:
        f.write(log_entry)

    print(log_entry.strip())  # Ausgabe im Terminal

    return jsonify({'message': 'Voice received successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
