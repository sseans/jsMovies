// Selectors
const button = document.querySelector('.button');

// Event Listeners
button.addEventListener('click', modeActivate)

// Functions
function modeActivate() {
    //Move Content Div Up
    document.querySelector('.textContainer').id = 'textAnimationUp';
    // Remove contentContainer Div
    setTimeout(function() {removeDiv('contentContainer')}, 375)
    // Create modeActivated Div
    setTimeout(createDiv, 300)
    // Move modeActivated Div Up
    setTimeout(posterAnimation, 300)
    
}

function removeDiv(className) {
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function createDiv() {
    // Create New contentBox Div
    let contentBox = document.createElement('div')
    document.body.appendChild(contentBox)
    contentBox.className = 'contentContainerMovie'
    // Create modeActivated Div
    let element = document.createElement('div')
    contentBox.appendChild(element)
    element.className = 'modeActivated'
    // Create Sub Divs (moviePosters)
    for (let i = 0; i < 12; i++) {
        let moviePosters = document.createElement('div')
        element.appendChild(moviePosters)
        moviePosters.className = 'moviePosters'
    }
}

function posterAnimation() {
    document.querySelector('.modeActivated').id = 'posterAnimationUp';
}
