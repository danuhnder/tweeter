$(document).ready(() => {
 
  // Creates HTML encoded tweet from object (date function defined in date-functions.js)
  const createTweetElement = (tweet) => {
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
  const renderTweets = (array) => {
    for (let tweet of array) {
      const $tweet = createTweetElement(tweet);
      $(".show-tweets").prepend($tweet);
    }
  };

  // fills the tweet bucket up
  const loadTweets = (done) => {
    $.ajax("/tweets/", {
      method: "GET"
    })
      .then(res => done(res));
  };
  
  // Runs on page load.
  loadTweets(renderTweets);
 
  
  // validates input text length and protects from cross-site-scripting and enemy hackermans
  const validator = (str) => {
    if (str === null || str === '' || str.length > 140) {
      return null;
    }
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  
  // tweet submission and error-handling logic
  $("#tweet-form").on("submit", function(event) {
    event.preventDefault();
    const validatedText = validator($("#tweet-text").val());
    if (!validatedText) {
      $("#error-msg").show(200);
      setTimeout(() => $("#error-msg").hide(200), 3600);
    } else {
      $("#error-msg").hide(200);
        $.ajax("/tweets/", {
        method: "POST",
        data: {text: validatedText}
      })
        .then(() => {
        // clears the tweet container, renders tweets, resets textarea and counter
          $(".show-tweets").empty();
          loadTweets(renderTweets);
          $("#tweet-text").val("");
          $(".counter").val(140);
        });
    }
  });

});




