// Select the hamburger icon and the navigation menu
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');

// Toggle the 'active' class when the hamburger is clicked
hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Optional: Change the icon from hamburger to an 'X' when open
    if (navMenu.classList.contains('active')) {
        hamburgerMenu.classList.replace('fa-bars', 'fa-xmark');
    } else {
        hamburgerMenu.classList.replace('fa-xmark', 'fa-bars');
    }
});



// DARK Mode
modeBtn = document.querySelector(".mode");
buttonModeIcon = document.querySelector("#button-mode i");

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


})















const API_KEY = '6a29b492761e52181b5f197d0fc3de66'; // Keep the quotes!
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

// 2. Build the full URL for your first slider (e.g., Popular Movies)
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;

// 3. Create the function that will go get the data
async function getMovies(url, sliderId) {
    try {

        // const response = await fetch(`${API_URL}`);

        const response = await fetch(url);

        const data = await response.json();


        showMovies(data.results, sliderId);

    } catch (error) {
        // This catches any network errors and prints them safely
        console.error("Oops, failed to fetch movies:", error);
    }
}









function showMovies(movies, sliderId) {

    const slider = document.querySelector(sliderId);

    // 2. Loop through the array of movies
    movies.forEach((movie) => {


        let images = IMG_PATH + `${movie.poster_path}`;

        // TMDB sometimes uses 'name' for TV shows and 'title' for movies
        let movieTitle = movie.title || movie.name;



        let newDiv = document.createElement("div");
        newDiv.classList.add("movie-card");
        newDiv.innerHTML = `
            <img src="${images}" alt= "${movieTitle}">
            <div class = "card-info">
                <h4> ${movieTitle} </h4>
                <div class="card-actions">
                    <button class="action-btn play-btn">▶ Trailer</button>
                    <button class="action-btn add-btn">+</button>
                </div>
            </div>
            `

        slider.appendChild(newDiv);

        // 2. Grab the specific buttons we JUST created for this specific card
        const playBtn = newDiv.querySelector('.play-btn');
        const addBtn = newDiv.querySelector('.add-btn');

        // CHALLENGE 14: The "Add to List" Logic
        const MyList = [];
        addBtn.addEventListener('click', (movieTitle) => {
            // Write the code to push the 'movieTitle' variable into the 'myList' array.

            MyList.push(movieTitle);

            // Console.log the array so you can see it growing when you click!
            console.log(MyList)
            // Bonus: Change the button text from "+" to "✓" so the user knows it worked.

            addBtn.innerHTML = `✓`

        });

        // CHALLENGE 15: The "Play Trailer" Logic
        playBtn.addEventListener('click', async () => {
            // To get a trailer, you need to make a NEW fetch request using the movie's ID.
            // The TMDB endpoint for videos is: 

            const URL = BASE_URL + '/movie/' + movie.id + '/videos?api_key=' + API_KEY

            try {
                const response = await fetch(URL);
                const data = await response.json();

                const trailer = data.results.find(video =>
                    video.site === "YouTube" &&
                    video.type === "Trailer"
                );
                if (trailer) {
                    const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                    console.log(trailerUrl);
                }


            }
            catch (error) {
                console.error(error.message)
            }

            // 1. Fetch that URL and convert to JSON
            // 2. Look at the data in the console. TMDB returns an array of videos.
            // 3. Find the video where type === "Trailer"
            // 4. TMDB gives you a YouTube 'key'. The YouTube URL is: https://www.youtube.com/watch?v=THE_KEY
            // 5. Use window.open(youtubeUrl, '_blank') to open the trailer in a new tab!
        });

    });
}



// 1. Grab ALL the slider containers on the entire page
const allSliders = document.querySelectorAll('.slider-container');

