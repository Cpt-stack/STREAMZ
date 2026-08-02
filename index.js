

// Select the hamburger icon and the navigation menu
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');



let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    // Get the current scroll position
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Check if scrolling down AND past the very top of the page
    if (currentScroll > lastScrollTop && currentScroll > 70) {
        // Scrolling Down: Hide the header
        header.classList.add('hide-header');
    } else {
        // Scrolling Up (or at the very top): Show the header
        header.classList.remove('hide-header');
    }

    // Update the last scroll position to the current one
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevents negative scrolling values on mobile bounce
});





// --- Search Overlay Logic ---
const searchBtn = document.getElementById('searchBar-Btn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const overlaySearchInput = document.getElementById('overlaySearchInput');

// Open the overlay
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevents default link behavior if applicable
    searchOverlay.classList.add('active');

    // Tiny delay to let the CSS fade-in finish before focusing the input
    setTimeout(() => {
        overlaySearchInput.focus();
    }, 100);
});

// Close the overlay using the X button
closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    overlaySearchInput.value = ''; // Optional: clears the search box on close
});

// Close the overlay if the user clicks anywhere on the blurred background
searchOverlay.addEventListener('click', (e) => {
    // If the click happened directly on the background (not inside the content)
    if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
    }
});

// Close the overlay if the user presses the Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
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







// function to create the container, 
// display the shows and the trailers with the Add List logic
let MyList = [];

