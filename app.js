// Variables

// Selectors
const movieButton = document.getElementById('movieModeButton')
const content = document.querySelector('.content')

// Event Listeners
movieButton.addEventListener('click', movieMode)

// Functions
function movieMode() {
    document.querySelector('.content').id = 'animationUp';
    setTimeout(function() {removeDiv('content')}, 300);
    setTimeout(bodyChange, 100)
}

function removeDiv(className) {
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function bodyChange() {
    document.querySelector('.defaultBody').className = 'postAnimationBody';
}











