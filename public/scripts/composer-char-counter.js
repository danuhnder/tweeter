$(document).ready(function(){

  $("#tweet-text").on('input', function() {
  const tweetLength = $(this).val().length;
  const counter = $(this).siblings("div").children("output");
  counter.val(140 - tweetLength);
  if (counter.val() < 0) {
    counter.css({color: 'red'});
  } else {
    counter.css({color: 'black'});
  };
  });

});