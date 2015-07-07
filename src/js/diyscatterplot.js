var diybucket = {}; // our global variable
diybucket.linearRegression = {};
var diylr = diybucket.linearRegression;
diylr.alpha = 0.0003;
diylr.theta = [0,0];
diylr.iterations = 0;

diybucket.data = [
  { x : 5   , y : 4 },
  { x : 15  , y : 20},
  { x : 30  , y : 45},
  { x : 12  , y : 15},
  { x : 60  , y : 70},
  { x : 55  , y : 69},
  { x : 29  , y : 30},
  { x : 44  , y : 40},
  { x : 78  , y : 89},
  { x : 90  , y : 95},
  { x : 69  , y : 77},
  { x : 74  , y : 74},
  { x : 60  , y : 66},
  { x : 100 , y : 96}
];

// SCATTER PLOT SETUP

diybucket.scatterplot = {}; // diybucket for the scatter plot
var diysp = diybucket.scatterplot; // convenience variable
diysp.margin = { top: 20, right: 20, bottom: 30, left: 40 };
diysp.width = 600 - diysp.margin.left - diysp.margin.right;
diysp.height= 313 - diysp.margin.top - diysp.margin.bottom;

// setup x
diysp.xValue = function(d) { return d.x; }; // data -> value
diysp.xScale = d3.scale.linear()
  .domain([0,100])
  .range([0, diysp.width]); // value -> didiysplay
diysp.xMap = function(d) { return diysp.xScale(diysp.xValue(d)); }; // data -> didiysplay
diysp.xAxis = d3.svg.axis()
  .scale(diysp.xScale)
  .orient("bottom");

// setup y
diysp.yValue = function(d) { return d.y; }; // data -> value
diysp.yScale = d3.scale.linear()
  .domain([0,100])
  .range([diysp.height,0]); // value -> didiysplay
diysp.yMap = function(d) { return diysp.yScale(diysp.yValue(d)); }; // data -> didiysplay
diysp.yAxis = d3.svg.axis()
  .scale(diysp.yScale)
  .orient("left");

// setup color scale
diysp.colorScale = d3.scale.linear()
  .range(["hsl(20,90%,40%)", "hsl(180,60%,40%)"]);

// add graph canvas to #scatterplot div
diysp.svg = d3.select("#diyscatterplot").append("svg")
    .attr("width", diysp.width + diysp.margin.left + diysp.margin.right)
    .attr("height", diysp.height + diysp.margin.bottom + diysp.margin.top)
  .append("g")
    .attr("transform", `translate(${diysp.margin.left},${diysp.margin.top})`);

// x-axis
diysp.svg.append("g")
    .attr({
      class : "x axis",
      transform : `translate(0,${diysp.height})`
    })
    .call(diysp.xAxis)
  .append("text")
    .attr({
      class : "label",
      x     : diysp.width,
      y     : -6
    })
    .style("text-anchor", "end")
    .text("x");

// y-axis
diysp.svg.append("g")
    .attr("class", "y axis")
    .call(diysp.yAxis)
  .append("text")
    .attr({
      class : "label",
      transform : "rotate(-90)",
      y     : 6,
      dy    : ".71em"
    })
    .style("text-anchor", "end")
    .text("y");

