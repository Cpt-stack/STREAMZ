import './ui.js';
import './auth.js';
import { API_KEY, BASE_URL, getMovies, getHeroMovie, loadSavedList, showMovies } from './movies.js';


 // Search Logic
    const overlaySearchSubmit = document.querySelector("#overlaySearchSubmit");
    const overlaySearchInput = document.querySelector("#overlaySearchInput");
    const searchParagraph = document.querySelector(".search-placeholder-text");

    async function searchMovie() {
        const moviename = overlaySearchInput.value;
        if (!moviename) return;
        const SearchUrl = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${moviename}`;
        try {
            const response = await fetch(SearchUrl);
            const data = await response.json();
            const filteredResults = data.results.filter(item => item.media_type !== 'person');
            const resultsContainer = document.querySelector('#searchResults');
            if (resultsContainer) resultsContainer.innerHTML = '';
            showMovies(filteredResults, '#searchResults');
        } catch (error) {
            if (searchParagraph) searchParagraph.textContent = `${moviename} isn't available`;
        }
    }

    if (overlaySearchSubmit) overlaySearchSubmit.addEventListener("click", searchMovie);
    if (overlaySearchInput) {
        overlaySearchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                searchMovie();
            }
        });
    }

    // Load Local List Backup
    loadSavedList();

    // Endpoints
    const POPULAR_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
    const TOP_RATED_URL = BASE_URL + '/movie/top_rated?api_key=' + API_KEY;
    const ACTION_URL = BASE_URL + '/discover/movie?with_genres=28&api_key=' + API_KEY;
    const Suspenseful_Tv_URL = BASE_URL + '/discover/tv?with_genres=9648,80&sort_by=popularity.desc&api_key=' + API_KEY;
    const FAMILIAR_FAVOURITE_URL = BASE_URL + '/tv/popular?api_key=' + API_KEY;
    const tOP_10_Nollywood_Films_URL = BASE_URL + '/trending/tv/week?api_key=' + API_KEY;
    const WAR_POLITICS_URL = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10768`;
    const Award_winning_BingeWorthy_URL = BASE_URL + '/discover/tv?with_genres=80&sort_by=vote_average.desc&vote_count.gte=500&api_key=' + API_KEY;
    const BingeWorthy_Spanish_Series_URL = BASE_URL + '/discover/tv?with_original_language=es&sort_by=popularity.desc&api_key=' + API_KEY;
    const Captivating_Acclaimed_URL = BASE_URL + '/discover/tv?sort_by=vote_average.desc&vote_count.gte=1000&api_key=' + API_KEY;
    const New_Url = BASE_URL + '/movie/now_playing?api_key=' + API_KEY;
    const TALK_SHOWS_URL = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10767`;

    // Fetch Content
    getHeroMovie(POPULAR_URL);
    getMovies(POPULAR_URL, '#popular-slider');
    getMovies(TOP_RATED_URL, '#gems-slider');
    getMovies(ACTION_URL, '#action-slider');
    getMovies(Captivating_Acclaimed_URL, '#CompletelyCaptivating');
    getMovies(Suspenseful_Tv_URL, '#Suspenseful');
    getMovies(tOP_10_Nollywood_Films_URL, '#Top_Ten_Nigerian');
    getMovies(WAR_POLITICS_URL, '#War');
    getMovies(BingeWorthy_Spanish_Series_URL, '#BingeWorthySpanish');
    getMovies(Award_winning_BingeWorthy_URL, '#Award-winning');
    getMovies(FAMILIAR_FAVOURITE_URL, '#FamiliarFavourite');
    getMovies(New_Url, '#NewOnStreamZ');
    getMovies(TALK_SHOWS_URL, '#talkShows');

    // Setup Slider Arrows
    document.querySelectorAll('.slider-container').forEach((container) => {
        const slider = container.querySelector('.slider-movie-container');
        const leftBtn = container.querySelector('.left-arrow');
        const rightBtn = container.querySelector('.right-arrow');

        if (leftBtn && rightBtn && slider) {
            rightBtn.addEventListener('click', () => {
                slider.scrollBy({ left: 300, behavior: 'smooth' });
            });
            leftBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }
    });

