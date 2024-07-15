function isMobile() {
  return window.innerWidth <= 800;
}

function createTooltip(selector, content, offset = [50, 35], manualTrigger) {
  const options = {
    placement: window.innerWidth > 800 ? "right" : "top",
    content: content.innerHTML,
    allowHTML: true,
    arrow: false,
    offset: offset,
    interactive: true,
    animation: "scale",
  };

  if (manualTrigger || isMobile()) {
    options.trigger = "manual";
  }

  return tippy(selector, options);
}

const textTooltip = document.querySelector("#text-tooltip");
const shirtColorTooltip = document.querySelector("#shirt-color-tooltip");
const shirtSizeTooltip = document.querySelector("#shirt-size-tooltip");
const shirtImageTooltip = document.querySelector("#shirt-image-tooltip");
lucide.createIcons();

// export const textTippy = createTooltip("#text-button", textTooltip);
const shirtColorTippy = createTooltip("#shirt-color-button", shirtColorTooltip);
// const shirtImageTippy = createTooltip("#shirt-image-button", shirtImageTooltip);
const shirtSizeTippy = createTooltip(
  "#shirt-size-button",
  shirtSizeTooltip,
  [
    window.innerWidth > 800 ? 350 : window.innerWidth - 50,
    window.innerWidth > 800 ? window.innerWidth - 310 : 100,
  ],
  false
);

if (!isMobile()) {
  // $(document).on("mouseover", "#text-button", function (params) {
  //   textTippy[0].popper.style.opacity = "1";
  // });

  $(document).on("mouseover", "#shirt-size-button", function (params) {
    shirtSizeTippy[0].popper.style.opacity = "1";
  });

  $(document).on("mouseover", "#shirt-color-button", function (params) {
    shirtColorTippy[0].popper.style.opacity = "1";
  });

  // $(document).on("mouseover", "#shirt-image-button", function (params) {
  //   shirtImageTippy[0].popper.style.opacity = "1";
  // });
} else {
  document.querySelectorAll("#shirt-color-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let tippyInstance;
      if (e.currentTarget === document.querySelector("#text-button")) {
        // tippyInstance = textTippy[0];
      } else if (
        e.currentTarget === document.querySelector("#shirt-size-button")
      ) {
        tippyInstance = shirtSizeTippy[0];
      } else if (
        e.currentTarget === document.querySelector("#shirt-color-button")
      ) {
        tippyInstance = shirtColorTippy[0];
      } else {
        // tippyInstance = shirtImageTippy[0];
      }

      if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active");
        tippyInstance.hide();
      } else {
        e.currentTarget.classList.add("active");
        tippyInstance.show();
      }
    });
  });
}

document.querySelectorAll(".purchase-now-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    shirtSizeTippy[0].show();
    shirtSizeTippy[0].popper.style.opacity = "1";
  });
});

// Slider Code

$(document).ready(function () {
  $(".shirt-slider").slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    prevArrow:
      "<button type='button' class='slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
    nextArrow:
      "<button type='button' class='slick-next pull-right'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
    responsive: [
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
});

// Product Info

$(document).on("click", "#product-info-button", function (params) {
  $(".overlay").removeClass("hidden");
  $(".product-info-div").addClass("show-product-info-div");
});

$(document).on("click", "#close-product-info-div", function (params) {
  $(".overlay").addClass("hidden");
  $(".product-info-div").removeClass("show-product-info-div");
});

$(document).on("click", ".overlay", function (params) {
  $(this).addClass("hidden");
  $(".product-info-div").removeClass("show-product-info-div");
});
