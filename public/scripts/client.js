/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function(){
 
  // Handles dropdown of New Tweet form
  $(".write-focus").on("click", function () {
    $(".new-tweet").slideToggle(400);
    $("#tweet-text").focus();
  });

  // generates readable date from timestamp
  const dateFunction = (date) => {
    const newDate = new Date(date)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = days[newDate.getDay()];
    const day = newDate.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = months[newDate.getMonth()];
    const year = newDate.getFullYear();
    const hour = newDate.getHours();
    const minute = (newDate.getMinutes()<10 ? '0' : '' ) + newDate.getMinutes();
    const readableDate = `${hour}:${minute} | ${weekday} ${day}-${month}-${year}`;
    return readableDate;
  };

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
        <span>${dateFunction(tweet.created_at)}</span>
        <span>icons</span>
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
  // tweet composer character counter
  $("#tweet-text").on('input', function() {
    const tweetLength = $(this).val().length;
    const counter = $(this).siblings().children("output");
    counter.val(140 - tweetLength);
    if (counter.val() < 0) {
      counter.addClass('red');
    } else {
      counter.removeClass('red');
    };
    });
  

  // protects from cross-site-scripting and enemy hackermans
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // submission and error-handling logic
  $("#tweet-form").on("submit", function (event) {
    event.preventDefault();
    const rawHTML = $("#tweet-text").val();
    // string length checker
    if (rawHTML === null || rawHTML === '' || rawHTML.length > 140) {
      $("#error-msg").show(200);
      setTimeout( () => $("#error-msg").hide(200), 3600);
    } else {
      $("#error-msg").hide(200)
      // sanitises input before submission
      const safeHTML = escape(rawHTML);
      $.ajax("/tweets/", {
        method: "POST",
        data: {text: safeHTML}
      })
      .then( () => {
        // empties the tweet container before refreshing 
        $(".show-tweets").empty();
        loadTweets(renderTweets);
        $("#tweet-text").val("");
      });
    };
  });

  // fills the tweet bucket up
  const loadTweets = (done) => {
    $.ajax("/tweets/", {
      method: "GET"
    })
    .then(res => done(res));
  }
  // on page load
    loadTweets(renderTweets)
});




