var AlchemyAPI = require('./alchemyapi'),
    alchemyapi = new AlchemyAPI();

var myText = "Big Bird is probably like my favorite character in the excellent show Sesame Street. I am so excited to see where Big Bird goes in his many exciting adventures.";
alchemyapi.sentiment('text', myText, {}, function(response) {
  console.log("Sentiment: " + response["docSentiment"]["type"]);
});
