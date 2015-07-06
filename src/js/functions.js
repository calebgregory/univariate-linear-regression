// our cost function, J, which accepts a hypothetical
// vector theta, which in this case has two values,
// and returns the cost of this hypothesis, or
// 1/(2*m) * [sum of the square errors for each datum].
//
// analogous to J = 1/(2*m) * sum(sqErr) in Octave.
function J(data,theta) {

  var jsArr = [];
  data.forEach(function(el) {
    var datum = [1,el.x,el.y];
    jsArr.push(datum);
  });

  var hypotheses = [];
  jsArr.forEach(function(el) {
    hypotheses.push(theta[0]*el[0] + theta[1]*el[1]);
  });

  var sqErr = [];
  jsArr.forEach(function(el,i) {
    var err = hypotheses[i] - el[2];
    sqErr.push(Math.pow(err,2));
  })

  var sumSqErr = sqErr
    .reduce(function(prev,curr) {
      return prev + curr;
  });

  var m = jsArr.length;
  var J = 1 / (2 * m) * sumSqErr;
  return J;
};

// analogous to repeat until convergence: {
//   theta = oldtheta - alpha * delta;
// }, where
// delta = (1/m) * (X' * (X * oldtheta - oldtheta))
function gradientDescent(data,alpha,theta) {

  // takes each datum in our data set, represented as a
  // row in our matrix, adds a value (x_0 = 1) to each row,
  // and pushes the row onto the matrix jsArr, short for
  // javaScriptArray.
  var jsArr = [];
  data.forEach(function(el) {
    var datum = [1,el.x,el.y];
    jsArr.push(datum);
  });

  // hypotheses = X * theta
  var hypotheses = [];
  jsArr.forEach(function(el) {
    hypotheses.push(theta[0]*el[0] + theta[1]*el[1]);
  });

  // difference = hypotheses - y
  var errs = [];
  jsArr.forEach(function(el,i) {
    var err = hypotheses[i] - el[2];
    errs.push(err);
  });

  // X', or the transposition of X
  var xtrans = [[],[]];
  jsArr.forEach(function(el) {
    xtrans[0].push(el[0]);
    xtrans[1].push(el[1]);
  });

  // delta = (1/m) * (X' * difference)
  var delta = [];
  xtrans.forEach(function(row) {
    var deltaVal = 0;
    errs.forEach(function(el,i) {
      deltaVal += el*row[i];
    });
    var m = jsArr.length;
    delta.push(deltaVal / m);
  });

  var newtheta = [];
  theta.forEach(function(el,i) {
    newtheta.push(theta[i] - alpha*delta[i]);
  });

  return newtheta;
};
