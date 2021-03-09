// Variables
    let movieObjectArray = []
    let tvObjectArray = []
    let sliderObjectArray = []
    let counterTimeout = undefined 
    let slideWidth = slideSizeCalculator() 
    let windowSize = undefined
    let initialWindowSize = undefined 
    const defaultURL = 'https://api.themoviedb.org/3/movie/550?api_key=672afe6c70446d4ff7c242f8bb0a3609'
    const API_KEY = '672afe6c70446d4ff7c242f8bb0a3609'
    const searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
    const searchURLTV = 'https://api.themoviedb.org/3/search/tv?api_key=672afe6c70446d4ff7c242f8bb0a3609&query='
    const imageURL = 'https://image.tmdb.org/t/p/w185/'
    const imageURLLarge = 'https://image.tmdb.org/t/p/w342/'
    const imageURLBackdrop = 'https://image.tmdb.org/t/p/w1280/'
    const imageURLBackdropAlternate = 'https://image.tmdb.org/t/p/original'
    const imageURLBackdropSmall = 'https://image.tmdb.org/t/p/w780/'
    const trendingURL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'
    const trendingTVURL = 'https://api.themoviedb.org/3/trending/tv/week?api_key=672afe6c70446d4ff7c242f8bb0a3609'

// Selector
    // Hamburger Menu Selectors
    const hamburgerButton = document.querySelector('.mobileSearch__hamburger')
    const dropDown = document.querySelector('.navbar__rightside')
    const hamburgerBar = document.querySelectorAll('.hamburger__bar')

    // Navbar Menu Link Selectors
    const moviesLink = document.querySelector('#trendingLink')
    const tvShowsLink = document.querySelector('#tvLink')

    // Navbar Dark Mode Selectors
    const darkModeButton = document.querySelector('.navbar__darkmode')
    const darkModeInnerCircle = document.querySelector('.darkmode__toggle')
    const darkModeMoonIcon = document.querySelector('.fa-moon')

    // Main Body Selectors
    const contentDiv = document.querySelector('.content')

    // Slider Selectors 

    // SearchBar Selectors
    const inputElement = document.querySelector('.searchbox__input')
    const searchForm = document.querySelector('.navbar__searchbox')

// Event Listeners
    hamburgerButton.addEventListener('click', hamburgerToggle)
    moviesLink.addEventListener('click', () => fetchTrending(imageURL))
    searchForm.addEventListener('submit', function checkIfPreviouslyUsed(event) {
                                                // Adds ability to search again from results page without going back
                                                event.preventDefault();
                                                if (inputElement.value == '') {
                                                } else {
                                                    fetchTVMovieSearch(imageURL)
                                                }
                                            })
    document.addEventListener('DOMContentLoaded', () => {   
                                                    initialWindowSize = window.innerWidth
                                                    if (window.innerWidth <= 860) {
                                                        windowSize = 'small'
                                                        fetchSlider(imageURLBackdropSmall)
                                                    } else {
                                                        windowSize = 'large'
                                                        fetchSlider(imageURLBackdrop)
                                                    }
                                                })
    window.addEventListener('resize', () => {       
                                        clearTimeout(counterTimeout)
                                        counterTimeout = setTimeout(sliderSize, 400)
                                    })
    tvShowsLink.addEventListener('click', () => fetchTrendingTV(imageURL))
    darkModeButton.addEventListener('click', darkModeButtonToggle)
    
// Mobile hamburger menu
    function hamburgerToggle() {
        dropDown.classList.toggle('active')
        hamburgerBar.forEach(bar => {
            bar.classList.toggle('active')
        });
    }

