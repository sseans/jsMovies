// Variables
const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'
const searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
const imageURL = 'https://image.tmdb.org/t/p/w185/'
const imageURLLarge = 'https://image.tmdb.org/t/p/w342/'
const trendingURL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'

// Selector
const hamburgerButton = document.querySelector('.mobileSearch__hamburger')
const dropDown = document.querySelector('.navbar__rightside')
const hamburgerBar = document.querySelectorAll('.hamburger__bar')

const bodyWrapper = document.querySelector('.body__wrapper')
const featuredSlider = document.querySelector('.featured__slider')

const movieButton = document.getElementById('trendingLink')
const content = document.querySelector('.content')
const inputElement = document.querySelector('.searchbox__input')
const searchForm = document.querySelector('.navbar__searchbox')

// Event Listeners
hamburgerButton.addEventListener('click', hamburgerToggle)
movieButton.addEventListener('click', movieMode)
searchForm.addEventListener('submit', function checkIfPreviouslyUsed(event) {
                                            // Adds ability to search again from results page without going back
                                            event.preventDefault();
                                            if (inputElement.value == '') {
                                                return
                                            } else if (document.querySelector('.movieModeContainer') == null){
                                                movieModeSearch()
                                            } else {
                                                removeDiv('movieModeContainer')
                                                movieModeSearchFromSearchMode()
                                            }
                                        })
document.addEventListener('DOMContentLoaded', fetchTrending(featuredSlider, imageURLLarge))

// Functions

// Mobile hamburger menu
function hamburgerToggle() {
    dropDown.classList.toggle('active')
    hamburgerBar.forEach(bar => {
        bar.classList.toggle('active')
    });
}

function removeDiv(className) {
    // Goes through array to remove the div and every child element
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function moviePosterAnimationPlay() {
    console.log('animation activated');
    document.querySelector('.movieModeContainer').id = 'posterAnimationUp';
}

// Key Functions
function movieModeSearchFromSearchMode() {
    // Create movie mode divs
    setTimeout(fetchMovieSearch(imageURL), 100)
    setTimeout(() => {
        inputElement.value = ''
    }, 300); 
}

function movieModeSearch(Event) {
    event.preventDefault();
    // Play animation / Remove animated divs
    document.querySelector('.content').id = 'animationUp';
    setTimeout(function() {removeDiv('content')}, 175);
    // Create movie mode divs
    setTimeout(fetchMovieSearch(imageURL), 100)
    setTimeout(() => {
        inputElement.value = ''
    }, 300); 
}

function movieMode() {
    // Play animation / Remove animated divs
    document.querySelector('.content').id = 'animationUp';
    setTimeout(function() {removeDiv('content')}, 175);
    // Create movie mode divs
    setTimeout(fetchTrending(bodyWrapper, imageURL), 100)
}


// Fetch Functions
function fetchTrending(appendDestination, imageURLSize) {
    fetch(trendingURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movies = data.results;
            // call function to create div/posters and append to DOM
            const movieBlock = createMovieContainer(movies, imageURLSize)
            appendDestination.appendChild(movieBlock)
            // Log json data
            console.log('Data: ', data);
            // Play Animation
            setTimeout(moviePosterAnimationPlay, 300)
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function fetchMovieSearch(imageURLSize) {
    // Add input from text field to fetch URL
    let inputValue = inputElement.value
    let valueAddedUrl = searchURL + inputValue    

    fetch(valueAddedUrl)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movies = data.results;
            // call function to create div/posters and append to DOM
            const movieBlock = createMovieContainer(movies, imageURLSize)
            bodyWrapper.appendChild(movieBlock)
            // Log json data
            console.log('Data: ', data);
            // Play Animation
            moviePosterAnimationPlay()
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function createMovieContainer(movies, imageURLSize) {
    // Create Div & change class
    const movieElement = document.createElement('div')
    movieElement.className = 'movieModeContainer'

    // Create HTML Template with poster images
    let movieTemplate = `${movieImages(movies, imageURLSize)}`;

    // Add template to div HTML
    movieElement.innerHTML = movieTemplate
    
    return movieElement;
}

function movieImages(movies, imageURLSize) {
    // Loops through movies (data.results)
    return movies.map((movie) => {
        // only returns html template literal (backtick) if there is a poster img
        if (movie.poster_path == null) {
            return
        } else {
            return `<div class='moviePosters'>
                        <img src=${imageURLSize + movie.poster_path} data-movie-id=${movie.id}/>
                    </div>`;
        }
        // .map adds a comma between each element, this is to remove that
    }).join('')
}
