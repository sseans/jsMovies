// Variables
const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'
const searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
const imageURL = 'https://image.tmdb.org/t/p/w185/'
const trendingURL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'

// Selectors
const movieButton = document.getElementById('movieModeButton')
const content = document.querySelector('.content')
const inputElement = document.querySelector('.searchBar')
const searchForm = document.querySelector('.inputContainer')

// Event Listeners
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


// Key Functions
function movieModeSearchFromSearchMode() {
    // Create movie mode divs
    setTimeout(fetchMovieSearch, 100)
    setTimeout(() => {
        inputElement.value = ''
    }, 300); 
}

function movieModeSearch(Event) {
    event.preventDefault();
    // Play animation / Remove animated divs
    document.querySelector('.content').id = 'animationUp';
    setTimeout(function() {removeDiv('content')}, 175);
    setTimeout(function() {removeDiv('raspberryFooter')}, 175);
    // Change BG color
    setTimeout(colorChange, 40)
    // Create movie mode divs
    setTimeout(fetchMovieSearch, 100)
    setTimeout(() => {
        inputElement.value = ''
    }, 300); 
}

function movieMode() {
    // Play animation / Remove animated divs
    document.querySelector('.content').id = 'animationUp';
    setTimeout(function() {removeDiv('content')}, 175);
    setTimeout(function() {removeDiv('raspberryFooter')}, 175);
    // Change BG color
    setTimeout(colorChange, 40)
    // Create movie mode divs
    setTimeout(fetchTrending, 100)
}

// Functions
function removeDiv(className) {
    // Goes through array to remove the div and every child element
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function colorChange() {
    // Color Change  various toolbar elements after background color changed
    document.querySelector('.defaultBody').className = 'postAnimationBody';
    document.querySelector('.toolbarTitle').className = 'toolbarTitleAfter';
    // Changing classnames for multiple items in the Toolbar, 3 for the LI elements, 2 for dividers
    for(let i = 0; i < 3; i++) {
        document.querySelector('.toolbarButtons').className = 'toolbarButtonsAfter';
        if (i < 2) {
            document.querySelector('.divider').className = 'dividerAfter';
        }
    }
}

function moviePosterAnimationPlay() {
    console.log('animationfunction activated');
    
    document.querySelector('.movieModeContainer').id = 'posterAnimationUp'
}

// Fetch Functions
function fetchTrending() {
    fetch(trendingURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movies = data.results;
            // call function to create div/posters and append to DOM
            const movieBlock = createMovieContainer(movies)
            document.body.appendChild(movieBlock)
            // Log json data
            console.log('Data: ', data);
            // Play Animation
            moviePosterAnimationPlay()
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function fetchMovieSearch() {
    // Add input from text field to fetch URL
    let inputValue = inputElement.value
    let valueAddedUrl = searchURL + inputValue    

    fetch(valueAddedUrl)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movies = data.results;
            // call function to create div/posters and append to DOM
            const movieBlock = createMovieContainer(movies)
            document.body.appendChild(movieBlock)
            // Log json data
            console.log('Data: ', data);
            // Play Animation
            moviePosterAnimationPlay()
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function createMovieContainer(movies) {
    // Create Div & change class
    const movieElement = document.createElement('div')
    movieElement.className = 'movieModeContainer'

    // Create HTML Template with poster images
    let movieTemplate = `${movieImages(movies)}`;

    // Add template to div HTML
    movieElement.innerHTML = movieTemplate
    
    return movieElement;
}

function movieImages(movies) {
    // Loops through movies (data.results)
    return movies.map((movie) => {
        // only returns html template literal (backtick) if there is a poster img
        if (movie.poster_path == null) {
            return
        } else {
            return `<div class='moviePosters'>
                        <img src=${imageURL + movie.poster_path} data-movie-id=${movie.id}/>
                    </div>`;
        }
        // .map adds a comma between each element, this is to remove that
    }).join('')
}







