const button = document.querySelector('.button');
const contentBox = document.querySelector('.contentContainer');

button.addEventListener('click', modeActivate)

function modeActivate() {
    //Move Div Up
    document.querySelector('.textContainer').id = 'animation';
    console.log('function-accessed');
    // Create Div
    setTimeout(createDiv, 800)
    // Remove Div
    setTimeout(function() {
        removeDiv('textContainer')
    }, 500)
    
}

function removeDiv(className) {
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function createDiv() {
    // Create Div
    let element = document.createElement('div')
    contentBox.appendChild(element)
    element.className = 'modeActivated'
    // Create Sub Divs
    for (let i = 0; i < 12; i++) {
        let moviePosters = document.createElement('div')
        element.appendChild(moviePosters)
        moviePosters.className = 'moviePosters'
    }
}