// CHANGES TO SCATTER PLOT
diybucket.update = function() {

  // buffer added to data domain to prevent overlapping axis
//  diysp.xScale.domain([d3.min(data,diysp.xValue)-1, d3.max(data,diysp.xValue)+1]);
//  diysp.yScale.domain([d3.min(data,diysp.yValue)-1, d3.max(data,diysp.yValue)+1]);
  diysp.xScale.domain([0,100]);
  diysp.yScale.domain([0,100]);
  diysp.colorScale.domain([d3.min(diybucket.data,diysp.yValue)-1,d3.max(diybucket.data,diysp.yValue)+1]).nice();

  // update axes
  diysp.svg.select(".x.axis")
    .transition()
    .duration(1000)
    .call(diysp.xAxis);

  diysp.svg.select(".y.axis")
    .transition()
    .duration(1000)
    .call(diysp.yAxis);

  // dots
  var dots = diysp.svg.selectAll(".dot")
    .data(diybucket.data)
    .attr({
      class : "dot",
      r     : 3.5,
      cx    : diysp.xMap,
      cy    : diysp.yMap
    })
    .style("fill", function(d) { return diysp.colorScale(diysp.yValue(d)); })

  dots.enter()
    .append("circle")
    .attr({
      class : "dot",
      r     : 3.5,
      cx    : diysp.xMap,
      cy    : diysp.yMap
    })
    .style("fill", function(d) { return diysp.colorScale(diysp.yValue(d)); })
    .on("click", function(d,i) {
      if (diybucket.data.length > 2) {
        diybucket.data.splice(i,1);
      } else {
        alert('hey man, not cool. \n\neveryone knows there have to exist at least two points for a line to exist.')
      }
      diybucket.update();
    });

  dots.exit().remove();

  // calculate theta values using gradient descent
  // begins with a "guess", which is theta_0 = 0, theta_1 = 0
  // a.k.a. - the x-axis (y = 0 * x + 0 => y = 0)

  diylr.alpha = diylr.alpha || 0.0003,
  diylr.theta = diylr.theta || [0,0],
  diylr.jHistory = [],
  diylr.thetaHistory = [];
  var i = 0,
      difference = function() {
        return diylr.jHistory[i-2] ?
          diylr.jHistory[i-2] - diylr.jHistory[i-1] :
          1;
      };

  do {
    diylr.theta = gradientDescent(diybucket.data,diylr.alpha,diylr.theta);
    diylr.jHistory.push(J(diybucket.data,diylr.theta));
    diylr.thetaHistory.push(diylr.theta);
    i++;
  } while (difference() > 0.0001);

  diylr.iterations = i;

  var maxX = d3.max(diybucket.data,diysp.xValue);
  // var minX = d3.min(diybucket.data,diysp.xValue);
  var minX = 0;
  diysp.svg.selectAll("line").remove();
  var lineOfBestFit = diysp.svg.append("line")
    .attr({
      x1 : diysp.xScale(minX),
      y1 : diysp.yScale(minX*diylr.theta[1] + diylr.theta[0]),
      x2 : diysp.xScale(maxX),
      y2 : diysp.yScale(maxX*diylr.theta[1] + diylr.theta[0]),
      "stroke" : "#1CDEC4",
      "stroke-width" : 2
    });

  // display the equation for the line of best fit
  var docFrag = document.createDocumentFragment();
  var eq = document.createElement('P');
  docFrag.appendChild(eq);
  var eqText = document.createTextNode(`y = ${diylr.theta[1].toPrecision(3)}x + ${diylr.theta[0].toPrecision(3)}`);
  eq.appendChild(eqText);
  $("#diyequation").empty();
  $("#diyequation").append(docFrag);

  var docFrag2 = document.createDocumentFragment();
  var numIters = document.createElement('P');
  docFrag2.appendChild(numIters);
  var numItersText = document.createTextNode(`number of iterations: ${diylr.iterations}`);
  numIters.appendChild(numItersText);
  $("#num-iters").empty();
  $("#num-iters").append(docFrag2);
};
diybucket.update();

// adds a new, randomly generated datum to graph
d3.select("#diyadd")
  .on("click", function() {
    var newDot = {};
    newDot.x = Math.floor(Math.random() * 100);
    newDot.y = Math.floor(Math.random() * 100);
    diybucket.data.push(newDot);
    diybucket.update();
  });

$('#diyvals').on('submit', function() {
  diylr.theta[0] = $('#diyvals input:nth-child(1)').val();
  diylr.theta[1] = $('#diyvals input:nth-child(2)').val();
  diylr.alpha = $('#diyvals input:nth-child(3)').val();
  event.preventDefault();
  diybucket.update();
});
