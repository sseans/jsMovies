// Variables
const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'
const searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
const imageURL = 'https://image.tmdb.org/t/p/w185/'
const trendingURL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'

// Selectors
const inputElement = document.querySelector('.searchBox')
const inputButton = document.querySelector('.searchButton')
const movieSearchResults = document.querySelector('.movieSearchResults')
const trendingButton = document.querySelector('.trendingButton')

// Event Listeners
inputButton.addEventListener('click', fetchMovies)
trendingButton.addEventListener('click', fetchTrending)

// Functions
function fetchTrending() {
    fetch(trendingURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movies = data.results;
            // call function to create div/posters and append to DOM
            const movieBlock = createMovieContainer(movies)
            movieSearchResults.appendChild(movieBlock)
            // Log json data
            console.log('Data: ', data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}


function fetchMovies() {
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
            movieSearchResults.appendChild(movieBlock)
            // Log json data
            console.log('Data: ', data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function createMovieContainer(movies) {
    // Create Div & change class
    const movieElement = document.createElement('div')
    movieElement.className = 'movie'

    // Create HTML Template with poster images
    const movieTemplate = `
        ${movieImages(movies)}
    ` 

    // Add template to div HTML
    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

function movieImages(movies) {
    return movies.map((movie) => {
        return `
            <img src=${imageURL + movie.poster_path} data-movie-id=${movie.id}/>
        `;
    })
}