from flask import Flask, request
import os

app = Flask(__name__)
UPLOAD_FOLDER = '/var/www/m-pathy/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'voice' not in request.files:
        return 'No file part', 400
    file = request.files['voice']
    file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    return 'File uploaded successfully', 200

app.run(host='0.0.0.0', port=5000)
