import { auth, provider, db } from './firebase-setup.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";
import { setMyList, updateMyListUI } from './movies.js';
import { loadSavedNotifications } from './ui.js';

export let currentUser = null;

const profileToggle = document.getElementById('profileToggle');
const profileDropdown = document.getElementById('profileDropdown');
const defaultProfileIcon = document.getElementById('defaultProfileIcon');
const userAvatar = document.getElementById('userAvatar');
const loggedOutState = document.getElementById('loggedOutState');
const loggedInState = document.getElementById('loggedInState');
const userNameDisplay = document.getElementById('userNameDisplay');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (profileToggle && profileDropdown) {
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');

        const notifDropdown = document.getElementById('notifDropdown');
        if (notifDropdown) notifDropdown.classList.remove('active');

    });
    profileDropdown.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
        if (!profileToggle.contains(e.target)) profileDropdown.classList.remove('active');
    });
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        if (defaultProfileIcon) defaultProfileIcon.style.display = 'none';
        if (userAvatar) {
            userAvatar.style.display = 'block';
            userAvatar.src = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
        }
        if (loggedOutState) loggedOutState.style.display = 'none';
        if (loggedInState) loggedInState.style.display = 'block';

        loadSavedNotifications();

        let displayName = user.displayName ? user.displayName.split(' ')[0] : "JohnDoe";
        if (userNameDisplay) userNameDisplay.textContent = `Welcome, ${displayName}!`;

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            setMyList(docSnap.data().savedMovies || []);
        } else {
            await setDoc(userRef, { savedMovies: [] });
            setMyList([]);
        }
        updateMyListUI();
    } else {
        currentUser = null;
        if (defaultProfileIcon) defaultProfileIcon.style.display = 'block';
        if (userAvatar) {
            userAvatar.style.display = 'none';
            userAvatar.src = '';
        }
        if (loggedOutState) loggedOutState.style.display = 'block';
        if (loggedInState) loggedInState.style.display = 'none';

        setMyList([]);
        updateMyListUI();

        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.innerHTML = '+';
            btn.style.backgroundColor = 'white';
            btn.style.color = 'black';
        });

        const notifBadge = document.getElementById('notifBadge');
        if (notifBadge) notifBadge.style.display = 'none';
        const notifList = document.querySelector('.notif-list');
        if (notifList) {
            notifList.innerHTML = `<p style="text-align: center; color: gray; font-size: 12px; margin-top: 10px;">Sign in to see your notifications.</p>`;
        }
    }
});

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        try { await signInWithPopup(auth, provider); }
        catch (error) { console.error("Login failed:", error.message); }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try { await signOut(auth); }
        catch (error) { console.error("Logout failed:", error.message); }
    });
}