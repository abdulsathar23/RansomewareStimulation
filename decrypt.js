function decryptFiles() {
    // Get the selected files
    const files = document.getElementById('encryptedFilesInput').files;
    if (files.length === 0) {
        alert("Please select encrypted files first.");
        return;
    }
    let decryptedContent = '';
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(event) {
            const encryptedData = event.target.result;
            decryptedContent += `Decrypted content of ${file.name}:\n` + encryptedData + '\n\n';
            if (i === files.length - 1) {
                downloadDecryptedFile(decryptedContent, 'decrypted_ids.py');
            }
        };
        reader.readAsText(file);
    }
}
function downloadDecryptedFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