// 2. Loop through each container one by one
allSliders.forEach((container) => {

    // 3. Find the specific slider and buttons INSIDE this particular container
    const slider = container.querySelector('.slider-movie-container');
    const leftBtn = container.querySelector('.left-arrow');
    const rightBtn = container.querySelector('.right-arrow');

    // 4. Check to make sure the arrows actually exist in the HTML before adding listeners
    if (leftBtn && rightBtn && slider) {

        rightBtn.addEventListener('click', function () {
            slider.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        leftBtn.addEventListener('click', function () {
            slider.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }
});


// 1. Define your different API endpoints
const POPULAR_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
const TOP_RATED_URL = BASE_URL + '/movie/top_rated?api_key=' + API_KEY;
const ACTION_URL = BASE_URL + '/discover/movie?with_genres=28&api_key=' + API_KEY;

// Fixed: Removed the space after '?' and added '&api_key='
const Suspenseful_Tv_URL = BASE_URL + '/discover/tv?with_genres=9648,80&sort_by=popularity.desc&api_key=' + API_KEY;


// Fixed: Added '?api_key=' to all the ones below
const FAMILIAR_FAVOURITE_URL = BASE_URL + '/tv/popular?api_key=' + API_KEY;
const Top_10_Serie_URL = BASE_URL + '/trending/tv/day?api_key=' + API_KEY;
const tOP_10_Nollywood_Films_URL = BASE_URL + '/trending/tv/week?api_key=' + API_KEY;

// Fixed: Added '&api_key=' to all the ones below
const WAR_POLITICS_URL = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10768`;
const Award_winning_BingeWorthy_URL = BASE_URL + '/discover/tv?with_genres=80&sort_by=vote_average.desc&vote_count.gte=500&api_key=' + API_KEY;
const BingeWorthy_Spanish_Series_URL = BASE_URL + '/discover/tv?with_original_language=es&sort_by=popularity.desc&api_key=' + API_KEY;
const Captivating_Acclaimed_URL = BASE_URL + '/discover/tv?sort_by=vote_average.desc&vote_count.gte=1000&api_key=' + API_KEY;
const New_Url = BASE_URL + '/movie/now_playing?api_key=' + API_KEY;
const TALK_SHOWS_URL = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10767`;


// 2. Call the function for each row, passing the URL and the target HTML ID
getMovies(POPULAR_URL, '#popular-slider');
getMovies(TOP_RATED_URL, '#gems-slider');
getMovies(ACTION_URL, '#action-slider');
getMovies(Captivating_Acclaimed_URL, '#CompletelyCaptivating');
getMovies(Suspenseful_Tv_URL, '#Suspenseful')
getMovies(Top_10_Serie_URL, '#')
getMovies(tOP_10_Nollywood_Films_URL, '#Top_Ten_Nigerian');
getMovies(WAR_POLITICS_URL, '#War')
getMovies(BingeWorthy_Spanish_Series_URL, '#BingeWorthySpanish');
getMovies(Award_winning_BingeWorthy_URL, '#Award-winning');
getMovies(FAMILIAR_FAVOURITE_URL, '#FamiliarFavourite');
getMovies(New_Url, '#NewOnStreamZ');
getMovies(TALK_SHOWS_URL, '#talkShows')




// BILLBOARD IMPLEMENTATION


// Helper function to shorten text and add "..."
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

async function getHeroMovie(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // CHALLENGE 10: Pick a random number between 0 and 19.
        // Use that number to select a single movie object from the data.results array.
        // Store it in a variable called 'randomMovie'

        const max = 19;
        const min = 0;
        const randomIndex = Math.floor((Math.random() * data.results.length));
        const randomMovie = data.results[randomIndex];



        // CHALLENGE 11: Target your DOM elements
        let heroBoard = document.querySelector('#hero-board');
        let heroTitle = document.querySelector('#hero-title');
        let heroDesc = document.querySelector('#hero-desc');

        // CHALLENGE 12: Update the Title and Description text.
        // TMDB uses 'original_title' or 'name' for titles, and 'overview' for the description.
        // heroTitle.original
        heroTitle.textContent = randomMovie.original_title || randomMovie.name;
        heroDesc.textContent = truncate(randomMovie.overview, 150);

        // CHALLENGE 13: Change the background image of 'heroBoard'
        // You'll need to use the IMG_PATH + randomMovie.backdrop_path 
        // Note: TMDB backdrops for the Hero section look best when you request original quality instead of w500.
        // heroBoard.innerHTML;
        const HeroImgPath = 'https://image.tmdb.org/t/p/original'



        console.log(HeroImgPath)
        heroBoard.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%), url(${HeroImgPath + randomMovie.backdrop_path})`;

    } catch (error) {
        console.error("Oops, failed to fetch hero movie:", error);
    }
}


getHeroMovie(POPULAR_URL);


