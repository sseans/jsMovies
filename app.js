// Variables
let movieObjectArray = []
let sliderObjectArray = []
const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'
const searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
const imageURL = 'https://image.tmdb.org/t/p/w185/'
const imageURLLarge = 'https://image.tmdb.org/t/p/w342/'
const imageURLBackdrop = 'https://image.tmdb.org/t/p/w1280/'
const trendingURL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'

// Selector
    // Hamburger Menu Selectors
    const hamburgerButton = document.querySelector('.mobileSearch__hamburger')
    const dropDown = document.querySelector('.navbar__rightside')
    const hamburgerBar = document.querySelectorAll('.hamburger__bar')

    // Navbar Menu Link Selectors
    const trendingLink = document.querySelector('#trendingLink')

    // Main Body Selectors
    const contentDiv = document.querySelector('.content')

    // SearchBar Selectors
    const inputElement = document.querySelector('.searchbox__input')
    const searchForm = document.querySelector('.navbar__searchbox')

// Event Listeners
hamburgerButton.addEventListener('click', hamburgerToggle)
trendingLink.addEventListener('click', () => fetchTrending(imageURL))
searchForm.addEventListener('submit', function checkIfPreviouslyUsed(event) {
                                            // Adds ability to search again from results page without going back
                                            event.preventDefault();
                                            if (inputElement.value == '') {
                                                return
                                            } else {
                                                fetchMovieSearch(imageURL)
                                            }
                                        })
document.addEventListener('DOMContentLoaded', sliderLoad)

// Mobile hamburger menu
function hamburgerToggle() {
    dropDown.classList.toggle('active')
    hamburgerBar.forEach(bar => {
        bar.classList.toggle('active')
    });
}

// Slider Functions 
function sliderLoad() {
    fetchSlider(imageURLBackdrop)
}


