gsap.registerPlugin(ScrollTrigger);

gsap.from(".quality-container",{
  scrollTrigger:{
    trigger: ".info-trigger",
    start: "center center", 
  },
    xPercent:  -150,
    duration: 0.5,
});

gsap.from(".simplicity-container",{
  scrollTrigger:{
    trigger: ".quality",
    start: "center center",
  },
    xPercent:  150,
    duration: 0.5,
    
});


const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach((accordionItem) => {
    const accordionItemHeader = accordionItem.querySelector(".accordion-item-header");
    const accordionItemBody = accordionItem.querySelector(".accordion-item-body");

    accordionItem.addEventListener("click", () => {
        const isOpen = accordionItemHeader.classList.contains("active");

        accordionItems.forEach(item => {
            item.querySelector(".accordion-item-header").classList.remove("active");
            item.querySelector(".accordion-item-body").style.maxHeight = 0;
        });

        if (!isOpen) {
            accordionItemHeader.classList.add("active");
            accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
        }
    });
});




let tween = gsap.to(".marquee__part", {
  xPercent: -100,
  repeat: -1,
  duration: 10,
  ease: "linear",
}).totalProgress(0.5);

gsap.set(".marquee__inner", { xPercent: -50 });


var timeline = new TimelineMax();

var isMenuOpen = false;

$(document).on('click', '.menu-toggle-btn', function() {
  if (isMenuOpen) {
    timeline.to(".menu-dropdown", 1, {top: '-100%', ease: Expo.easeInOut});
  } else {
    timeline.to(".menu-dropdown", 1, {top: '0%', ease: Expo.easeInOut});
  }
  isMenuOpen = !isMenuOpen;
});

$(document).on('click', '.menu-dropdown a', function(){
  timeline.to(".menu-dropdown", 1, {top: '-100%', ease: Expo.easeInOut});
})

var closeMenu = $(".close-icon");
var openMenu = $(".menu-icon");
var menuToggleBtn = $(".menu-toggle-btn");
var menuLinkSection =  $('.menu-btn-link');
var menuDropdown = $('.menu-dropdown');

closeMenu.addClass("invisible");

menuToggleBtn.click(function(){
  if (openMenu.hasClass("invisible")) {
    openMenu.removeClass("invisible").addClass("visible");
    closeMenu.addClass("invisible").removeClass("visible");
  } else {
    closeMenu.removeClass("invisible").addClass("visible");
    openMenu.addClass("invisible").removeClass("visible");
  }
});

menuLinkSection.click(function(){
  openMenu.addClass("visible").removeClass("invisible");
  closeMenu.addClass("invisible").removeClass("visible");
  isMenuOpen =  false;
});

var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var swiper2 = new Swiper(".mySwiper2", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});




