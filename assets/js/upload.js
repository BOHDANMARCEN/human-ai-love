/*
    FILE UPLOAD SYSTEM WITH FIREBASE STORAGE
    ========================================
    Handles file uploads with authentication
*/

// Wait for Firebase to be loaded
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseAuth && window.firebaseStorage) {
            resolve();
        } else {
            setTimeout(() => waitForFirebase().then(resolve), 100);
        }
    });
}

const auth = () => window.firebaseAuth;
const storage = () => window.firebaseStorage;

let currentUser = null;

// Initialize upload when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeUpload();
});

async function initializeUpload() {
    await waitForFirebase();
    
    // Check authentication state
    auth().onAuthStateChanged((user) => {
        currentUser = user;
        updateUploadUI(user);
        if (user) {
            loadUploadedFiles();
        }
    });

    // File input change handler
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const filePreview = document.getElementById('file-preview');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                displayFilePreview(file);
            }
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleUpload);
    }
}

function updateUploadUI(user) {
    const loginPrompt = document.getElementById('upload-login-prompt');
    const uploadForm = document.getElementById('upload-form');
    const userInfo = document.getElementById('upload-user-info');

    if (user) {
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (uploadForm) uploadForm.style.display = 'block';
        
        if (userInfo) {
            const photoURL = user.photoURL || 'https://via.placeholder.com/40';
            const displayName = user.displayName || user.email || 'User';
            userInfo.innerHTML = `
                <img src="${photoURL}" alt="Avatar" class="user-avatar">
                <span class="user-name">${displayName}</span>
            `;
        }
    } else {
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (uploadForm) uploadForm.style.display = 'none';
    }
}

function displayFilePreview(file) {
    const filePreview = document.getElementById('file-preview');
    if (!filePreview) return;

    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    const fileType = file.type || 'Unknown';

    filePreview.innerHTML = `
        <div class="file-preview-item">
            <div class="file-icon">📄</div>
            <div class="file-info">
                <div class="file-name">${escapeHtml(file.name)}</div>
                <div class="file-meta">${fileSize} MB • ${fileType}</div>
            </div>
        </div>
    `;
}

async function handleUpload() {
    if (!currentUser) {
        showError('Please login first');
        return;
    }

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        showError('Please select a file');
        return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
    }

    const uploadBtn = document.getElementById('upload-btn');
    const originalText = uploadBtn.textContent;
    
    try {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        // Create storage reference
        const timestamp = Date.now();
        const fileName = `${currentUser.uid}/${timestamp}_${file.name}`;
        const storageRef = storage().ref(`uploads/${fileName}`);

        // Upload file
        await storageRef.put(file);
        
        // Get download URL
        const downloadURL = await storageRef.getDownloadURL();

        showSuccess('File uploaded successfully!');
        
        // Clear form
        fileInput.value = '';
        const filePreview = document.getElementById('file-preview');
        if (filePreview) filePreview.innerHTML = '';

        // Reload file list
        loadUploadedFiles();

        // Add to uploaded files list
        addFileToList({
            name: file.name,
            url: downloadURL,
            size: file.size,
            type: file.type,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Upload error:', error);
        showError('Failed to upload file: ' + error.message);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = originalText;
    }
}

async function loadUploadedFiles() {
    if (!currentUser) return;

    const filesList = document.getElementById('uploaded-files-list');
    if (!filesList) return;

    try {
        filesList.innerHTML = '<p class="loading">Loading files...</p>';

        // List files in user's folder
        const userFolderRef = storage().ref(`uploads/${currentUser.uid}`);
        const result = await userFolderRef.listAll();

        if (result.items.length === 0) {
            filesList.innerHTML = '<p class="no-files">No files uploaded yet.</p>';
            return;
        }

        filesList.innerHTML = '';
        
        // Get metadata for each file
        for (const itemRef of result.items) {
            try {
                const url = await itemRef.getDownloadURL();
                const fileName = itemRef.name.split('/').pop();
                
                const fileDiv = document.createElement('div');
                fileDiv.className = 'uploaded-file-item';
                fileDiv.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <div class="file-name">${escapeHtml(fileName)}</div>
                    </div>
                    <a href="${url}" target="_blank" class="btn btn-small">Download</a>
                `;
                filesList.appendChild(fileDiv);
            } catch (error) {
                console.error('Error loading file:', error);
            }
        }
    } catch (error) {
        console.error('Error loading files:', error);
        filesList.innerHTML = '<p class="error">Failed to load files.</p>';
    }
}

function addFileToList(file) {
    const filesList = document.getElementById('uploaded-files-list');
    if (!filesList) return;

    // Remove "no files" message if present
    const noFilesMsg = filesList.querySelector('.no-files');
    if (noFilesMsg) noFilesMsg.remove();

    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file-item';
    fileDiv.innerHTML = `
        <div class="file-icon">📄</div>
        <div class="file-info">
            <div class="file-name">${escapeHtml(file.name)}</div>
        </div>
        <a href="${file.url}" target="_blank" class="btn btn-small">Download</a>
    `;
    filesList.insertBefore(fileDiv, filesList.firstChild);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

