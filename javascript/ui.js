import { API_KEY, BASE_URL } from './movies.js';

const infoTrailer = document.querySelector("#info-trailer");
const modalPlayBtn = document.querySelector("#modal-play-btn");
// Don't forget you need your API constants if they aren't imported here!


// 1. Mobile Tools
const mobileToolsBtn = document.getElementById('mobileToolsBtn');
const desktopRightIcons = document.querySelector('.desktop-right-icons');
if (mobileToolsBtn && desktopRightIcons) {
    mobileToolsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        desktopRightIcons.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!mobileToolsBtn.contains(e.target) && !desktopRightIcons.contains(e.target)) {
            desktopRightIcons.classList.remove('active');
        }
    });
}

// 2. Header Scroll
let lastScrollTop = 0;
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop && currentScroll > 70) {
            header.classList.add('hide-header');
        } else {
            header.classList.remove('hide-header');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// 3. Search Overlay
const searchBtn = document.getElementById('searchBar-Btn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const overlaySearchInput = document.getElementById('overlaySearchInput');

if (searchBtn && searchOverlay && closeSearchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.add('active');
        setTimeout(() => { overlaySearchInput.focus(); }, 100);
    });
    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        overlaySearchInput.value = '';
    });
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) searchOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
}

// 4. Dark Mode
const modeBtn = document.querySelector(".mode");
const buttonModeIcon = document.querySelector("#button-mode i");
if (modeBtn && buttonModeIcon) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        buttonModeIcon.className = "fa-solid fa-sun";
    }
    modeBtn.addEventListener('click', () => {
        document.body.classList.toggle("dark-theme");
        if (document.body.classList.contains("dark-theme")) {
            buttonModeIcon.className = "fa-solid fa-sun";
            localStorage.setItem("theme", "dark");
        } else {
            buttonModeIcon.className = "fa-solid fa-moon";
            localStorage.setItem("theme", "light");
        }
    });
}

// 5. Notifications UI
const notifToggle = document.getElementById('notifToggle');
const notifDropdown = document.getElementById('notifDropdown');
const markReadBtn = document.getElementById('markReadBtn');

if (notifToggle && notifDropdown && markReadBtn) {
    notifToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) profileDropdown.classList.remove('active');
    });
    notifDropdown.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => {
        if (!notifToggle.contains(e.target)) notifDropdown.classList.remove('active');
    });
    markReadBtn.addEventListener('click', () => {
        const notifBadge = document.getElementById('notifBadge');
        notifBadge.style.display = 'none';
        notifBadge.textContent = '0';
        document.querySelectorAll('.notif-item.unread').forEach(item => item.classList.remove('unread'));
    });
}

export function loadSavedNotifications() {
    const savedData = localStorage.getItem('streamz_notifs');
    const notifList = document.querySelector('.notif-list');
    const notifBadge = document.getElementById('notifBadge');

    if (savedData) {
        // If they have saved notifications, load them!
        const notifData = JSON.parse(savedData);
        if (notifList) notifList.innerHTML = notifData.html;

        if (notifBadge) {
            notifBadge.textContent = notifData.badgeCount;
            notifBadge.style.display = notifData.badgeDisplay;
        }
    } else {
        // THE FIX: If they are logged in but have NO notifications, clear the "Sign in" text!
        if (notifList) {
            notifList.innerHTML = `<p style="text-align: center; color: gray; font-size: 12px; margin-top: 10px;">No new notifications.</p>`;
        }
        if (notifBadge) {
            notifBadge.style.display = 'none';
        }
    }
}

// 6. Games Modal
const gamesNavBtn = document.getElementById('gamesNavBtn');
const gamesModal = document.getElementById('gamesModal');
const closeGamesBtn = document.getElementById('closeGamesBtn');
const notifyGamesBtn = document.getElementById('notifyGamesBtn');

if (gamesNavBtn && gamesModal && closeGamesBtn && notifyGamesBtn) {
    if (localStorage.getItem('streamz_games_notify') === 'true') {
        notifyGamesBtn.textContent = '✓ You are on the list!';
        notifyGamesBtn.style.backgroundColor = 'var(--primary)';
        notifyGamesBtn.style.color = 'white';
        notifyGamesBtn.style.pointerEvents = 'none';
    }
    gamesNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        gamesModal.classList.add('active');
    });
    closeGamesBtn.addEventListener('click', () => gamesModal.classList.remove('active'));
    gamesModal.addEventListener('click', (e) => {
        if (e.target === gamesModal) gamesModal.classList.remove('active');
    });
    notifyGamesBtn.addEventListener('click', () => {
        notifyGamesBtn.textContent = '✓ You are on the list!';
        notifyGamesBtn.style.backgroundColor = 'var(--primary)';
        notifyGamesBtn.style.color = 'white';
        notifyGamesBtn.style.pointerEvents = 'none';
        localStorage.setItem('streamz_games_notify', 'true');
        alert("You're on the list! We'll ping you when the arcade opens.");
        setTimeout(() => gamesModal.classList.remove('active'), 500);
    });
}

