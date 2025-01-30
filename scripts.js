// Function to navigate between pages
function navigateToPage(page) {
    if (page === 2) {
        window.location.href = 'Uploadpage.html';
    } else if (page === 3) {
        window.location.href = 'Ransom message.html'; // Navigate to encrypted files page
    }
}

// Function to handle file uploads
function uploadFiles() {
    const files = document.getElementById('folderInput').files;
    const formData = new FormData();
    for (let file of files) {
        formData.append('files[]', file);
    }

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === "Files uploaded successfully") {
                navigateToPage(2); // Navigate to the upload page
            }
        })
        .catch(err => console.error(err));
}

// Function to encrypt files and navigate to the encrypted files page
function encryptFiles() {
    const files = document.getElementById('folderInput').files;
    if (files.length === 0) {
        alert("Please upload a folder with files first.");
        return;
    }

    // Simulate encryption by saving the names of files in localStorage
    const encryptedFiles = [...files].map(file => file.name);
    localStorage.setItem("encryptedFiles", JSON.stringify(encryptedFiles));

    alert("Files encrypted successfully!");
    navigateToPage(3); // Navigate to the encrypted files page
}

// Function to open decryption popup (removed, as decryption is no longer needed)
function openDecryptPopup() {
    // Removed as decryption is no longer needed
    // document.getElementById('decryptPopup').style.display = 'block';
}

// Function to generate the key using password and salt (Scrypt equivalent)
// Removed the decryption key generation and PBKDF2 for decryption
// async function generateKey(password, salt) { ... }  // Removed

// Function to handle file uploads and decryption (removed decryption logic)
async function decryptFiles() {
    const decryptKey = document.getElementById('decryptKey').value; // Get the decryption key from input
    const encryptedFiles = document.getElementById('encryptedFilesInput').files;

    if (!decryptKey) {
        alert("Please enter the decryption key.");
        return;
    }

    if (encryptedFiles.length === 0) {
        alert("Please upload at least one encrypted file.");
        return;
    }

    for (let file of encryptedFiles) {
        // Decryption logic removed
    }
}

// Function to decrypt an individual file (removed)
async function decryptFile(encryptedFile, decryptKey) {
    // Removed function body
}

// Function to decrypt the data using AES-GCM (removed)
async function performDecryption(encryptedData, decryptKey) {
    // Removed function body
}

// Function to generate the key using PBKDF2 (Password-based key derivation) - removed
async function generateKey(password, salt) {
    // Removed function body
}
