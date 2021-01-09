// Variables

// Selectors
const movieButton = document.getElementById('movieModeButton')
const content = document.querySelector('.content')

// Event Listeners
movieButton.addEventListener('click', movieMode)

// Functions
function movieMode() {
    document.querySelector('.content').id = 'animationUp';
    setTimeout(function() {removeDiv('content')}, 175);
    setTimeout(colorChange, 40)
    setTimeout(function() {removeDiv('raspberryFooter')}, 175);
    setTimeout(createMoviePosters, 100)
    setTimeout(moviePosterAnimationPlay, 125)
    
}

function removeDiv(className) {
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function colorChange() {
    // Color Change for after background color changed
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

function createMoviePosters() {
    const movieMode = document.createElement('div')
    document.body.appendChild(movieMode)
    movieMode.className = 'movieModeContainer'
    for (let i = 0; i < 12; i++) {
        const moviePosters = document.createElement('div')
        movieMode.appendChild(moviePosters)
        moviePosters.className = 'moviePosters'
    }
}

function moviePosterAnimationPlay() {
    document.querySelector('.movieModeContainer').id = 'posterAnimationUp'
}









