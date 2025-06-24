// clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const timeString = `${hours}:${minutes}:${seconds}`;
    const dateString = `${day} ${month} ${year} -`;
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${dateString} ${timeString}`;
    }
}

function showLoadingMessage() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = 'Loading time...';
    }
}

showLoadingMessage();
setTimeout(() => {
    updateClock();
    setInterval(updateClock, 1000);
}, 1);

// change maintitle on hover (category)
document.addEventListener("DOMContentLoaded", function () {
    const categories = document.querySelectorAll(".category");
    const maintitle = document.querySelector(".maintitle");
    let resetTimeout;
    let currentMaintitle = maintitle.textContent;

    function changeTitleSmoothly(newText) {
        maintitle.style.opacity = "0";
        setTimeout(() => {
            maintitle.textContent = newText;
            maintitle.style.opacity = "1";
        }, 250);
    }

    function resetToDefault() {
        maintitle.style.opacity = "0";
        setTimeout(() => {
            maintitle.textContent = currentMaintitle;
            maintitle.style.opacity = "0.1";
            maintitle.style.animation = "none";
            void maintitle.offsetWidth;
            maintitle.style.animation = "slide-in 1s ease forwards";
        }, 300);
    }

    categories.forEach(category => {
        category.addEventListener("mouseover", function () {
            clearTimeout(resetTimeout);
            changeTitleSmoothly(this.dataset.title.toLowerCase());
        });

        category.addEventListener("mouseout", function () {
            resetTimeout = setTimeout(() => {
                resetToDefault();
            }, 2000);
        });
    });
});

// google analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-FY6V6RK3CY');