// Fetch Functions
function fetchTrending(imageURLSize) {
    fetch(trendingURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movieData = data.results;
            // Resets Objects => build new movie objects => Creates Movie Poster divs
            removeObjects()
            removeDiv('.content__container')
            buildMovieObjects(movieData)    
            let appendDestination = buildMoviePosterContainerDiv()                     
            buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize)
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function fetchMovieSearch(imageURLSize) {
    // Add input from text field to fetch URL
    let inputValue = inputElement.value
    let valueAddedUrl = searchURL + inputValue
    inputElement.value = ''

    fetch(valueAddedUrl)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movieData = data.results;
            // Resets Objects => build new movie objects => Creates Movie Poster divs
            removeObjects()
            removeDiv('.content__container')
            buildMovieObjects(movieData)    
            let appendDestination = buildMoviePosterContainerDiv()                     
            buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize)
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function fetchSlider(imageURLSize) {
    fetch(trendingURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movieData = data.results;
            // Resets Objects => build new movie objects => Creates Movie Poster divs
            removeObjects()
            buildMovieObjects(movieData)

            sliderObjectArray = movieObjectArray.filter((x) => {
                if (x.numberOfRatings > 500) {
                    return true
                }
            })
            
            console.log(sliderObjectArray);
            

            let appendDestination = buildMovieBackdropSliderDiv()                                 
            buildMovieBackdropWithEachMovieObject(appendDestination, imageURLSize)
            
            
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

// Utility Functions
function buildMovieObjects(movieData) {
    // build new objects from movie data and push to movieObjectArray []
    movieData.forEach(element => movieObjectArray.push(new movie(element)))     
}

function removeObjects()  {
    // removes an object off the array until the array.length = 0
    for (let i = 0; movieObjectArray.length > 0; i++) {
        movieObjectArray.pop()
    }
}

function buildMoviePosterContainerDiv() {
    // create element => append => return element to be used as appendDestination
    const moviePosterContainer = document.createElement('div')
    moviePosterContainer.className = 'content__container'
    contentDiv.appendChild(moviePosterContainer)
    
    return moviePosterContainer
}

function buildMovieBackdropSliderDiv() {
    // create element => append => return element to be used as appendDestination
    const moviePosterContainer = document.createElement('div')
    moviePosterContainer.className = 'content__container'

    let sliderTemplate = `${sliderTemplateCreator()}`

    moviePosterContainer.innerHTML = sliderTemplate

    contentDiv.appendChild(moviePosterContainer)

    let slider = moviePosterContainer.firstElementChild
    
    return slider
    
}

function sliderTemplateCreator() {
    return  `
            <div class='slider'>
                <div class='arrowleft'><i class="fas fa-chevron-left"></i></div>
                <div class='arrowright'><i class="fas fa-chevron-right"></i></div>
            </div>
            `
}

function buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize) {
    // Each Function is bound & called from the appropriate movie object in the array
    movieObjectArray.forEach(element => {
        let boundFunction = element.createMovieBlock.bind(element)        
        boundFunction(appendDestination, imageURLSize)
    });
    console.log(movieObjectArray);
}

function buildMovieBackdropWithEachMovieObject(appendDestination, imageURLSize) {
    // Each Function is bound & called from the appropriate movie object in the array
    sliderObjectArray.forEach(element => {
        let boundFunction = element.createMovieBlock.bind(element)        
        boundFunction(appendDestination, imageURLSize)
    });
    console.log(movieObjectArray);
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

// Classes
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

    createMovieBlock(appendDestination, imageURLSize) {        
        let movieTemplate = undefined
        let movieElement = undefined

        if (imageURLSize == 'https://image.tmdb.org/t/p/w1280/') {
            // Create Div & change class
            movieElement = document.createElement('div')
            movieElement.className = 'movieBackdrops'

            // create Event Listener for clicking each backdrop
            movieElement.addEventListener('click', () => this.toggleMovieView(movieElement))

            // Create HTML Template with backdrop images
            movieTemplate = `${this.movieBackdrop(imageURLSize)}`;

            // Delete moviePosters div if there is no posterpath in this object
            if (this.movieBackdrop() == null) {
                movieElement.parentNode.removeChild(movieElement)
            }

            // Add template to div HTML & append
            movieElement.innerHTML = movieTemplate
            appendDestination.appendChild(movieElement)

        } else {
            // Create Div & change class
            movieElement = document.createElement('div')
            movieElement.className = 'moviePosters'

            // create Event Listener for clicking each poster
            movieElement.addEventListener('click', () => this.toggleMovieView(movieElement))

            // Create HTML Template with poster images
            movieTemplate = `${this.movieImages(imageURLSize)}`;

            // Delete moviePoster div if there is no posterpath in this object
            if (this.movieImages() == null) {
                movieElement.parentNode.removeChild(movieElement)
            }

            // Add template to div HTML & append
            movieElement.innerHTML = movieTemplate
            appendDestination.appendChild(movieElement)
        }

    }

    movieBackdrop(imageURLSize) {
        // only returns template literal if there is a poster img
        if (this.posterPath == null) {
            return null
        } else {
            return `    <div class='backdropimage'>
                            <img src=${imageURLSize + this.backdropPath} data-movie-id=${this.id}/>
                            <div class='backdropinfo'>
                                <h1>${this.title}</h1>
                            </div>
                        </div>
                    `;  
        }
    }

    movieImages(imageURLSize) {
        // only returns template literal if there is a poster img
        if (this.posterPath == null) {
            return null
        } else {
            return `
                        <img class='posterimage' src=${imageURLSize + this.posterPath} data-movie-id=${this.id}/>
                        <div class='moviePosters__info'>
                        <i class="fas fa-star"></i>
                        <h1>${this.rating}</h1>
                        </div>
                    `;
        }
    }

    toggleMovieView() {
        // Create Div & change class
        const viewModeDiv = document.createElement('div')
        viewModeDiv.className = 'viewmode'

        // Create html Template => add to div innerHTML => append to body 
        let viewModeTemplate = `${this.viewModeTemplateMaker()}`
        viewModeDiv.innerHTML = viewModeTemplate
        document.body.appendChild(viewModeDiv)

        // viewModeDiv.addEventListener('click', () => removeDiv('.viewmode'))
        document.querySelector('.viewmode__exitbutton').addEventListener('click', () => removeDiv('.viewmode'))
    }

    viewModeTemplateMaker() {
        return `
            <div class='viewmode__card'>
                <div class='viewmode__poster'><img src=${imageURLLarge + this.posterPath} data-movie-id=${this.id}/></div>
                <div class='viewmode__info'>
                    <div class='viewmode__infotoolbar'>
                        <div class='info__title'>${this.title}</div>
                    </div>
                        <div class='rating'>
                            <div class='info__rating'>${this.rating}</div>
                            <div class='rating__slash'>/</div>
                            <div class='info__numberofratings'>${this.numberOfRatings}</div>
                        </div>
                        <div class='info__description'>${this.description}</div>
                        <div class='info__additional'>
                            <div class='info__releasedate'>${this.releaseDate}</div>
                            <div class='info__language'>${this.language}</div>    
                        </div>
                </div>
                <div class="viewmode__exitbutton">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `
    }
}

