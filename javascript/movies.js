import { db } from './firebase-setup.js';
import { currentUser } from './auth.js';
import { OpenInfoModal } from './ui.js';
import { doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

export const API_KEY = '6a29b492761e52181b5f197d0fc3de66';
export const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const HeroImgPath = 'https://image.tmdb.org/t/p/original';

export let MyList = [];
export function setMyList(newList) { MyList = newList; }

export async function getMovies(url, sliderId) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        showMovies(data.results, sliderId);
    } catch (error) {
        console.error("Oops, failed to fetch movies:", error);
    }
}

export function showMovies(movies, sliderId) {
    const slider = document.querySelector(sliderId);
    if (!slider) return;

    movies.forEach((movie) => {
        let images = IMG_PATH + `${movie.poster_path}`;
        let movieTitle = movie.title || movie.name;
        const isAlreadySaved = MyList.find(savedMovie => savedMovie.id === movie.id);

        const btnIcon = isAlreadySaved ? '✓' : '+';
        const btnBg = isAlreadySaved ? 'var(--primary)' : 'white';
        const btnTextCol = isAlreadySaved ? 'var(--lighttext)' : 'black';

        let newDiv = document.createElement("div");
        newDiv.classList.add("movie-card");
        newDiv.innerHTML = `
            <img src="${images}" alt= "${movieTitle}">
            <div class = "card-info">
                <h4> ${movieTitle} </h4>
                <div class="card-actions">
                    <button class="action-btn play-btn">▶ Trailer</button>
                    <button class="action-btn add-btn" data-id="${movie.id}" style="background-color: ${btnBg}; color: ${btnTextCol}">${btnIcon}</button>
                </div>
            </div>
        `;
        slider.appendChild(newDiv);

        const playBtn = newDiv.querySelector('.play-btn');
        const addBtn = newDiv.querySelector('.add-btn');
        const cardPoster = newDiv.querySelector('img');
        cardPoster.style.cursor = 'pointer';

        cardPoster.addEventListener('click', () => OpenInfoModal(movie));

        addBtn.addEventListener('click', async () => {
            if (!currentUser) {
                alert("Please sign in to save movies to your list!");
                return;
            }
            const isAlreadyInList = MyList.find(savedMovie => savedMovie.id === movie.id);
            if (!isAlreadyInList) {
                MyList.push(movie);
                updateMyListUI();
                const matchingButtons = document.querySelectorAll(`.add-btn[data-id="${movie.id}"]`);
                matchingButtons.forEach(btn => {
                    btn.innerHTML = '✓';
                    btn.style.backgroundColor = "var(--primary)";
                    btn.style.color = "var(--lighttext)";
                });
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, { savedMovies: arrayUnion(movie) });
                } catch (error) { console.error("Error saving to cloud:", error); }
            } else {
                alert(`${movieTitle} is already in your list!`);
            }
        });

        playBtn.addEventListener('click', async () => {
            let fetchUrl = movie.name 
                ? `${BASE_URL}/tv/${movie.id}/videos?api_key=${API_KEY}` 
                : `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`;
            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();
                const trailer = data.results.find(video => video.site === "YouTube" && video.type === "Trailer");
                if (trailer) {
                    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                } else {
                    alert("Sorry, no trailer available for this title!");
                }
            } catch (error) { console.error("Failed to fetch trailer:", error.message); }
        });
    });
}

export async function getHeroMovie(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const randomIndex = Math.floor((Math.random() * data.results.length));
        let randomMovie = data.results[randomIndex];

        let heroBoard = document.querySelector('#hero-board');
        let heroTitle = document.querySelector('#hero-title');
        let heroDesc = document.querySelector('#hero-desc');

        if(heroTitle) heroTitle.textContent = randomMovie.original_title || randomMovie.name;
        if(heroDesc) heroDesc.textContent = (randomMovie.overview?.length > 100) ? randomMovie.overview.substr(0, 99) + "..." : randomMovie.overview;
        if(heroBoard) heroBoard.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%), url(${HeroImgPath + randomMovie.backdrop_path})`;

        const playBillboard = document.querySelector("#hero-section-btnI");
        const MoreInfoBillboard = document.querySelector("#hero-section-btnII");

        if (playBillboard && MoreInfoBillboard) {
            playBillboard.addEventListener("click", async () => {
                let Bill_url = randomMovie.name ? `${BASE_URL}/tv/${randomMovie.id}/videos?api_key=${API_KEY}` : `${BASE_URL}/movie/${randomMovie.id}/videos?api_key=${API_KEY}`;
                try {
                    const vidresponse = await fetch(Bill_url);
                    const viddata = await vidresponse.json();
                    const trailer = viddata.results.find(video => video.site === "YouTube" && video.type === "Trailer");
                    if (trailer) window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                    else alert("Sorry, no trailer available for this title!");
                } catch (error) { console.error(error); }
            });
            MoreInfoBillboard.addEventListener("click", () => OpenInfoModal(randomMovie));
        }
    } catch (error) { console.error("Oops, failed to fetch hero movie:", error); }
}

export function updateMyListUI() {
    const myListContent = document.getElementById('myListContent');
    if(!myListContent) return;
    myListContent.innerHTML = '';

    if (MyList.length === 0) {
        myListContent.innerHTML = `<p class="empty-list-text">Your list is currently empty.</p>`;
        localStorage.setItem("streamz_saved_movies", JSON.stringify(MyList));
        return;
    }

    MyList.forEach((savedMovie, index) => {
        let MyListedImages = IMG_PATH + savedMovie.poster_path;
        let MylistedTitle = savedMovie.title || savedMovie.name;
        let MyListedContainer = document.createElement("div");
        MyListedContainer.classList.add('mini-card');
        MyListedContainer.innerHTML = `
         <img src="${MyListedImages}" alt="${MylistedTitle}">
            <div class="mini-card-info">
                <h4>${MylistedTitle}</h4>
                <button class="remove-btn">Remove</button>
            </div>
        `;
        myListContent.appendChild(MyListedContainer);

        const removeBtn = MyListedContainer.querySelector('.remove-btn');
        removeBtn.addEventListener('click', async () => {
            const removedMovieId = MyList[index].id;
            const removedMovieObject = MyList[index];

            MyList.splice(index, 1);
            updateMyListUI();

            const matchingButtons = document.querySelectorAll(`.add-btn[data-id="${removedMovieId}"]`);
            matchingButtons.forEach(btn => {
                btn.innerHTML = '+';
                btn.style.backgroundColor = 'white';
                btn.style.color = 'black';
            });

            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, { savedMovies: arrayRemove(removedMovieObject) });
                } catch (error) { console.error("Error removing from cloud:", error); }
            }
        });
    });
    localStorage.setItem("streamz_saved_movies", JSON.stringify(MyList));
}

export function loadSavedList() {
    let storedData = localStorage.getItem("streamz_saved_movies");
    if (storedData !== null) {
        let parseArray = JSON.parse(storedData);
        if (Array.isArray(parseArray)) setMyList(parseArray);
        else setMyList([]);
    } else {
        setMyList([]);
    }
    updateMyListUI();
}

// My List Panel Toggles
const myListPanel = document.getElementById('myListPanel');
const openMyListBtn = document.getElementById('openMyListBtn');
const closeListBtn = document.getElementById('closeListBtn');
if(openMyListBtn && myListPanel) openMyListBtn.addEventListener('click', (e) => { e.preventDefault(); myListPanel.classList.add('active'); });
if(closeListBtn && myListPanel) closeListBtn.addEventListener('click', () => myListPanel.classList.remove('active'));