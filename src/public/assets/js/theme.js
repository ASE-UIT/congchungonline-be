// -----------------------------

//   js index
/* =================== */
/*  
    

    

*/
// -----------------------------

(function ($) {
  /*---------------------
    preloader
    --------------------- */

  $(window).on('load', function () {
    $('#preloader')
      .delay(1000)
      .fadeOut('slow', function () {
        $(this).remove();
      });
  });

  //= ========================
  //  Active current menu while scrolling
  //= ========================

  // ACTIVE CURRENT MENU WHILE SCROLLING

  $(window).on('scroll', function () {
    activeMenuItem($('.nav-menu'));
  });

  // function for active menuitem
  function activeMenuItem($links) {
    const top = $(window).scrollTop();
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();
    const cur_pos = top + 2;
    const sections = $('section');
    const nav = $links;
    const nav_height = nav.outerHeight();
    const home = nav.find(' > ul > li:first');

    sections.each(function () {
      const top = $(this).offset().top - nav_height - 40;
      const bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find('> ul > li > a').parent().removeClass('active');
        nav
          .find(`a[href='#${$(this).attr('id')}']`)
          .parent()
          .addClass('active');
      } else if (cur_pos === 2) {
        nav.find('> ul > li > a').parent().removeClass('active');
        home.addClass('active');
      } else if ($(window).scrollTop() + windowHeight > documentHeight - 400) {
        nav.find('> ul > li > a').parent().removeClass('active');
      }
    });
  }

  //= ========================
  // Smoth Scroll
  //= ========================

  function smoothScrolling($links, $topGap) {
    const links = $links;
    const topGap = $topGap;

    links.on('click', function () {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        let target = $(this.hash);
        target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
        if (target.length) {
          $('html, body').animate(
            {
              scrollTop: target.offset().top - topGap,
            },
            1000,
            'easeInOutExpo'
          );
          return false;
        }
      }
      return false;
    });
  }

  $(window).on('load', function () {
    smoothScrolling($(".main-menu > nav > ul > li > a[href^='#']"), 70);
  });

  //= ========================
  // Slick Nav Activation
  //= ========================
  $('.nav-menu > ul').slicknav({
    prependTo: '.mobile_menu',
  });

  /*---------------------
    screen slider
    --------------------- */
  function screen_slider() {
    const owl = $('.screen-slider');
    owl.owlCarousel({
      loop: true,
      margin: 20,
      navigation: false,
      items: 5,
      smartSpeed: 1000,
      dots: true,
      autoplay: true,
      center: true,
      autoplayTimeout: 2000,
      dotsEach: true,
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 3,
        },
        760: {
          items: 3,
        },
        1080: {
          items: 5,
        },
        1920: {
          items: 5,
        },
      },
    });
  }
  screen_slider();

  /*---------------------
    client carousel
    --------------------- */
  function client_carousel() {
    const owl = $('.client-carousel');
    owl.owlCarousel({
      loop: true,
      margin: 60,
      navigation: false,
      items: 4,
      smartSpeed: 1000,
      dots: false,
      autoplay: true,
      autoplayTimeout: 5000,
      dotsEach: true,
      responsive: {
        0: {
          items: 2,
        },
        480: {
          items: 3,
        },
        760: {
          items: 4,
        },
        1080: {
          items: 4,
        },
        1920: {
          items: 4,
        },
      },
    });
  }
  client_carousel();

  /*---------------------
    testimonial slider
    --------------------- */
  function testimonial_slider() {
    const owl = $('.testimonial-slider');
    owl.owlCarousel({
      loop: true,
      margin: 20,
      navigation: false,
      items: 1,
      smartSpeed: 1000,
      dots: true,
      autoplay: false,
      autoplayTimeout: 2000,
      dotsEach: true,
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 1,
        },
        760: {
          items: 1,
        },
        1080: {
          items: 2,
        },
        1920: {
          items: 2,
        },
      },
    });
  }
  testimonial_slider();

  /*------------------------------
    MagnificPopup Activation
    -------------------------------- */
  /* magnificPopup video view */
  $('.expand-video').magnificPopup({
    type: 'iframe',
  });

  /*------------------------------
    YTP activation
    -------------------------------- */
  $(window).on('load', function () {
    const myPlayer = $('#bgndVideo').YTPlayer();
  });

  /*-----------------------------
    Warm Canvas activation
    ------------------------------- */
  if ($('.warm-canvas').length) {
    $('.warm-canvas').glassyWorms({
      colors: ['#fff', '#c2c2c2'],
      useStyles: true,
      numParticles: 500,
      tailLength: 20,
      maxForce: 8,
      friction: 0.75,
      gravity: 9.81,
      interval: 3,
      // colors: ['#000'],
      // element: $('<canvas class="worms"></canvas>')[0]
    });
  }

  /*------------------------------
         counter
    ------------------------------ */

  $('.counter').counterUp({
    delay: 20,
    time: 2000,
  });

  /*-----------------------------
    Background Paralax activation
    ------------------------------- */
  function bgParallax() {
    if ($('.parallax').length) {
      $('.parallax').each(function () {
        const height = $(this).position().top;
        const resize = height - $(window).scrollTop();
        const parallaxSpeed = $(this).data('speed');
        const doParallax = -(resize / parallaxSpeed);
        const positionValue = `${doParallax}px`;
        const img = $(this).data('bg-image');

        $(this).css({
          backgroundImage: `url(${img})`,
          backgroundPosition: `50%${positionValue}`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        });

        if (window.innerWidth < 768) {
          $(this).css({
            backgroundPosition: 'center center',
          });
        }
      });
    }
  }
  bgParallax();

  $(window).on('scroll', function () {
    bgParallax();
  });
})(jQuery);
