$(document).ready(function(){

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

});