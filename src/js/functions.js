// These are the functions required to get our cost function, J
// analogous to function J = computeCost(X,y,theta)

function jsArr(data) {
  var jsArr = [];
  data.forEach(function(el) {
    var datum = [1,el.x,el.y];
    jsArr.push(datum);
  });
  return jsArr;
}

// hypotheses(jsArr(data),theta)
// analogous to hypotheses = X * theta
// theta will be returned by gradient descent
function hypotheses(jsArr,theta) {
  var hypotheses = [];
  jsArr.forEach(function(el) {
    hypotheses.push(theta[0]*el[0] + theta[1]*el[1]);
  });
  return hypotheses;
}

// squaredError(jsArr,hypotheses(jsArr))
// these are two arrays of the same length
// analogous to sqErr = (hypotheses - y).^2
function squaredError(jsArr,hypotheses) {
  var sqErr = [];
  jsArr.forEach(function(el,i) {
    var err = hypotheses[i] - el[2];
    sqErr.push(Math.pow(err,2));
  })
  return sqErr;
}

function errs(data,theta) {
  var jsAr = jsArr(data);
  var errs = [];
  var hyp = hypotheses(jsAr,theta);
  jsAr.forEach(function(el,i) {
    errs.push(hyp[i] - el[2]);
  });
  return errs;
}

// this can be called by, when
// theta = [0,0],
// analogous to J = 1/(2*m) * sum(sqErr)
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
