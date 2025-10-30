function Arrow({ className, extraClass, onClick, icon }) {
  return (
    <div className={`${className}  ${extraClass}`} onClick={onClick}>
      <i className={icon}></i>
    </div>
  );
}

export const home1Slider = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 800,
  fade: true,
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <Arrow extraClass={"prev"} icon={"fal fa-arrow-left"} />,
  nextArrow: <Arrow extraClass={"next"} icon={"fal fa-arrow-right"} />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        arrows: false,
      },
    },
  ],
};
export const home2Slider = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 800,
  fade: true,
  cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <Arrow extraClass={"prev"} icon={"fal fa-arrow-left"} />,
  nextArrow: <Arrow extraClass={"next"} icon={"fal fa-arrow-right"} />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: false,
      },
    },
  ],
};
export const home3Slider = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  fade: true,
  // appendArrows: sliderArrows,
  cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <Arrow extraClass={"prev"} icon={"fal fa-arrow-left"} />,
  nextArrow: <Arrow extraClass={"next"} icon={"fal fa-arrow-right"} />,
  responsive: [
    {
      breakpoint: 991,
      settings: {
        arrows: false,
      },
    },
  ],
};

export const sliderActive4Item = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
export const sliderActive3Item = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
export const sliderActive3ItemDot = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
export const sliderActive5Item = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export const testimonialSliderOne = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export const partnerSliderOne = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export const placeSlider = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  variableWidth: true,
  centerMode: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export const recentPlaceSlider = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 800,
  autoplay: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
