// Variables
let movieObjectArray = []
const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'
const searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
const imageURL = 'https://image.tmdb.org/t/p/w185/'
const imageURLLarge = 'https://image.tmdb.org/t/p/w342/'
const trendingURL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'

// Selectors
const hamburgerButton = document.querySelector('.mobileSearch__hamburger')
const hamburgerBar = document.querySelectorAll('.hamburger__bar')
const body = document.querySelector('.body')
const movieSection = document.querySelector('.movies')

// Event Listeners
hamburgerButton.addEventListener('click', hamburgerToggle)

// Mobile hamburger menu
function hamburgerToggle() {
    hamburgerBar.forEach(bar => {
        bar.classList.toggle('active')
    });
    hamburgerButton.classList.toggle('active')

    if (hamburgerButton.classList.contains('active')) {
        fetchTrending(movieSection, imageURL)
    } else {
        removeDiv('.movieModeContainer')
        removeObjects()
    }
}

function removeDiv(className) {
    // Goes through array to remove the div and every child element
    let elements = Array.from(document.querySelectorAll(className))
    elements.forEach(element => {
        if (elements.length > 0) {
            element.parentNode.removeChild(element);
        }
    });
}

function removeObjects()  {
    for (let i = 0; movieObjectArray.length > 0; i++) {
        movieObjectArray.pop()
    }
}

// Fetch Functions
function fetchTrending(appendDestination, imageURLSize) {
    fetch(trendingURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movies = data.results;
            buildMovieObjects(movies)             
            // call function to create div/posters and append to DOM
            movieObjectArray.forEach(element => {
                let boundFunction = element.createMovieBlock.bind(element)
                boundFunction(imageURLSize, appendDestination)
            });
            console.log(movieObjectArray);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function buildMovieObjects(data) {
    data.forEach(element => movieObjectArray.push(new movie(element)))     
}

function addEventListenerToObjects() {

}

class movie {
    constructor(individualMovieData) {
        this.title = individualMovieData.title
        this.id = individualMovieData.id
        this.rating = individualMovieData.vote_average
        this.numberOfRatings = individualMovieData.vote_count
        this.popularity = individualMovieData.popularity
        this.language = individualMovieData.original_language
        this.releaseDate = individualMovieData.release_date
        this.posterPath = individualMovieData.poster_path
        this.backdropPath = individualMovieData.backdrop_path
        this.description = individualMovieData.overview
    }

    show() {
        console.log(this);
        
    }

    print() {
        console.log(this.backdropPath);
    }

    createMovieBlock(imageURLSize, appendDestination) {        
        // Create Div & change class
        const movieElement = document.createElement('div')
        movieElement.className = 'movieModeContainer'

        // create Event Listener for clicking each poster
        movieElement.addEventListener('click', () => this.toggleMovieView(movieElement))

        // Create HTML Template with poster images
        let movieTemplate = `${this.movieImages(imageURLSize)}`;

        // Add template to div HTML
        movieElement.innerHTML = movieTemplate
        
        
        appendDestination.appendChild(movieElement)
    }

    movieImages(imageURLSize) {
        // only returns html template literal (backtick) if there is a poster img
        if (this.posterPath == null) {
            return
        } else {
            return `<div class='moviePosters'>
                        <img src=${imageURLSize + this.posterPath} data-movie-id=${this.id}/>
                    </div>`;
        }
    }

    toggleMovieView(movieElement) {
        
        const viewModeDiv = document.createElement('div')
        viewModeDiv.className = 'viewmode'

        let childrenOfMovieElement = movieElement.childNodes
        let idOfMovie = childrenOfMovieElement[0].children[0].attributes[1].nodeValue

        let viewModeTemplate = `${this.viewModeTemplateMaker(idOfMovie)}`

        viewModeDiv.innerHTML = viewModeTemplate

        movieSection.appendChild(viewModeDiv)

        // let childOfMovieElement =  movieElement.childNodes
        // // Toggle Viewing Class CSS
        // childOfMovieElement[0].classList.toggle('viewing')
        // movieElement.classList.toggle('viewing')
    }

    viewModeTemplateMaker() {
        return `
            <div class='viewmode__card'>
                <div class='viewmode__poster'><img src=${imageURLLarge + this.posterPath} data-movie-id=${this.id}/></div>
                <div class='viewmode__info'>${this.description}</div>
            </div>
        `
    }
}




// class person {
//     constructor(name) {
//         this.name = 'J. P. Knight.'
//     }

//     sayName() {
//         console.log(this.name);
        
//     }

//     showMeThis() {
//         console.log(this);
        
//     }
// }

// let wow = new person('tommy')

// wow.sayName

// wow.showMeThis




// function fetchMovieSearch(imageURLSize) {
//     // Add input from text field to fetch URL
//     let inputValue = inputElement.value
//     let valueAddedUrl = searchURL + inputValue    

//     fetch(valueAddedUrl)
//         .then((res) => res.json())
//         .then((data) => {
//             // data.results [] data is returned as an Array
//             const movies = data.results;
//             // call function to create div/posters and append to DOM
//             const movieBlock = createMovieContainer(movies, imageURLSize)
//             bodyWrapper.appendChild(movieBlock)
//             // Log json data
//             console.log('Data: ', data);
//         })
//         .catch((error) => {
//             console.log('Error: ', error);
//         });
// }

// function createMovieContainer(movies, imageURLSize) {
//     // Create Div & change class
//     const movieElement = document.createElement('div')
//     movieElement.className = 'movieModeContainer'

//     // Create HTML Template with poster images
//     let movieTemplate = `${movieImages(movies, imageURLSize)}`;

//     // Add template to div HTML
//     movieElement.innerHTML = movieTemplate
    
//     return movieElement;
// }

// function movieImages(movies, imageURLSize) {
//     // Loops through movies (data.results)
//     return movies.map((movie) => {
//         // only returns html template literal (backtick) if there is a poster img
//         if (movie.poster_path == null) {
//             return
//         } else {
//             return `<div class='moviePosters'>
//                         <img src=${imageURLSize + movie.poster_path} data-movie-id=${movie.id}/>
//                     </div>`;
//         }
//         // .map adds a comma between each element, this is to remove that
//     }).join('')
// }
