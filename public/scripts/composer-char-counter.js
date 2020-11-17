$(document).ready(function(){

  $("#tweet-text").on('input', function() {
  const tweetLength = $(this).val().length;
  console.log(tweetLength);
  });

});