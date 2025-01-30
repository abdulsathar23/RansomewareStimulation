from Cryptodome.Cipher import AES
import os

# Default key (must be 16 bytes for AES-128)
DEFAULT_KEY = b"mydefaultkey123"  # Replace this with a secure key in production

def unpad(data):
    """Remove padding from binary data."""
    padding_len = data[-1]
    if padding_len > AES.block_size:
        raise ValueError("Invalid padding detected")
    return data[:-padding_len]

def decrypt_pdf(input_encrypted_path, output_pdf_path, key=DEFAULT_KEY):
    """
    Decrypt an AES-encrypted file and save it as a PDF.
    
    :param input_encrypted_path: Path to the encrypted file
    :param output_pdf_path: Path to save the decrypted PDF
    :param key: 16-byte AES key (default: DEFAULT_KEY)
    """
    if not os.path.exists(input_encrypted_path):
        raise FileNotFoundError(f"Input file not found: {input_encrypted_path}")

    with open(input_encrypted_path, 'rb') as f:
        ciphertext = f.read()

    if len(ciphertext) <= 16:
        raise ValueError("Invalid encrypted file: insufficient data for decryption")

    # Extract IV and ciphertext
    iv = ciphertext[:16]
    encrypted_data = ciphertext[16:]

    # Initialize cipher
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(encrypted_data)

    try:
        plaintext = unpad(plaintext)
    except ValueError as e:
        raise ValueError(f"Decryption failed: {e}")

    # Save the decrypted content as a PDF
    with open(output_pdf_path, 'wb') as f:
        f.write(plaintext)

    print(f"PDF decrypted successfully: {output_pdf_path}")

if __name__ == "__main__":
    # Example usage: Decrypt an encrypted PDF file
    input_encrypted = "encrypted_file.aes"  # Replace with your encrypted file path
    output_pdf = "decrypted_example.pdf"  # Replace with your output PDF path
    try:
        decrypt_pdf(input_encrypted, output_pdf)
    except Exception as e:
        print(f"Error: {e}")
