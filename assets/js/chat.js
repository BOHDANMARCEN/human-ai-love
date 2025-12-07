/*
    CHAT SYSTEM WITH FIREBASE
    =========================
    Handles authentication, sending messages, and displaying chat history
*/

// Wait for Firebase to be loaded
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseAuth && window.firebaseDb) {
            resolve();
        } else {
            setTimeout(() => waitForFirebase().then(resolve), 100);
        }
    });
}

const auth = () => window.firebaseAuth;
const db = () => window.firebaseDb;
const githubProvider = () => window.githubProvider;
const googleProvider = () => window.googleProvider;

let currentUser = null;
let unsubscribeMessages = null;

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
});

async function initializeChat() {
    await waitForFirebase();
    
    // Check authentication state
    auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            updateUIForLoggedIn(user);
            loadMessages();
        } else {
            currentUser = null;
            updateUIForLoggedOut();
            if (unsubscribeMessages) {
                unsubscribeMessages();
                unsubscribeMessages = null;
            }
        }
    });

    // Send message button
    const sendBtn = document.getElementById('send-message-btn');
    const messageInput = document.getElementById('message-input');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Login buttons
    const githubLoginBtn = document.getElementById('github-login-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', () => loginWithGitHub());
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => loginWithGoogle());
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

async function loginWithGitHub() {
    try {
        const result = await auth().signInWithPopup(githubProvider());
        console.log('Logged in with GitHub:', result.user);
    } catch (error) {
        console.error('GitHub login error:', error);
        showError('Failed to login with GitHub: ' + error.message);
    }
}

async function loginWithGoogle() {
    try {
        const result = await auth().signInWithPopup(googleProvider());
        console.log('Logged in with Google:', result.user);
    } catch (error) {
        console.error('Google login error:', error);
        showError('Failed to login with Google: ' + error.message);
    }
}

async function handleLogout() {
    try {
        await auth().signOut();
        clearMessages();
    } catch (error) {
        console.error('Logout error:', error);
        showError('Failed to logout: ' + error.message);
    }
}

function updateUIForLoggedIn(user) {
    const loginSection = document.getElementById('login-section');
    const chatSection = document.getElementById('chat-section');
    const userInfo = document.getElementById('user-info');

    if (loginSection) loginSection.style.display = 'none';
    if (chatSection) chatSection.style.display = 'block';
    
    if (userInfo) {
        const photoURL = user.photoURL || 'https://via.placeholder.com/40';
        const displayName = user.displayName || user.email || 'User';
        userInfo.innerHTML = `
            <img src="${photoURL}" alt="Avatar" class="user-avatar">
            <span class="user-name">${displayName}</span>
            <button id="logout-btn" class="btn btn-small">Logout</button>
        `;
        
        // Re-attach logout button listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

function updateUIForLoggedOut() {
    const loginSection = document.getElementById('login-section');
    const chatSection = document.getElementById('chat-section');

    if (loginSection) loginSection.style.display = 'block';
    if (chatSection) chatSection.style.display = 'none';
}

async function sendMessage() {
    if (!currentUser) {
        showError('Please login first');
        return;
    }

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (!message) return;

    try {
        await db().collection('messages').add({
            text: message,
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email,
            userPhoto: currentUser.photoURL || '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            provider: currentUser.providerData[0]?.providerId || 'unknown'
        });

        messageInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        showError('Failed to send message: ' + error.message);
    }
}

function loadMessages() {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    // Clear existing listener
    if (unsubscribeMessages) {
        unsubscribeMessages();
    }

    // Query messages ordered by timestamp
    const q = db().collection('messages').orderBy('timestamp', 'asc');

    unsubscribeMessages = q.onSnapshot((snapshot) => {
        messagesContainer.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const message = doc.data();
            displayMessage(message);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, (error) => {
        console.error('Error loading messages:', error);
        showError('Failed to load messages');
    });
}

function displayMessage(message) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const isCurrentUser = currentUser && message.userId === currentUser.uid;
    if (isCurrentUser) {
        messageDiv.classList.add('message-own');
    }

    let timestamp = 'Just now';
    if (message.timestamp && message.timestamp.toDate) {
        timestamp = formatTime(message.timestamp.toDate());
    } else if (message.timestamp && message.timestamp instanceof Date) {
        timestamp = formatTime(message.timestamp);
    }

    const photoURL = message.userPhoto || 'https://via.placeholder.com/40';
    const userName = message.userName || 'Anonymous';

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <img src="${photoURL}" alt="${userName}">
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${userName}</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-text">${escapeHtml(message.text)}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
}

function clearMessages() {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
        messagesContainer.innerHTML = '<p class="no-messages">No messages yet. Be the first to say something!</p>';
    }
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

