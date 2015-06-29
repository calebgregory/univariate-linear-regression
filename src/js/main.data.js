var FIREBASE_URL = 'https://regressiondata.firebaseio.com/',
    fb = new Firebase(FIREBASE_URL),
    bucket = {}; // our global variable to hold all the things

// Retrieve data stored in firebase, and put in a matrix
// called data, whose rows represent one sample datum
// and whose column [0] represents POPULATION of a given
// city and whose column [1] represents PROFIT for that
// city.
bucket.data = [];
fb.on("value", function(snapshot) {
  snapshot.val().forEach(function(el,i) {
    var row = [];
    row.push(el.POPULATION,el.PROFIT);
    bucket.data.push(row);
  })
  // FUTURE : because this is asynchronous, we will
  // need to wait for this data to load before drawing
  // anything on our graphs.
});

// ANOTHER WAY of getting our data, using d3!
