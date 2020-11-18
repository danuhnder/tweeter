// const { JSDOM } = require( "jsdom" );
// const {window} = new JSDOM ("");
// const $ = require("jquery")(window);
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function(){

  // const tweets = [
  // {
  //   "user": {
  //     "name": "Newton",
  //     "avatars": "https://i.imgur.com/73hZDYK.png"
  //     ,
  //     "handle": "@SirIsaac"
  //   },
  //   "content": {
  //     "text": "If I have seen further it is by standing on the shoulders of giants, not that shortass Robert Hooke"
  //   },
  //   "created_at": 1461116232227
  //   },
  // {
  //   "user": {
  //     "name": "Descartes",
  //     "avatars": "https://i.imgur.com/nlhLi3I.png",
  //     "handle": "@rd" },
  //   "content": {
  //     "text": "Je pense , donc je suis, je pense?"
  //   },
  //   "created_at": 1461113959088
  //   }
  // ];
 
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
        <span>${tweet.created_at}</span>
        <span>icons</span>
      </footer>
    </article> 
    `);
    return $tweet;   
  };
  
  const renderTweets = function(array) {
    for (let tweet of array) {
      const $tweet = createTweetElement(tweet);
      $(".show-tweets").append($tweet);
    }
  };

  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  $("#tweet-form").on("submit", function (event) {
    event.preventDefault();
    const rawHTML = $("#tweet-text").val();
    if (rawHTML === null || rawHTML === '' || rawHTML.length > 140) {
      $("#error-msg").show(200);
      setTimeout( () => $("#error-msg").hide(200), 3600);
    } else {
      $("#error-msg").hide(200)
      const safeHTML = escape(rawHTML);
      $.ajax("/tweets/", {
        method: "POST",
        data: {text: safeHTML}
      })
      .then(
        () => loadTweets(renderTweets),
        $("#tweet-text").val("")
      );
    };
  });

  const loadTweets = (done) => {
    $.ajax("/tweets/", {
      method: "GET"
    })
    .then(res => done(res));
  }

    loadTweets(renderTweets)
});