// 7. Movie Description Modal
const Movie_description_container = document.querySelector(".Movie_description_container");
const close_descBtn = document.querySelector("#close-modal-btn");
const info_img = document.querySelector("#info-img");
let description_title = document.querySelector(".description_title");
let descrip_paragraph = document.querySelector(".descrip_paragraph");
let release = document.querySelector(".release");

// movie description


export function OpenInfoModal(movieData) {
    // 1. Grab our new DOM elements
    const infoRating = document.querySelector("#info-rating");
    const infoGenres = document.querySelector("#info-genres");
    const infoCast = document.querySelector("#info-cast");
    const infoTrailer = document.querySelector("#info-trailer");

    // 2. Set the basic data we already have from the first API call
    if (description_title) description_title.textContent = movieData.title || movieData.name;
    if (descrip_paragraph) descrip_paragraph.textContent = movieData.overview || "No description available for this title.";

    let date = movieData.release_date || movieData.first_air_date || 'Unknown';
    if (release) release.textContent = `Released: ${date}`;

    // Round the rating to one decimal place (e.g., 8.4)
    if (infoRating) infoRating.textContent = movieData.vote_average ? (Math.round(movieData.vote_average * 10) / 10) : '0.0';

    // Set temporary loading text so the UI feels fast while we fetch the rest
    if (infoGenres) infoGenres.textContent = "Loading genres...";
    if (infoCast) infoCast.textContent = "Loading actors...";

    // 3. Reset the media view (Show image, hide video)
    if (info_img) {
        info_img.src = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
        info_img.style.display = 'block';
    }
    if (infoTrailer) {
        infoTrailer.style.display = 'none';
        infoTrailer.src = "";
    }

    // 4. THE MAGIC TRICK: Fetch the deeper details (Genres & Cast) instantly
    // We figure out if it's a TV show or Movie based on if it has a "name" or "title"
    const mediaType = movieData.name ? 'tv' : 'movie';
    const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${movieData.id}?api_key=6a29b492761e52181b5f197d0fc3de66&append_to_response=credits`;

    fetch(detailsUrl)
        .then(response => response.json())
        .then(data => {
            // Map out the genres and join them with a bullet point
            if (infoGenres) {
                if (data.genres && data.genres.length > 0) {
                    infoGenres.textContent = data.genres.map(genre => genre.name).join(' • ');
                } else {
                    infoGenres.textContent = "Genres unknown";
                }
            }

            // Map out the cast, but only slice the first 5 top actors so it doesn't overflow!
            if (infoCast) {
                if (data.credits && data.credits.cast.length > 0) {
                    infoCast.textContent = data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
                } else {
                    infoCast.textContent = "Cast information unavailable.";
                }
            }
        })
        .catch(error => {
            console.error("Failed to fetch detailed movie info:", error);
            if (infoGenres) infoGenres.textContent = "Genres unavailable";
            if (infoCast) infoCast.textContent = "Actors unavailable";
        });

    // 5. Grab a FRESH copy of the button every time the modal opens
    let currentPlayBtn = document.querySelector("#modal-play-btn");

    if (currentPlayBtn) {
        let newPlayBtn = currentPlayBtn.cloneNode(true);
        currentPlayBtn.parentNode.replaceChild(newPlayBtn, currentPlayBtn);

        newPlayBtn.textContent = "▶ Watch Trailer";


        // 6. Add the click event to play the trailer
        newPlayBtn.addEventListener('click', async () => {
            newPlayBtn.textContent = "Loading...";

            let fetchUrl = movieData.name
                ? `https://api.themoviedb.org/3/tv/${movieData.id}/videos?api_key=6a29b492761e52181b5f197d0fc3de66`
                : `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=6a29b492761e52181b5f197d0fc3de66`;

            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();
                const trailer = data.results.find(video => video.site === "YouTube" && video.type === "Trailer");

                if (trailer) {
                    info_img.style.display = 'none';
                    if (infoTrailer) {
                        infoTrailer.style.display = 'block';
                        infoTrailer.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
                    }
                    newPlayBtn.textContent = "▶ Watch Trailer";
                } else {
                    newPlayBtn.textContent = "No Trailer Available";
                }
            } catch (error) {
                console.error("Failed to fetch trailer:", error);
                newPlayBtn.textContent = "Error Loading Trailer";
            }
        });
    }

    if (Movie_description_container) Movie_description_container.classList.add('active');
}

// MODAL CLOSE LOGIC (Replace your bottom lines with this)


// 1. When they click the "X" button
if (close_descBtn) {
    close_descBtn.addEventListener('click', () => {
        Movie_description_container.classList.remove('active');
        if (infoTrailer) infoTrailer.src = ""; // Kills the video!
    });
}

// 2. When they click the dark blurred background
if (Movie_description_container) {
    Movie_description_container.addEventListener('click', (event) => {
        if (event.target === Movie_description_container) {
            Movie_description_container.classList.remove('active');
            if (infoTrailer) infoTrailer.src = ""; // Kills the video here too!
        }
    });
}

if (Movie_description_container) {
    Movie_description_container.addEventListener('click', (event) => {
        if (event.target === Movie_description_container) {
            Movie_description_container.classList.remove('active');
        }
    });
}