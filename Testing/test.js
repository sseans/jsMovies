const button = document.querySelector('.button');

button.addEventListener('click', modeActivate)

function modeActivate() {
    document.querySelector('.contentContainer').id = 'animation';
    console.log('function-accessed');
    
}