// Slider Functions 
    function fetchSlider(imageURLSize) {
        fetch(trendingURL)
            .then((res) => res.json())
            .then((data) => {
                // data.results [] data is returned as an Array
                const movieData = data.results;
                console.log(movieData);
                
                // Resets Objects => build new movie objects => Creates Movie Poster divs
                removeObjects()
                removeSliderObjects()
                removeDiv('.content__container')
                removeDiv('.viewmode')
                buildMovieObjects(movieData)
                buildSliderObjectsFromMovieObjects()
                let appendDestination = buildMovieBackdropSliderDiv()                                 
                sliderActive(appendDestination, imageURLSize)
                
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }
        
    function buildMovieBackdropSliderDiv() {
        // create element => append => return element to be used as appendDestination
        const moviePosterContainer = document.createElement('div')
        moviePosterContainer.className = 'content__container'

        let sliderTemplate = `  <div class='slider'>
                                    <div class='slider__inner'></div>
                                    <div class='arrowleft'><i class="fas fa-chevron-left"></i></div>
                                    <div class='arrowright'><i class="fas fa-chevron-right"></i></div>
                                </div>`

        moviePosterContainer.innerHTML = sliderTemplate
        
        contentDiv.appendChild(moviePosterContainer)

        // Arrow Selectors for the slider => trigger function to automate slider
        const sliderRight = document.querySelector('.arrowright')        
        const sliderLeft = document.querySelector('.arrowleft')
        automateSlider(sliderRight, sliderLeft)
        
        let slider = moviePosterContainer.firstElementChild.firstElementChild
        
        return slider
    }

    function slideSizeCalculator() {
        let width = undefined
        if (window.innerWidth <= 860) {
            width = 780
        } else {
            width = 1280
        }        
        return width
    }

    function sliderSize() {
        // records window size in a string then compares to initial window size 
        let sliderScale;
        if (window.innerWidth <= 860) {
            sliderScale = 'small'
        } else {
            sliderScale = 'large'
        }        

        // Checks to see if the windowSize at DOMContentLoaded & sliderscale at window Resize are the same, if they are different, build new slider
        // Also makes sure the window wont resize unless the page being viewed has a slider on it
        if (windowSize !== sliderScale && sliderObjectArray.length > 1) {
            if (window.innerWidth <= 860) {
                windowSize = 'small'
                fetchSlider(imageURLBackdropSmall)
                slideWidth = 780
            } else {
                windowSize = 'large'
                fetchSlider(imageURLBackdrop)
                slideWidth = 1280
            }        
        } else {
            return
        }
    }

    function sliderActive(appendDestination, imageURLSize) {
        // Builds an Image with each Object in the Slider Array => Append to inner__slider
        sliderObjectArray.forEach(element => {
            let boundCreateSliderImages = element.createMovieSlide.bind(element)
            let slide = boundCreateSliderImages(imageURLSize)
            appendDestination.appendChild(slide)
        })

        // Builds the first movie slider title to display on page load & keeps track of which title to display
        let titleNumber = 0
        sliderTitle(appendDestination, titleNumber)
        
        // leftAmount keeps track of the css styling property left: which moves the inner slider
        let leftAmount = 0
        // Calculates the length of all the images build by the array, so you cant move past the images in the slider
        let maxAmount = (sliderObjectArray.length * slideWidth - slideWidth) * -1

        // Event Listener & if else statement to identify which button is clicked
        appendDestination.parentNode.addEventListener('click', (e) => {
            let clickedItem = e.target;
        
            if (clickedItem.classList[1] == 'fa-chevron-right' || clickedItem.classList[0] == 'arrowright') {
                // maxAmount is a negative number, since the slider_inner is being moved to the left to give the appearance of moving through the movies to the right
                if (leftAmount <= maxAmount) {
                    return
                } else {
                    titleNumber++
                    leftAmount -= slideWidth
                    appendDestination.style.left = `${leftAmount}px`;
                    sliderTitleChange(appendDestination, titleNumber, 'right')
                }

            } else if (clickedItem.classList[1] == 'fa-chevron-left' || clickedItem.classList[0] == 'arrowleft') {
                if (leftAmount >= 0) {
                    return
                } else {
                    titleNumber--
                    leftAmount += slideWidth
                    appendDestination.style.left = `${leftAmount}px`;
                    sliderTitleChange(appendDestination, titleNumber, 'left')
                }
            }
        })
    }

    // builds movie titles from slider object array => appends to slider div
    function sliderTitle(appendDestination, titleNumber) {
        let boundCreateInitialTitle = sliderObjectArray[titleNumber].buildSliderTitle.bind(sliderObjectArray[titleNumber])
        sliderTitlePeice = boundCreateInitialTitle()
        appendDestination.parentNode.appendChild(sliderTitlePeice)
    }

    // waits till half way through the slider animation (200ms) => deletes title => creates new title
    function sliderTitleChange(appendDestination, titleNumber, direction) {
        setTimeout(() => {
            removeDiv('.sliderTitle')
        }, 195);

        setTimeout(() => {
            sliderTitle(appendDestination, titleNumber)            
        }, 200);
    }

    // Automate Slider
    function automateSlider(sliderRight, sliderLeft) {
        setInterval(() => {
            sliderRight.click()                     
        }, 10000);
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
            removeSliderObjects()
            removeDiv('.content__container')
            removeDiv('.viewmode')
            buildMovieObjects(movieData)    
            let appendDestination = buildMoviePosterContainerDiv()                     
            buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize)
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
    }

    function fetchTVMovieSearch(imageURLSize) {
        // Add input from text field to fetch URL
        let inputValue = inputElement.value
        let valueAddedMovieUrl = searchURL + inputValue
        let valueAddedTVUrl = searchURLTV + inputValue
        inputElement.value = ''   
        
        // Removes any pre-existing object arrays/divs that are meant for displaying content
        removeObjects()
        removeSliderObjects()
        removeTvObjects()
        removeDiv('.content__container')
        removeDiv('.viewmode')

        // fetch movies & then tv shows => creates an array of objects from both
        fetch(valueAddedMovieUrl)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array => build new movie objects 
            const movieData = data.results;
            buildMovieObjects(movieData)   
        })
        .catch((error) => {
            console.log('Error: ', error);
        });

        fetch(valueAddedTVUrl)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array => build new tv objects 
            const movieData = data.results;
            buildTVObjects(movieData)    
        })
        .catch((error) => {
            console.log('Error: ', error);
        });

        // Set Timeout so that it doesnt try to merge the arrays befor they are created
        setTimeout(() => {
            // merge Arrays
            movieObjectArray.push.apply(movieObjectArray, tvObjectArray)
            // Sort new merged array by number of ratings
            movieObjectArray.sort((a,b) => b.numberOfRatings - a.numberOfRatings)
            // Append and create posters
            let appendDestination = buildMoviePosterContainerDiv()               
            buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize)
        }, 300);

        
    }

    function fetchTrendingTV(imageURLSize) {
        fetch(trendingTVURL)
        .then((res) => res.json())
        .then((data) => {
            // data.results [] data is returned as an Array
            const movieData = data.results;
            console.log(movieData);
            
            // Resets Objects => build new movie objects => Creates Movie Poster divs
            removeObjects()
            removeSliderObjects()
            removeDiv('.content__container')
            removeDiv('.viewmode')
            buildMovieObjects(movieData)
            let appendDestination = buildMoviePosterContainerDiv()                     
            buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize, 'tv')
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
    }

// Object Array Functions
    function buildMovieObjects(movieData) {
        // build new objects from movie data and push to movieObjectArray []
        movieData.forEach(element => movieObjectArray.push(new movie(element)))     
    }

    function buildTVObjects(movieData) {
        // build new objects from movie data and push to movieObjectArray []
        movieData.forEach(element => tvObjectArray.push(new movie(element)))     
    }

    function buildSliderObjectsFromMovieObjects() {
        // filters original movie object array, finding only the ones with > 500 ratings => creates sliderObjectArray
        sliderObjectArray = movieObjectArray.filter((x) => {
            if (x.numberOfRatings > 500) {
                return true
            }
        })
    }

    function removeObjects()  {
        // removes an object off the array until the array.length = 0
        for (let i = 0; movieObjectArray.length > 0; i++) {
            movieObjectArray.pop()
        }
    }

    function removeSliderObjects() {
        // removes an object off the array until the array.length = 0
        for (let i = 0; sliderObjectArray.length > 0; i++) {
            sliderObjectArray.pop()
        }
    }

    function removeTvObjects() {
        // removes an object off the array until the array.length = 0
        for (let i = 0; tvObjectArray.length > 0; i++) {
            tvObjectArray.pop()
        }
    }

// Movie Poster Functions
    function buildMoviePosterContainerDiv() {
        // create element => append => return element to be used as appendDestination
        const moviePosterContainer = document.createElement('div')
        moviePosterContainer.className = 'content__container'
        contentDiv.appendChild(moviePosterContainer)
        
        return moviePosterContainer
    }

    function buildMoviePostersWithEachMovieObject(appendDestination, imageURLSize) {
        // Each Function is bound & called from the appropriate movie object in the array
        movieObjectArray.forEach(element => {
            let boundFunction = element.createMovieBlock.bind(element)        
            boundFunction(appendDestination, imageURLSize)            
        });
    }

// Night Mode Functions
    function darkModeButtonToggle() {
        darkModeButton.classList.toggle('active')
        darkModeInnerCircle.classList.toggle('active')
        darkModeMoonIcon.classList.toggle('active')
    }

    function activateDarkMode() {

    }

// Utility Functions (Various Operations)
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
        this.name = individualMovieData.name
        this.firstReleaseDate = individualMovieData.first_air_date
    }

    show() {
        console.log(this);
        
    }

    createMovieBlock(appendDestination, imageURLSize, mediaType) {        
        // Create Div & change class
        const movieElement = document.createElement('div')
        movieElement.className = 'moviePosters'

        // create Event Listener for clicking each poster
        movieElement.addEventListener('click', () => this.toggleMovieView(mediaType))

        // Create HTML Template with poster images
        const movieTemplate = `${this.movieImages(imageURLSize)}`;

        // Delete moviePoster div if there is no posterpath in this object
        if (this.movieImages() == null || this.movieImages() == undefined) {
            return
        } else {
            // Add template to div HTML & append
            movieElement.innerHTML = movieTemplate
            appendDestination.appendChild(movieElement)
        }
    }
    
    movieImages(imageURLSize) {
        // only returns template literal if there is a poster img
        if (this.posterPath == null || this.numberOfRatings <= 10) {
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

    createMovieSlide(imageURLSize) {
        // create slider image div (slide) => create template add to innerhtml 
        let slide = document.createElement('div')
        slide.className = 'backdropimage'

        let slideTemplate = `${this.movieBackdrop(imageURLSize)}`
        slide.innerHTML = slideTemplate

        // create Event Listener for clicking each backdrop
        slide.addEventListener('click', () => this.toggleMovieView())

        return slide 
    }
    
    movieBackdrop(imageURLSize) {
        // only returns template literal if there is a poster img
        if (this.backdropPath == null) {
            return null
        } else {
            return `<img src=${imageURLSize + this.backdropPath} data-movie-id=${this.id}/>`;  
        }
    }

    buildSliderTitle() {
        // Create Div & change class
        const sliderTitle = document.createElement('div')
        sliderTitle.className = 'sliderTitle'

        // Create html Template => add to div innerHTML 
        let sliderTitleTemplateHTML = `${this.sliderTitleTemplate()}`
        sliderTitle.innerHTML = sliderTitleTemplateHTML

        return sliderTitle
    }

    sliderTitleTemplate() {
        return `    <div class='backdropinfo'>
                        <p>Trending Movies</p>
                        <h1>${this.title}</h1>
                    </div>`
        
    }

    toggleMovieView(mediaType) {
        // Create Div & change class
        const viewModeDiv = document.createElement('div')
        viewModeDiv.className = 'viewmode'

        // Create html Template => add to div innerHTML => append to body 
        let viewModeTemplate = `${this.viewModeTemplateMaker()}`
        viewModeDiv.innerHTML = viewModeTemplate
        document.body.appendChild(viewModeDiv)

        this.setBackgroundImage(viewModeDiv)

        // Adds eventlistener to exitbutton which triggers and removes the viewmode from DOM
        document.querySelector('.viewmode__exitbutton').addEventListener('click', () => removeDiv('.viewmode'))
    }

    viewModeTemplateMaker() {
        let titleName
        let releaseDate
        if (this.title == undefined) {
            titleName = this.name
            releaseDate = this.firstReleaseDate
        } else {
            titleName = this.title
            releaseDate = this.releaseDate
        }        
        
        return `
        <div class='viewmode__card'>
                <div class='viewmode__poster'><img src=${imageURLLarge + this.posterPath} data-movie-id=${this.id}/></div>
                <div class='viewmode__info'>
                    <div class='viewmode__infotoolbar'>
                        <div class='info__title'>${titleName}</div>
                        </div>
                        <div class='rating'>
                            <div class='info__rating'>${this.rating}</div>
                            <div class='rating__slash'>/</div>
                            <div class='info__numberofratings'>${this.numberOfRatings}</div>
                            </div>
                        <div class='info__description'>${this.description}</div>
                        <div class='info__additional'>
                            <div class='info__releasedate'>${releaseDate}</div>
                            <div class='viewmode__buttoncontainer'>
                                <button class='viewmode__buttontrailer'><i class="fas fa-play"></i> Watch Trailer</button>
                                <button class='viewmode__buttonfav'><i class="fas fa-bookmark"></i> Favourite</button>
                            </div>  
                        </div>
                        </div>
                <div class="viewmode__exitbutton">
                <i class="fas fa-arrow-left"></i>
                </div>
                </div>
                `
            }
            
            setBackgroundImage(viewModeDiv) {
                let moreImagesURL = `https://api.themoviedb.org/3/movie/${this.id}/images?api_key=${API_KEY}`

                fetch(moreImagesURL)
                .then((res) => res.json())
                .then((data) => {
                    // data.backdrops [] data is returned as an Array
                    const imageData = data.backdrops
                    console.log(imageData);

                    let chosenImagePath = undefined
                    for(let i = 0; i < imageData.length; i++) {
                        if (imageData[i].height >= 1080 && (imageData[i].iso_639_1 === 'en' || imageData[i].iso_639_1 == null)) {
                            if (i >= 1) {
                                chosenImagePath = imageData[i].file_path
                                console.log(chosenImagePath);
                                break
                            } else {
                                continue
                            }
                        } else {
                            continue
                        }
                    }

                    viewModeDiv.style.backgroundImage = `url('${imageURLBackdropAlternate}${chosenImagePath}')`


                })
                .catch((error) => {
                    console.log('Error: ', error);
                });
            }
        }
        
