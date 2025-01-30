from flask import Flask, request, send_from_directory, jsonify
from cryptography.fernet import Fernet
import os
import shutil
import tempfile

app = Flask(__name__)

# Temporary directory to store uploaded and encrypted files
TEMP_DIR = tempfile.mkdtemp()

# Generate a key for encryption and decryption
key = Fernet.generate_key()
cipher_suite = Fernet(key)

@app.route('/')
def home():
    return "Welcome to Ransomware Simulation and Defense API"

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files[]' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded_files = request.files.getlist('files[]')
    saved_files = []

    for file in uploaded_files:
        file_path = os.path.join(TEMP_DIR, file.filename)
        file.save(file_path)
        saved_files.append(file.filename)

    return jsonify({"message": "Files uploaded successfully", "files": saved_files})

@app.route('/encrypt', methods=['POST'])
def encrypt_files():
    encrypted_files = []

    for filename in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, filename)

        with open(file_path, 'rb') as file:
            encrypted_data = cipher_suite.encrypt(file.read())

        encrypted_file_path = file_path + ".enc"
        with open(encrypted_file_path, 'wb') as encrypted_file:
            encrypted_file.write(encrypted_data)

        os.remove(file_path)  # Remove original file
        encrypted_files.append(filename + ".enc")

    return jsonify({"message": "Files encrypted successfully", "files": encrypted_files})

@app.route('/decrypt', methods=['POST'])
def decrypt_files():
    decryption_key = request.json.get('key')
    
    if decryption_key != key.decode():  # Check if the key is correct
        return jsonify({"error": "Decryption failed, incorrect key"}), 400

    decrypted_files = []

    for filename in os.listdir(TEMP_DIR):
        if filename.endswith(".enc"):
            file_path = os.path.join(TEMP_DIR, filename)
            
            with open(file_path, 'rb') as encrypted_file:
                decrypted_data = cipher_suite.decrypt(encrypted_file.read())

            original_file_path = file_path.replace(".enc", "")
            with open(original_file_path, 'wb') as decrypted_file:
                decrypted_file.write(decrypted_data)

            os.remove(file_path)  # Remove encrypted file
            decrypted_files.append(original_file_path)

    return jsonify({"message": "Files decrypted successfully", "files": decrypted_files})

@app.route('/cleanup', methods=['POST'])
def cleanup():
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        os.makedirs(TEMP_DIR)  # Recreate directory for further uploads
    
    return jsonify({"message": "Temporary folder cleaned up"})

if __name__ == '__main__':
    app.run(debug=True)
