
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function(){
 
  $(".write-focus").on("click", function () {
    if ($(".new-tweet").first().is(":hidden")) {
      $(".new-tweet").slideDown(400);
      $("#tweet-text").focus()
    } else {
      $(".new-tweet").slideUp(400);
    }
  });

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