function showMovies(movies, sliderId) {

    const slider = document.querySelector(sliderId);

    // 2. Loop through the array of movies
    movies.forEach((movie) => {


        let images = IMG_PATH + `${movie.poster_path}`;

        // TMDB sometimes uses 'name' for TV shows and 'title' for movies
        let movieTitle = movie.title || movie.name;


    //    . Check if this movie is ALREADY in our saved list when the page loads
        const isAlreadySaved = MyList.find(savedMovie => savedMovie.id === movie.id);
        
        //  Set the button styles based on whether it is saved or not
        const btnIcon = isAlreadySaved ? '✓' : '+';
        const btnBg = isAlreadySaved ? 'var(--primary)' : 'white';
        const btnTextCol = isAlreadySaved ? 'var(--lighttext)' : 'black';

        //  Inject those styles and add the 'data-id' tracking beacon to the button
        let newDiv = document.createElement("div");
        newDiv.classList.add("movie-card");
        newDiv.innerHTML = `
            <img src="${images}" alt= "${movieTitle}">
            <div class = "card-info">
                <h4> ${movieTitle} </h4>
                <div class="card-actions">
                    <button class="action-btn play-btn">▶ Trailer</button>
                    <!-- Notice the data-id and style injection here! -->
                    <button class="action-btn add-btn" data-id="${movie.id}" style="background-color: ${btnBg}; color: ${btnTextCol}">${btnIcon}</button>
                </div>
            </div>
        `;
        
        slider.appendChild(newDiv);

        // 2. Grab the specific buttons we JUST created for this specific card
        const playBtn = newDiv.querySelector('.play-btn');
        const addBtn = newDiv.querySelector('.add-btn');

        

   //  The "Add to List" Logic
        addBtn.addEventListener('click', () => {
            const isAlreadyInList = MyList.find(savedMovie => savedMovie.id === movie.id);

            if (!isAlreadyInList) {
                MyList.push(movie);
                updateMyListUI(); // Saves to local storage and updates panel

                // Find EVERY button on the page for this specific movie and update them all
                const matchingButtons = document.querySelectorAll(`.add-btn[data-id="${movie.id}"]`);
                matchingButtons.forEach(btn => {
                    btn.innerHTML = `✓`;
                    btn.style.backgroundColor = "var(--primary)";
                    btn.style.color = "var(--lighttext)";
                });
            } else {
                alert(`${movieTitle} is already in your list!`);
            }
        });

      
        // The "Play Trailer" Logic
        playBtn.addEventListener('click', async () => {
            let fetchUrl;

            // We check if 'movie.name' exists to see if it's a TV show,
            // but we STILL use 'movie.id' because that's the name of our loop variable!
            if (movie.name) {
                fetchUrl = `${BASE_URL}/tv/${movie.id}/videos?api_key=${API_KEY}`;
            } else {
                fetchUrl = `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`;
            }

            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();

                const trailer = data.results.find(video =>
                    video.site === "YouTube" &&
                    video.type === "Trailer"
                );

                if (trailer) {
                    const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                    console.log("Opening trailer:", trailerUrl);
                    window.open(trailerUrl, '_blank');
                } else {
                    alert("Sorry, no trailer available for this title!");
                }

            } catch (error) {
                console.error("Failed to fetch trailer:", error.message);
            }
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










// Defining the remaining category API endpoints
const POPULAR_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&api_key=' + API_KEY;
const TOP_RATED_URL = BASE_URL + '/movie/top_rated?api_key=' + API_KEY;
const ACTION_URL = BASE_URL + '/discover/movie?with_genres=28&api_key=' + API_KEY;
const Suspenseful_Tv_URL = BASE_URL + '/discover/tv?with_genres=9648,80&sort_by=popularity.desc&api_key=' + API_KEY;
const FAMILIAR_FAVOURITE_URL = BASE_URL + '/tv/popular?api_key=' + API_KEY;
const Top_10_Serie_URL = BASE_URL + '/trending/tv/day?api_key=' + API_KEY;
const tOP_10_Nollywood_Films_URL = BASE_URL + '/trending/tv/week?api_key=' + API_KEY;
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
getMovies(Top_10_Serie_URL, '#top_Ten_Nigerian')
getMovies(tOP_10_Nollywood_Films_URL, '#Top_Ten_Nigerian');
getMovies(WAR_POLITICS_URL, '#War')
getMovies(BingeWorthy_Spanish_Series_URL, '#BingeWorthySpanish');
getMovies(Award_winning_BingeWorthy_URL, '#Award-winning');
getMovies(FAMILIAR_FAVOURITE_URL, '#FamiliarFavourite');
getMovies(New_Url, '#NewOnStreamZ');
getMovies(TALK_SHOWS_URL, '#talkShows')









// BILLBOARD IMPLEMENTATION


//  function to shorten text and add "..."
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

async function getHeroMovie(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // picks a number btw 0 and 19 and use that number
        //  to select a single movie object from the data.results array
        // and store it in the variable called "randomMovie"

        const max = 19;
        const min = 0;
        const randomIndex = Math.floor((Math.random() * data.results.length));
        const randomMovie = data.results[randomIndex];



        // Targeted my DOM elements
        let heroBoard = document.querySelector('#hero-board');
        let heroTitle = document.querySelector('#hero-title');
        let heroDesc = document.querySelector('#hero-desc');

        // CHALLENGE 12: Update the Title and Description text.
        // TMDB uses 'original_title' or 'name' for titles, and 'overview' for the description.
        // heroTitle.original
        heroTitle.textContent = randomMovie.original_title || randomMovie.name;
        heroDesc.textContent = truncate(randomMovie.overview, 100);

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


// getHeroMovie(POPULAR_URL);

getHeroMovie(Award_winning_BingeWorthy_URL);





// search Implementation



const overlaySearchSubmit = document.querySelector("#overlaySearchSubmit");
// const overlaySearchInput = document.querySelector("#overlaySearchInput");
const searchParagraph = document.querySelector(".search-placeholder-text")


overlaySearchSubmit.addEventListener("click", searchMovie);
overlaySearchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        // Prevent the default form submission behavior just in case
        event.preventDefault();
        // Trigger the exact same search function!
        searchMovie();
    }
});

async function searchMovie() {
    const moviename = overlaySearchInput.value;

    if (!moviename) return;


    const SearchUrl = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${moviename}`;

    try {
        const response = await fetch(SearchUrl);
        const data = await response.json();

        console.log(data.results);

        // 3. The multi-search also returns Actors/People. 
        // We only want to show Movies and TV Shows so our image cards don't break.
        const filteredResults = data.results.filter(item => item.media_type !== 'person');

        const resultsContainer = document.querySelector('#searchResults');
        resultsContainer.innerHTML = '';

        showMovies(filteredResults, '#searchResults');
    }
    catch (error) {
        console.log(error)
        searchParagraph.textContent = `${moviename} isnt avaiable`
    }
}




// --- My List Panel Logic ---
const myListPanel = document.getElementById('myListPanel');
const openMyListBtn = document.getElementById('openMyListBtn');
const closeListBtn = document.getElementById('closeListBtn');
const myListContent = document.getElementById('myListContent');

// Open and Close Panel
openMyListBtn.addEventListener('click', (e) => {
    e.preventDefault();
    myListPanel.classList.add('active');
});

closeListBtn.addEventListener('click', () => {
    myListPanel.classList.remove('active');
});

// The core rendering function
function updateMyListUI() {

    myListContent.innerHTML = '';

    // 2. If the array is empty, show the placeholder text
    if (MyList.length === 0) {
        myListContent.innerHTML = `<p class="empty-list-text">Your list is currently empty.</p>`;

        localStorage.setItem("streamz_saved_movies", JSON.stringify(MyList)); // STORING THE EMPTY ARRAY IN THE BROWSER HARD DRIVE
        // AND CONVERTING THE ARRAY INTO A TEXT STRING 

        return;
    }
    // forming the card that will display -- it should have the 
    //                               image, the title , a remove button
    MyList.forEach((savedMovie, index) => {

        let MyListedImages = IMG_PATH + savedMovie.poster_path;
        let MylistedTitle = savedMovie.title || savedMovie.name;

        // create the container
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

        // Inside updateMyListUI():
        const removeBtn = MyListedContainer.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            
            // 1. Grab the ID of the movie BEFORE we delete it from the array
            const removedMovieId = MyList[index].id;
            
            // 2. Remove it from the array and redraw the side panel
            MyList.splice(index, 1);
            updateMyListUI(); 
            
            // 3. Find the buttons on the main page and revert them back to "+"
            const matchingButtons = document.querySelectorAll(`.add-btn[data-id="${removedMovieId}"]`);
            matchingButtons.forEach(btn => {
                btn.innerHTML = '+';
                btn.style.backgroundColor = 'white';
                btn.style.color = 'black';
            });
        });


    });

    // CHALLENGE 16b: Save to Local Storage!
    // 1. Turn the current 'MyList' array into a string.
    let string = JSON.stringify(MyList);
    // 2. Save it to localStorage using a key name like "streamz_saved_movies".
    localStorage.setItem("streamz_saved_movies", string);
}


function loadSavedList() {
    let storedData = localStorage.getItem("streamz_saved_movies");
    
    if (storedData !== null) {
        let parseArray = JSON.parse(storedData);
        
        // SAFETY NET: Check if the parsed data is actually a real array!
        if (Array.isArray(parseArray)) {
            MyList = parseArray;
        } else {
            // If the saved data was corrupted/broken, reset it to an empty array
            MyList = []; 
        }
    } else {
        console.log("No saved list found.");
        MyList = [];
    }
    
    updateMyListUI();
}

loadSavedList();