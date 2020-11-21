/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {
 
  // Handles dropdown of New Tweet form
  $(".write-focus").on("click", function() {
    $(".new-tweet").slideToggle(400);
    $("#tweet-text").focus();
  });
  
  // return button functionality
  // handles navbar hide
  $(window).scroll(function() {
    const scroll = $(window).scrollTop();
    if (scroll > 500) {
      $(".home").removeClass("invisible");
      $("nav").slideUp(200);
      $(".new-tweet").slideUp(200);
    } else {
      $(".home").addClass("invisible");
      $("nav").slideDown(200);
    }
  });
  // return button functionality
  $(".home").click(() => {
    $("nav").slideDown(0);
    window.scrollTo(0, 0);
  });
  
  const dateAsFullString = (date) => {
    const newDate = new Date(date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = days[newDate.getDay()];
    const day = newDate.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[newDate.getMonth()];
    const year = newDate.getFullYear();
    const hour = newDate.getHours();
    const minute = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
    const readableDate = `${hour}:${minute} | ${weekday} ${day}-${month}-${year}`;
    return readableDate;
  };

  const dateAsShortString = (date) => {
    const newDate = new Date(date);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = days[newDate.getDay()];
    const day = newDate.getDate();
    const hour = newDate.getHours();
    const minute = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
    if (day === Date.now().getDate()) {
      return `Today, ${hour}:${minute}`;
    }
    return `${weekday}, ${hour}:${minute}`
  };

  const determineDateDisplay = (date) => {
    const howRecent = Date.now() - new Date(date);
    if (howRecent < 1000 * 60) {
      return "Less than a minute ago"
    } 
    // within last hour displays minutes ago
    if (howRecent < 1000 * 60 * 60) {
      const minutesAgo = Math.floor(howRecent / (1000 * 60))
      return `${minutesAgo} minutes ago`
    }
    // within last six hour displays hours and minutes ago
    if (howRecent < 1000 * 60 * 60 * 6) {
      const hoursAgo = Math.floor(howRecent / (1000 * 60 * 60))
      const hours = (hoursAgo > 1? "s" : "");
      const minutesAgo = Math.floor((howRecent % (1000 * 60 * 60)) / (1000 * 60))
      return `${hoursAgo} hour${hours} ${minutesAgo} minutes ago`
    }
    // within last six days displays today or weekday as appropriate and the time posted
    if (howRecent < 1000 * 60 * 60 * 24 * 6) {
      return dateAsShortString(date);
    }
    // returns a full date string for tweets more than 6 days old
      return dateAsFullString(date);
   }
   
   
  // generates readable date from timestamp
  // const dateFunction = (date) => {
  //   const newDate = new Date(date);
  //   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const weekday = days[newDate.getDay()];
  //   const day = newDate.getDate();
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   const month = months[newDate.getMonth()];
  //   const year = newDate.getFullYear();
  //   const hour = newDate.getHours();
  //   const minute = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
  //   const readableDate = `${hour}:${minute} | ${weekday} ${day}-${month}-${year}`;
  //   return readableDate;
  // };
 
  
  // Creates HTML encoded tweet from object
  const createTweetElement = function(tweet) {
    const $tweet = $(`
    <article class="tweet">
    <header class="tweet-header">
      <div>
        <img src=${tweet.user.avatars} >
        <span>${tweet.user.name}</span>
      </div>
      <span>${tweet.user.handle}</span>
    </header>
    <p>${tweet.content.text}</p>
    <footer>
      <span>${determineDateDisplay(tweet.created_at)}</span>
      <span><img src="images/reply-message.png"> | <img src="images/share.png"> | <img src="images/heart.png"></span>
    </footer>
    </article> 
    `);
    return $tweet;
  };
  
  // takes array of tweet objects, appends HTML version to tweet container
  const renderTweets = function(array) {
    for (let tweet of array) {
      const $tweet = createTweetElement(tweet);
      $(".show-tweets").append($tweet);
    }
  };

  // tweet composer character counter logic
  $("#tweet-text").on('input', function() {
    const tweetLength = $(this).val().length;
    const counter = $(".counter");
    counter.val(140 - tweetLength);
    if (counter.val() < 0) {
      counter.addClass('red');
    } else {
      counter.removeClass('red');
    }
  });
  

  // protects from cross-site-scripting and enemy hackermans
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // submission and error-handling logic
  $("#tweet-form").on("submit", function(event) {
    event.preventDefault();
    const rawHTML = $("#tweet-text").val();
    // string length checker
    if (rawHTML === null || rawHTML === '' || rawHTML.length > 140) {
      $("#error-msg").show(200);
      setTimeout(() => $("#error-msg").hide(200), 3600);
    } else {
      $("#error-msg").hide(200);
      // sanitises input before submission
      const safeHTML = escape(rawHTML);
      $.ajax("/tweets/", {
        method: "POST",
        data: {text: safeHTML}
      })
        .then(() => {
        // empties the tweet container before refreshing
          $(".show-tweets").empty();
          loadTweets(renderTweets);
          $("#tweet-text").val("");
          $(".counter").val(140);
        });
    }
  });

  // fills the tweet bucket up
  const loadTweets = (done) => {
    $.ajax("/tweets/", {
      method: "GET"
    })
      .then(res => done(res));
  };
  // on page load
  loadTweets(renderTweets);
});




