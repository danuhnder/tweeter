$(document).ready(() => {
  
  // Handles dropdown of New Tweet form
  $(".write-focus").on("click", () => {
    $(".new-tweet").slideToggle(400);
    $("#tweet-text").focus();
  });

  // tweet composer character counter logic
  $("#tweet-text").on('input', () => {
    const tweetLength = $("#tweet-text").val().length;
    const counter = $(".counter");
    counter.val(140 - tweetLength);
    if (counter.val() < 0) {
      counter.addClass('red');
    } else {
      counter.removeClass('red');
    }
  });

   // hides navbar and reveals home button on scroll
  $(window).scroll(() => {
    const scroll = $(window).scrollTop();
    if (scroll > 500) {
      $(".home").removeClass("invisible");
      $("nav").slideUp(200);
    } else {
      $(".home").addClass("invisible");
      $("nav").slideDown(200);
    }
  });

  // home button returns to top of screen
  $(".home").click(() => {
    $("nav").slideDown(0);
    window.scrollTo(0, 0);
  });

});