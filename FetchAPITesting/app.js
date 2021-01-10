// Variables
const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'

// Selectors
const inputElement = document.querySelector('.searchBox')
const inputButton = document.querySelector('.searchButton')

// Event Listeners
inputButton.addEventListener('click', active)

// Functions
function active() {
    let inputValue = inputElement.value
    console.log(inputValue)
    
}

function searchMovies() {

}