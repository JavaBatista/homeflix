var owl = $('.carousel-filme-principal');
owl.owlCarousel({
    items:1,
    loop:true,
    dots: true,
    // margin:10,
    autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    smartSpeed: 500,
    slideTransition: 'linear'

});

$('.carousel-assistidos').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:6
        }
    }
})

$('.carousel-para-assistir').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:6
        }
    }
})