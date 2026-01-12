// MENU BURGER
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');

    // Bloquer le scroll du body quand menu ouvert
    if(navLinks.classList.contains('open')){
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// LOADING

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const hasVisited = localStorage.getItem("visited");

    if (!hasVisited) {
        loader.style.display = "flex"; 

        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("hidden");
                localStorage.setItem("visited", "true");
            }, 1800);
        });
    } else {
        loader.style.display = "none";
    }
});

// Nav hide on scroll
const nav = document.querySelector('.main-nav');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if(currentScrollY > lastScrollY && currentScrollY > 50){
        nav.classList.add('nav-hidden');
    } else {
        nav.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;
});