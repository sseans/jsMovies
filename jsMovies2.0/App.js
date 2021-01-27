// Variables


// Selectors
const hamburgerButton = document.querySelector('.mobileSearch__hamburger')
const dropDown = document.querySelector('.navbar__rightside')
const hamburgerBar = document.querySelectorAll('.hamburger__bar')

// Event Listeners
hamburgerButton.addEventListener('click', hamburgerToggle)

// Functions
function hamburgerToggle() {
    dropDown.classList.toggle('active')
    hamburgerBar.forEach(bar => {
        bar.classList.toggle('active')
    });
}
