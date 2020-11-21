$(document).ready(function() {
 
  // Creates HTML encoded tweet from object (date function defined in date-functions.js)
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
  
  // takes array of tweet objects, prepends HTML version to tweet container
  const renderTweets = function(array) {
    for (let tweet of array) {
      const $tweet = createTweetElement(tweet);
      $(".show-tweets").prepend($tweet);
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




